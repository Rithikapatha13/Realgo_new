import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads, getStats, getActivities } from '@/services/crm.service';
import { getUser } from '@/services/auth.service';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import StatCard from '@/components/CRM/StatCard';
import CallModal from '@/components/CRM/CallModal';
import { Phone, Flame, Clock, ClipboardList, CheckCircle, ChevronRight, MessageSquare, ArrowLeft } from 'lucide-react';

export default function TcDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [acts, setActs] = useState([]);
  const [callLead, setCallLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchAll() {
    try {
      const [lr, sr, ar] = await Promise.all([
        getLeads({ status: 'ALL' }),
        getStats(),
        getActivities()
      ]);
      setLeads(lr.leads || []);
      setStats(sr.stats || null);
      setActs(ar.activities || []);
    } catch (error) {
      console.error("Dashboard sync failed", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* BACK BUTTON */}
      

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Call Queue Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Hello {user?.firstName}, you have {leads.length} leads in your workflow today.</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Assigned Leads" 
          value={stats?.total || 0} 
          gradient="linear-gradient(135deg,#3b82f6,#6366f1)" 
          icon={<ClipboardList />} 
          onClick={() => navigate('/leads')}
        />
        <StatCard 
          label="Hot Status" 
          value={stats?.hot || 0} 
          gradient="linear-gradient(135deg,#f43f5e,#fb923c)" 
          icon={<Flame />} 
          onClick={() => navigate('/leads?status=HOT')}
        />
        <StatCard 
          label="Call Later" 
          value={stats?.later || 0} 
          gradient="linear-gradient(135deg,#a78bfa,#6366f1)" 
          icon={<Clock />} 
          onClick={() => navigate('/leads/followups')}
        />
        <StatCard 
          label="Done (Site Visit)" 
          value={stats?.sitevisits || 0} 
          gradient="linear-gradient(135deg,#10b981,#34d399)" 
          icon={<Phone />} 
          onClick={() => navigate('/leads?status=SITEVISIT')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIPELINE & BREAKDOWN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <ClipboardList size={14} className="text-primary-500" /> Lead Pipeline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['NEW', 'WARM', 'HOT', 'COLD'].map(s => {
                const ls = leads.filter(l => l.leadStatus === s);
                const colors = { NEW: "text-emerald-500", WARM: "text-amber-500", HOT: "text-rose-500", COLD: "text-slate-400" };
                const bgs = { NEW: "bg-emerald-50/50", WARM: "bg-amber-50/50", HOT: "bg-rose-50/50", COLD: "bg-slate-50/50" };
                const borders = { NEW: "border-emerald-100", WARM: "border-amber-100", HOT: "border-rose-100", COLD: "border-slate-100" };
                
                return (
                  <div 
                    key={s} 
                    className={`${bgs[s]} border ${borders[s]} rounded-2xl p-4 flex flex-col group hover:shadow-md transition-all cursor-pointer`}
                    onClick={() => navigate(`/leads?status=${s}`)}
                  >
                    <div className={`text-[11px] font-black uppercase tracking-widest mb-4 flex justify-between ${colors[s]}`}>
                      <span>{s}</span>
                      <span className="bg-white px-2 py-0.5 rounded-lg shadow-sm border border-inherit">{ls.length}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      {ls.slice(0, 3).map(l => (
                        <div key={l.id} className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                          <div className="text-[11px] font-bold text-slate-700 truncate">{l.leadName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5 font-medium">{l.leadContact}</div>
                        </div>
                      ))}
                      {ls.length > 3 && (
                        <div className="text-[9px] font-black text-slate-400 uppercase text-center pt-1">
                          +{ls.length - 3} more
                        </div>
                      )}
                      {ls.length === 0 && (
                        <div className="h-16 flex flex-col items-center justify-center opacity-20">
                          <div className="text-[9px] font-black uppercase mt-1">Empty</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <CheckCircle size={14} className="text-secondary-500" /> Distribution Breakdown
            </h2>
            <div className="space-y-4">
              {['HOT', 'WARM', 'COLD', 'NEW'].map(s => {
                const count = stats?.[s.toLowerCase()] || 0;
                const total = stats?.total || 1;
                const pct = (count / total) * 100;
                const bgs = { HOT: "bg-rose-500", WARM: "bg-amber-500", COLD: "bg-slate-400", NEW: "bg-emerald-500" };
                return (
                  <div key={s}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-600">{s}</span>
                      <span className="text-slate-400">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${bgs[s]} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* FEED PANEL */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <MessageSquare size={14} className="text-primary-500" /> Recent Activities
          </h2>

          <div className="max-h-[500px] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
            {acts.length > 0 ? acts.map(a => (
              <div key={a.id} className="relative pl-5 pb-4 border-l-2 border-slate-50 last:border-0 last:pb-0">
                <div 
                  className="absolute left-0 top-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" 
                  style={{ backgroundColor: a.color || '#3b82f6' }} 
                />
                <div className="text-[11px] text-slate-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: a.text }} />
                <div className="text-[9px] text-slate-400 mt-1 font-bold flex items-center gap-1 uppercase tracking-wider">
                  <Clock size={10} /> {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                </div>
              </div>
            )) : (
              <div className="py-16 text-center opacity-30">
                <MessageSquare className="mx-auto mb-2 text-slate-300" size={24} />
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quiet for now</div>
              </div>
            )}
          </div>

          <button
            onClick={fetchAll}
            className="w-full mt-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            Sync Queue <ChevronRight size={10} />
          </button>
        </div>
      </div>

      {callLead && (
        <CallModal
          lead={callLead}
          onClose={() => setCallLead(null)}
          onSaved={() => {
            setCallLead(null)
            fetchAll()
          }}
        />
      )}
    </div>
  );
}
