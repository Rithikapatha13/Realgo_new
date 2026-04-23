import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, Flame, Clock, ClipboardList, CheckCircle, 
  MessageSquare, ChevronRight, Activity, TrendingUp 
} from "lucide-react";
import { getStats, getActivities } from "@/services/crm.service";
import { formatDistanceToNow } from "date-fns";
import StatCard from "@/components/CRM/StatCard";
import { getUser } from "@/services/auth.service";

export default function TcDash() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, actRes] = await Promise.all([
        getStats(),
        getActivities()
      ]);
      setStats(statsRes.stats);
      setActivities(actRes.activities);
    } catch (error) {
      console.error("TC Dashboard load error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing your call queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Call Queue Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            Hello {user?.firstName}, you have <span className="text-primary-600 font-bold">{stats?.total || 0}</span> leads in your workflow today.
          </p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard 
          label="Assigned Leads" 
          value={stats?.total || 0} 
          gradient="linear-gradient(135deg,#3b82f6,#6366f1)" 
          icon={<ClipboardList size={18} />} 
          filterType="ALL" 
        />
        <StatCard 
          label="Hot Status" 
          value={stats?.hot || 0} 
          gradient="linear-gradient(135deg,#f43f5e,#fb923c)" 
          icon={<Flame size={18} />} 
          filterType="HOT" 
        />
        <StatCard 
          label="Call Later" 
          value={stats?.later || 0} 
          gradient="linear-gradient(135deg,#a78bfa,#6366f1)" 
          icon={<Clock size={18} />} 
          filterType="LATER"
          onClick={() => navigate('/leads/followups')}
        />
        <StatCard 
          label="Done Today" 
          value={stats?.doneToday || 0} 
          gradient="linear-gradient(135deg,#10b981,#34d399)" 
          icon={<Phone size={18} />} 
          filterType="ALL" 
        />
        <StatCard 
          label="Hot Conv. Rate" 
          value={`${stats?.total ? ((stats.hot / stats.total) * 100).toFixed(1) : 0}%`} 
          gradient="linear-gradient(135deg,#db2777,#f43f5e)" 
          icon={<TrendingUp size={18} />} 
          filterType="HOT" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIPELINE SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <ClipboardList size={18} className="text-primary-600" /> Lead Pipeline
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {['NEW', 'WARM', 'HOT', 'COLD'].map(s => (
                <div 
                  key={s} 
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col group hover:border-primary-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => navigate(`/leads?status=${s}`)}
                >
                  <div className={`text-[11px] font-black uppercase tracking-widest mb-4 flex justify-between ${
                    s === 'NEW' ? 'text-emerald-500' : 
                    s === 'WARM' ? 'text-amber-500' : 
                    s === 'HOT' ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    <span>{s}</span>
                    <span className="bg-white/50 px-2 py-0.5 rounded-lg border border-slate-200">{stats?.[s.toLowerCase()] || 0}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${
                        s === 'NEW' ? 'bg-emerald-500' : 
                        s === 'WARM' ? 'bg-amber-500' : 
                        s === 'HOT' ? 'bg-rose-500' : 'bg-slate-400'
                      } transition-all`} 
                      style={{ width: `${stats?.total ? ((stats[s.toLowerCase()] / stats.total) * 100) : 0}%` }} 
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {stats?.total ? Math.round((stats[s.toLowerCase()] / stats.total) * 100) : 0}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <CheckCircle size={18} className="text-primary-600" /> Distribution Breakdown
             </h2>
             <div className="space-y-4">
                {['HOT', 'WARM', 'COLD', 'NEW'].map(s => {
                   const count = stats?.[s.toLowerCase()] || 0;
                   const pct = stats?.total ? (count / stats.total) * 100 : 0;
                   const color = s === 'HOT' ? 'bg-rose-500' : s === 'WARM' ? 'bg-amber-500' : s === 'NEW' ? 'bg-emerald-500' : 'bg-slate-400';
                   return (
                     <div key={s}>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                           <span className="text-slate-600">{s} Status</span>
                           <span className="text-slate-400">{count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                           <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                     </div>
                   )
                })}
             </div>
          </div>
        </div>

        {/* FEED PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <MessageSquare size={16} className="text-primary-600" /> Recent Activities
          </h2>

          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
            {activities.length > 0 ? activities.slice(0, 15).map(a => (
              <div key={a.id} className="relative pl-5 pb-5 border-l border-slate-100 last:border-0 last:pb-0">
                <div 
                  className="absolute left-0 top-0 -translate-x-1/2 w-2 h-2 rounded-full ring-4 ring-white shadow-sm" 
                  style={{ backgroundColor: a.color || '#3b82f6' }} 
                />
                <div className="text-[11px] text-slate-600 font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: a.text }} />
                <div className="text-[9px] text-slate-400 mt-2 font-black flex items-center gap-1 uppercase tracking-widest">
                  <Clock size={10} /> {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                </div>
              </div>
            )) : (
              <div className="py-10 text-center opacity-30 uppercase font-black text-[10px] tracking-widest text-slate-400">
                Quiet for now
              </div>
            )}
          </div>

          <button
            onClick={fetchDashboardData}
            className="w-full mt-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
          >
            Sync Dashboard <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
