import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Flame, Thermometer, Handshake, DollarSign, 
  Inbox, Snowflake, Clock, Activity, TrendingUp, 
  CheckCircle, AlertCircle, Phone, MessageSquare, ChevronRight, ClipboardList 
} from 'lucide-react';
import { getStats, getActivities } from "@/services/crm.service";
import { formatDistanceToNow } from "date-fns";
import StatCard from "@/components/CRM/StatCard";

export default function CRMDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [leads, setLeads] = useState([]); // This will be used for the pipeline columns
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto-refresh every 30s
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
      // We might need to fetch lead list separately if not in stats, 
      // but for demonstration I'll assume they come in stats or we can use activities
    } catch (error) {
      console.error("Dashboard load error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatClick = (status) => {
    navigate(`/leads?status=${status}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            CRM Executive Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">Real-time performance metrics and pipeline health.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate("/leads")}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <ClipboardList size={18} /> View All Leads
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard 
          label="Total Leads" 
          value={stats?.total || 0} 
          gradient="linear-gradient(135deg,#3b82f6,#6366f1)" 
          icon={<Users />} 
          filterType="ALL"
        />
        <StatCard 
          label="Unassigned" 
          value={stats?.unassigned || 0} 
          gradient="linear-gradient(135deg,#94a3b8,#475569)" 
          icon={<Inbox />} 
          filterType="UNASSIGNED"
        />
        <StatCard 
          label="Hot Leads" 
          value={stats?.hot || 0} 
          gradient="linear-gradient(135deg,#f43f5e,#fb923c)" 
          icon={<Flame />} 
          filterType="HOT"
        />
        <StatCard 
          label="Warm Leads" 
          value={stats?.warm || 0} 
          gradient="linear-gradient(135deg,#f59e0b,#d97706)" 
          icon={<Thermometer />} 
          filterType="WARM"
        />
        <StatCard 
          label="Site Visits" 
          value={stats?.sitevisits || 0} 
          gradient="linear-gradient(135deg,#10b981,#34d399)" 
          icon={<Handshake />} 
          filterType="SITEVISIT"
        />
        <StatCard 
          label="Bookings" 
          value={stats?.booked || 0} 
          gradient="linear-gradient(135deg,#8b5cf6,#a78bfa)" 
          icon={<DollarSign />} 
          filterType="BOOKED"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* LEAD PIPELINE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Activity size={18} className="text-primary-600" /> Lead Pipeline
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'NEW', count: stats?.new, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
              { label: 'UNASSIGNED', count: stats?.unassigned, color: 'text-slate-500', bg: 'bg-slate-500/10' },
              { label: 'WARM', count: stats?.warm, color: 'text-amber-600', bg: 'bg-amber-500/10' },
              { label: 'HOT', count: stats?.hot, color: 'text-rose-600', bg: 'bg-rose-500/10' },
              { label: 'COLD', count: stats?.cold, color: 'text-sky-600', bg: 'bg-sky-500/10' },
            ].map((s) => (
              <div 
                key={s.label} 
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col group hover:border-primary-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => handleStatClick(s.label)}
              >
                <div className={`text-[10px] font-black uppercase tracking-widest mb-4 flex justify-between ${s.color}`}>
                  <span>{s.label}</span>
                  <span className={`${s.bg} px-2 py-0.5 rounded-lg`}>{s.count || 0}</span>
                </div>
                <div className="flex-1 space-y-2">
                   <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color.replace('text', 'bg')} transition-all`} style={{ width: `${(s.count / (stats?.total || 1)) * 100}%` }} />
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 text-center">{( (s.count / (stats?.total || 1)) * 100).toFixed(0)}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
            <Flame size={18} className="text-rose-500" /> Live Stream
          </h2>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {activities.length > 0 ? activities.slice(0, 10).map((act) => (
              <div key={act.id} className="relative pl-6 pb-6 border-l border-slate-100 last:border-0 last:pb-0">
                <div 
                  className="absolute left-0 top-1 -translate-x-1/2 w-2 h-2 rounded-full ring-4 ring-white" 
                  style={{ backgroundColor: act.color || '#3b82f6' }} 
                />
                <p className="text-[11px] text-slate-600 font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: act.text }} />
                <p className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-widest flex items-center gap-1">
                  <Clock size={10} /> {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                </p>
              </div>
            )) : (
              <div className="py-12 text-center opacity-40 uppercase font-black text-xs tracking-widest text-slate-300">
                No events detected
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

      {/* RANKINGS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" /> Telecaller Rankings
          </h2>
          <div className="space-y-3">
            {stats?.rankings?.telecallers?.map((u, idx) => (
              <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-primary-500/30 transition-all">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${idx < 3 ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 text-slate-500'}`}>
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">{u.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black mt-0.5">{u.score} Conversions</p>
                </div>
              </div>
            ))}
            {(!stats?.rankings?.telecallers || stats?.rankings?.telecallers.length === 0) && (
              <p className="text-center text-slate-400 text-[10px] py-10 uppercase font-black tracking-widest">No rankings yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-600 mb-6 border border-primary-200">
            <AlertCircle size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Daily Performance Check</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-[280px] leading-relaxed">
            Stay on top of your targets. Use the Reports module for more granular historical data and productivity trends.
          </p>
          <button 
            onClick={() => navigate("/reports")}
            className="mt-6 text-primary-600 text-[10px] font-black uppercase tracking-widest hover:underline"
          >
            Go to Reports
          </button>
        </div>
      </div>
    </div>
  );
}
