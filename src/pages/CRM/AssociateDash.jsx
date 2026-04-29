import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  CreditCard,
  Flame,
  ClipboardList,
  Activity,
  Phone,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStats, getRecentLeads } from "@/services/crm.service";
import { toast } from "react-hot-toast";
import StatCard from "@/components/CRM/StatCard";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from "recharts";

export default function AssociateDash() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, recentLeadsRes] = await Promise.all([
        getStats(),
        getRecentLeads()
      ]);

      setStats(statsRes.stats || null);
      setLeads(recentLeadsRes.leads || []);
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
        <p className="text-slate-500 font-medium animate-pulse">Syncing Lead Dashboard...</p>
      </div>
    );
  }

  // Data for Pie Chart
  const pieData = [
    { name: 'HOT', value: leads.filter(l => l.leadStatus === 'HOT').length, color: '#f43f5e' },
    { name: 'WARM', value: leads.filter(l => l.leadStatus === 'WARM').length, color: '#f59e0b' },
    { name: 'COLD', value: leads.filter(l => l.leadStatus === 'COLD').length, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 pb-12 min-h-screen text-slate-800">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Lead Performance Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your pipeline across Hot, Warm, and Cold lead categories
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          label="Hot Leads" 
          value={leads.filter(l => l.leadStatus === "HOT").length} 
          gradient="linear-gradient(135deg,#f43f5e,#fb923c)" 
          icon={<Flame />} 
          filterType="HOT"
        />
        <StatCard 
          label="Warm Leads" 
          value={leads.filter(l => l.leadStatus === "WARM").length} 
          gradient="linear-gradient(135deg,#f59e0b,#fbbf24)" 
          icon={<Activity />} 
          filterType="WARM"
        />
        <StatCard 
          label="Cold Leads" 
          value={leads.filter(l => l.leadStatus === "COLD").length} 
          gradient="linear-gradient(135deg,#64748b,#94a3b8)" 
          icon={<Clock />} 
          filterType="COLD"
        />
        <StatCard 
          label="Site Visits" 
          value={stats?.sitevisits || 0} 
          gradient="linear-gradient(135deg,#10b981,#34d399)" 
          icon={<MapPin />} 
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIPELINE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" /> Main Lead Pipeline
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {['HOT', 'WARM', 'COLD'].map(s => {
                const ls = leads.filter(l => l.leadStatus === s);
                const colors = { HOT: "text-rose-600", WARM: "text-amber-600", COLD: "text-slate-400" };
                const bgs = { HOT: "bg-rose-50", WARM: "bg-amber-50", COLD: "bg-slate-50" };
                return (
                  <div
                    key={s}
                    className={`${bgs[s]} border border-slate-100 rounded-2xl p-4 flex flex-col group hover:bg-white hover:shadow-md transition-all cursor-pointer`}
                    onClick={() => navigate(`/leads?status=${s}`)}
                  >
                    <div className={`text-[11px] font-black uppercase tracking-widest mb-4 flex justify-between ${colors[s]}`}>
                      <span>{s}</span>
                      <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-100 text-slate-600 font-bold">{ls.length}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      {ls.slice(0, 5).map(l => (
                        <div key={l.id} className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                          <div className="text-xs font-bold text-slate-800 truncate">{l.leadName}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex justify-between">
                            <span>{l.leadContact}</span>
                            {l.assocStatus && <span className="text-emerald-600 font-black text-[8px] uppercase">{l.assocStatus}</span>}
                          </div>
                        </div>
                      ))}
                      {ls.length > 5 && (
                        <div className="text-[9px] font-black text-slate-400 uppercase text-center pt-1">
                          +{ls.length - 5} more leads
                        </div>
                      )}
                      {ls.length === 0 && (
                        <div className="h-24 flex flex-col items-center justify-center opacity-30">
                          <div className="text-[9px] font-black uppercase mt-1 text-slate-300 tracking-widest text-center">No {s} Leads</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LEAD INSIGHTS PIE CHART */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-fit">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Activity size={16} className="text-primary-500" /> Lead Insights
          </h2>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/leads?status=${item.name}`)}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name} Leads</span>
                </div>
                <span className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                  {item.value}
                </span>
              </div>
            ))}
            {pieData.length === 0 && (
              <div className="text-center py-10 opacity-20 text-xs font-bold uppercase tracking-widest">
                No active data
              </div>
            )}
          </div>

          <button
            onClick={fetchDashboardData}
            className="w-full mt-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            Refresh Insights <Activity size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
