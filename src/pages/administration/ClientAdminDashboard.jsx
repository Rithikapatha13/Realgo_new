import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  MapPin,
  UserCheck,
  DollarSign,
  Clock,
  BarChart3,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getClientAdminDashboardStats } from "@/services/clientAdmin.service";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const COLOR_MAP = {
  Available: "#10b981", // Emerald
  Booked: "#f59e0b",    // Amber
  Registered: "#6366f1" // Indigo
};

const formatAdminName = (name) => {
  if (!name) return "Sub-Admin";
  const cleaned = name.replace(/null\s+/gi, "").replace(/\s+null/gi, "").trim();
  return cleaned || "Sub-Admin";
};

export default function ClientAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getClientAdminDashboardStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-slate-500 font-semibold animate-pulse tracking-wide text-xs">Initializing Client Analytics...</p>
      </div>
    );
  }

  if (!stats) return null;

  const { summary, subAdminPerformance, recentLeads } = stats;

  const plotData = [
    { name: "Available", value: summary.plots.available },
    { name: "Booked", value: summary.plots.booked },
    { name: "Registered", value: summary.plots.registered },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 pb-10">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Organization Overview</h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Real-time metrics and sub-admin performance tracking.</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total Organization"
          value={summary.totalUsers + summary.totalAdmins}
          subtitle={`${summary.totalUsers} Associates / ${summary.totalAdmins} Admins`}
          icon={Users}
          colorTheme="blue"
        />
        <KpiCard
          title="Active Projects"
          value={summary.totalProjects}
          subtitle="Managed across all regions"
          icon={Briefcase}
          colorTheme="purple"
        />
        <KpiCard
          title="Revenue (30d)"
          value={`₹${summary.totalRevenue30Days.toLocaleString()}`}
          subtitle="Total transactions recorded"
          icon={DollarSign}
          colorTheme="emerald"
        />
        <KpiCard
          title="Total Plots"
          value={summary.plots.total}
          subtitle={`${summary.plots.available} Available for sale`}
          icon={MapPin}
          colorTheme="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SUB-ADMIN PERFORMANCE (MONETIZATION TRACKING) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="text-indigo-500" size={18} />
              Module-Admin Performance Tracking
            </h2>
            <BarChart3 className="text-slate-400" size={18} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/40">
                  <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sub-Admin</th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Role / Module</th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Work Done</th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subAdminPerformance.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100/30 text-indigo-700 border border-indigo-200/30 flex items-center justify-center text-xs font-bold shadow-sm">
                          {formatAdminName(admin.name).charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-slate-800 text-sm">{formatAdminName(admin.name)}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-slate-100/80 text-slate-600 border border-slate-200/50 uppercase">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="text-sm font-bold text-indigo-600">{admin.workCount}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{admin.workLabel}</div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        admin.status === 'VERIFIED' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {admin.status === 'VERIFIED' ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {subAdminPerformance.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-10 text-center text-slate-400 italic text-sm">
                      No module-admins found in your organization.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVENTORY SPLIT */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={18} />
            Inventory Status
          </h2>

          <div className="flex-1 h-64 min-h-[250px]">
            {plotData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plotData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {plotData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name] || "#64748b"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #f1f5f9', 
                      backgroundColor: '#ffffff', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic text-xs">
                No plot data available
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-semibold">Utilization Rate</span>
              <span className="font-bold text-slate-800">
                {summary.plots.total > 0 ? Math.round(((summary.plots.booked + summary.plots.registered) / summary.plots.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${summary.plots.total > 0 ? ((summary.plots.booked + summary.plots.registered) / summary.plots.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT LEADS */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-500" size={18} />
              Recent Lead Inflow
            </h2>
            <button 
              onClick={() => navigate("/leads")} 
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/60 bg-slate-50/40 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200/40 shadow-sm">
                    {lead.leadName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{lead.leadName}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                        Source: {lead.leadSource}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-700">Added by {lead.user.username}</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="py-10 text-center text-slate-400 italic text-sm">
                No recent leads recorded.
              </div>
            )}
          </div>
        </div>

        {/* QUICK LINKS / SUMMARY */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden flex flex-col justify-between group border border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-120 transition-transform duration-750" />

          <div className="relative">
            <h3 className="text-lg font-bold">Grow Your Organization</h3>
            <p className="text-indigo-200/80 text-xs mt-1 max-w-xs leading-relaxed">
              Add module-specific admins to delegate work and monitor their direct performance from this panel.
            </p>
          </div>

          <div className="relative mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto flex-1">
              <div className="p-3 bg-white/[0.04] rounded-lg border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <div className="text-lg font-bold tracking-tight">{summary.totalUsers}</div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-300 mt-0.5">Associates</div>
              </div>
              <div className="p-3 bg-white/[0.04] rounded-lg border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <div className="text-lg font-bold tracking-tight">{summary.totalAdmins}</div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-300 mt-0.5">Administrators</div>
              </div>
            </div>
            <button 
              onClick={() => navigate("/users")} 
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 border border-indigo-500/30 w-full sm:w-auto"
            >
              Manage Members
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, icon: Icon, colorTheme }) {
  const themes = {
    blue: {
      bg: "bg-blue-50/60 text-blue-600 border border-blue-100/50",
      glow: "group-hover:ring-blue-100/50"
    },
    purple: {
      bg: "bg-purple-50/60 text-purple-600 border border-purple-100/50",
      glow: "group-hover:ring-purple-100/50"
    },
    emerald: {
      bg: "bg-emerald-50/60 text-emerald-600 border border-emerald-100/50",
      glow: "group-hover:ring-emerald-100/50"
    },
    amber: {
      bg: "bg-amber-50/60 text-amber-600 border border-amber-100/50",
      glow: "group-hover:ring-amber-100/50"
    }
  };
  const activeTheme = themes[colorTheme] || themes.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50/30 to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="flex items-start justify-between mb-3.5 relative z-10">
        <div className={`p-2.5 rounded-lg ${activeTheme.bg} transition-all duration-300 group-hover:scale-105`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{value}</h3>
        <p className="text-xs text-slate-500 font-medium truncate">{subtitle}</p>
      </div>
    </div>
  );
}
