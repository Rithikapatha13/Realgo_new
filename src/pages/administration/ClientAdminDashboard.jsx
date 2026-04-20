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
  ArrowLeft
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getClientAdminDashboardStats } from "@/services/clientAdmin.service";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#64748b"];

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
        <p className="text-slate-500 font-medium animate-pulse">Initializing Client Analytics...</p>
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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Client Administration</h1>
          <p className="text-slate-500 text-sm">Real-time overview of module-admins and organization performance.</p>
        </div>
        {/* <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
          <ShieldAlert size={14} />
          CLIENT ADMIN MODE
        </div> */}
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Organization"
          value={summary.totalUsers + summary.totalAdmins}
          subtitle={`${summary.totalUsers} Associates / ${summary.totalAdmins} Admins`}
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          title="Active Projects"
          value={summary.totalProjects}
          subtitle="Managed across all regions"
          icon={Briefcase}
          color="bg-purple-50 text-purple-600"
        />
        <KpiCard
          title="Revenue (30d)"
          value={`₹${summary.totalRevenue30Days.toLocaleString()}`}
          subtitle="Total transactions recorded"
          icon={DollarSign}
          color="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title="Total Plots"
          value={summary.plots.total}
          subtitle={`${summary.plots.available} Available for sale`}
          icon={MapPin}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SUB-ADMIN PERFORMANCE (MONETIZATION TRACKING) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="text-indigo-500" size={20} />
              Module-Admin Performance Tracking
            </h2>
            <BarChart3 className="text-slate-300" size={20} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sub-Admin</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role / Module</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Work Done</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subAdminPerformance.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{admin.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase ring-1 ring-slate-200">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-indigo-600">{admin.workCount}</div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase">{admin.workLabel}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${admin.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </td>
                  </tr>
                ))}
                {subAdminPerformance.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic text-sm">
                      No module-admins found in your organization.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVENTORY SPLIT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={20} />
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                No plot data available
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Utilization Rate</span>
              <span className="font-bold text-slate-800">
                {summary.plots.total > 0 ? Math.round(((summary.plots.booked + summary.plots.registered) / summary.plots.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${summary.plots.total > 0 ? ((summary.plots.booked + summary.plots.registered) / summary.plots.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT LEADS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              Recent Lead Inflow
            </h2>
            <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-300 border border-slate-100 shadow-sm">
                    {lead.leadName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{lead.leadName}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase">Source: {lead.leadSource}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-600">BY {lead.user.username}</div>
                  <div className="text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</div>
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
        <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

          <div className="relative">
            <h3 className="text-xl font-bold mb-2">Grow Your Organization</h3>
            <p className="text-indigo-200 text-sm max-w-xs leading-relaxed">
              Add module-specific admins to delegate work and monitor their direct performance from this panel.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <div className="text-2xl font-bold">{summary.totalUsers}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Associates</div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <div className="text-2xl font-bold group-hover:count-up">{summary.totalAdmins}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Administrators</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color} transition-transform group-hover:scale-110 duration-300`}>
          <Icon size={22} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-xs text-slate-500 font-medium truncate">{subtitle}</p>
      </div>
    </div>
  );
}
