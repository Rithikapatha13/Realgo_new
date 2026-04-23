import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  CreditCard,
  Flame,
  ClipboardList,
  LayoutDashboard,
  Activity,
  Phone,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStats, getRecentLeads, getRecentMeetings } from "@/services/crm.service";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import StatCard from "@/components/CRM/StatCard";

export default function AssociateDash() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [leads, setLeads] = useState([]);
  const [meetings, setMeets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, recentLeadsRes, recentMeetingsRes] = await Promise.all([
        getStats(),
        getRecentLeads(),
        getRecentMeetings()
      ]);

      setStats(statsRes.stats || null);
      setLeads(recentLeadsRes.leads?.filter(l => l.leadStatus === "HOT") || []);
      setMeets(recentMeetingsRes.meetings || []);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing Hot Lead Dashboard...</p>
      </div>
    );
  }

  const outcomeColors = {
    SITEVISIT: '#f59e0b',
    INTERESTED: '#3b82f6',
    BOOKED: '#10b981',
    COLD: '#94a3b8',
    FOLLOWUP: '#6366f1'
  };

  return (
    <div className="space-y-8 pb-12 min-h-screen text-slate-800">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Hot Leads Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Real-time high-intent leads auto-assigned to your desk
          </p>

        </div>
      </div>

      {/* STATS GRID - 7 COLUMNS (LeadFlow style, Realgo Branded Colors) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard 
          label="Hot Leads" 
          value={leads.length} 
          gradient="linear-gradient(135deg,#f43f5e,#fb923c)" 
          icon={<Flame />} 
          filterType="HOT"
        />
        <StatCard 
          label="Meetings" 
          value={meetings.length} 
          gradient="linear-gradient(135deg,#6366f1,#818cf8)" 
          icon={<Calendar />} 
          filterType="all"
        />
        <StatCard 
          label="Site Visits" 
          value={stats?.sitevisits || 0} 
          gradient="linear-gradient(135deg,#f59e0b,#fbbf24)" 
          icon={<MapPin />} 
          filterType="SITEVISIT"
        />
        <StatCard 
          label="SV Target%" 
          value={`${stats?.total ? ((stats.sitevisits / stats.total) * 100).toFixed(1) : 0}%`} 
          gradient="linear-gradient(135deg,#10b981,#34d399)" 
          icon={<CheckCircle />} 
          filterType="SITEVISIT"
        />
        <StatCard 
          label="Bookings" 
          value={stats?.booked || 0} 
          gradient="linear-gradient(135deg,#06b6d4,#22d3ee)" 
          icon={<DollarSign />} 
          filterType="BOOKED"
        />
        <StatCard 
          label="Payments" 
          value={stats?.paymentPending || 0} 
          gradient="linear-gradient(135deg,#8b5cf6,#a78bfa)" 
          icon={<CreditCard />} 
          filterType="PAYMENT_PENDING"
        />
        <StatCard 
          label="Followups" 
          value={stats?.later || 0} 
          gradient="linear-gradient(135deg,#64748b,#94a3b8)" 
          icon={<Clock />} 
          onClick={() => navigate('/leads/followups')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIPELINE & CHARTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" /> Hot Lead Pipeline
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {['SITEVISIT', 'INTERESTED', 'BOOKED', 'COLD'].map(s => {
                const ls = leads.filter(l => l.assocStatus === s || (s === 'COLD' && (!l.assocStatus || l.assocStatus === 'COLD')));
                const colors = { SITEVISIT: "text-amber-600", INTERESTED: "text-blue-600", BOOKED: "text-emerald-600", COLD: "text-slate-400" };
                return (
                  <div
                    key={s}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col group hover:bg-white hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/leads?status=${s}`)}
                  >
                    <div className={`text-[11px] font-black uppercase tracking-widest mb-4 flex justify-between ${colors[s]}`}>
                      <span>{s}</span>
                      <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-100 text-slate-600 font-bold">{ls.length}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      {ls.slice(0, 3).map(l => (
                        <div key={l.id} className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                          <div className="text-xs font-bold text-slate-800 truncate">{l.leadName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{l.leadContact}</div>
                        </div>
                      ))}
                      {ls.length > 3 && (
                        <div className="text-[9px] font-black text-slate-400 uppercase text-center pt-1">
                          +{ls.length - 3} more leads
                        </div>
                      )}
                      {ls.length === 0 && (
                        <div className="h-16 flex flex-col items-center justify-center opacity-30">
                          <div className="text-[9px] font-black uppercase mt-1 text-slate-300 tracking-widest text-center">Empty Pipeline</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" /> Outcome Distribution
            </h2>
            <div className="space-y-4">
              {['SITEVISIT', 'INTERESTED', 'BOOKED', 'COLD'].map(s => {
                const count = stats?.[s.toLowerCase()] || 0;
                const pct = stats?.total ? (count / stats.total) * 100 : 0;
                const bgs = { SITEVISIT: "bg-amber-500", INTERESTED: "bg-blue-500", BOOKED: "bg-emerald-500", COLD: "bg-slate-500" };
                return (
                  <div key={s}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600">{s} Status</span>
                      <span className="text-slate-400">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                      <div className={`h-full ${bgs[s]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RECENT MEETINGS PANEL (LeadFlow style) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" /> Recent Meetings ({meetings.length})
            </h2>
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {meetings.length > 0 ? meetings.map(m => (
              <div key={m.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-current opacity-[0.03] -mr-6 -mt-6 rounded-full" style={{ color: outcomeColors[m.outcome] }} />

                <div className="flex items-center justify-between mb-2">
                  <div className="font-black text-slate-800 text-sm truncate pr-2">
                    {m.lead?.leadName || 'Unknown Lead'}
                  </div>
                  <div className="text-[8px] font-black px-2 py-0.5 rounded border uppercase" style={{ color: outcomeColors[m.outcome], borderColor: outcomeColors[m.outcome] + '40', background: outcomeColors[m.outcome] + '10' }}>
                    {m.outcome}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
                  <Clock size={10} />
                  {m.meetingDate
                    ? format(new Date(m.meetingDate), 'dd MMM yyyy · hh:mm a')
                    : 'Date not set'}
                </div>

                {m.notes && (
                  <div className="text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-100 line-clamp-2 italic leading-relaxed">
                    "{m.notes}"
                  </div>
                )}
              </div>
            )) : (
              <div className="py-20 text-center opacity-20">
                <div className="text-4xl mb-4 grayscale text-slate-300">📅</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">No meetings logged yet</div>
              </div>
            )}
          </div>

          <button
            onClick={fetchDashboardData}
            className="w-full mt-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            Refresh Dashboard <Activity size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
