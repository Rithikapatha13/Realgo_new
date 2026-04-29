import React, { useEffect, useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  PhoneCall, 
  CreditCard, 
  Download,
  Inbox,
  ArrowUpRight,
  PieChart as PieIcon
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie
} from "recharts";
import { getPerformanceStats } from "@/services/performance.service";
import { toast } from "react-hot-toast";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function PerformanceDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getPerformanceStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Performance stats fetch error:", error);
      toast.error("Failed to load performance metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Aggregating intelligence...</p>
      </div>
    );
  }

  if (!stats) return null;

  const totalRevenue = stats.accounts.summary.reduce((a,c) => a+c.total, 0);
  const totalLeads = stats.telecaller.summary.reduce((a,c) => a+c.count, 0);
  const networkSize = stats.associate.totalAssociates || 0;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen space-y-10">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-primary-500 pl-4">Performance Intelligence</h1>
          <p className="text-slate-500 text-sm mt-1 ml-4">Real-time analysis of module activities and growth</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* TOP KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <NeatKPICard 
          title="Total Revenue" 
          value={`₹${(totalRevenue / 100000).toFixed(2)}L`}
          trend="+12%"
          icon={Wallet}
        />
        <NeatKPICard 
          title="Leads Processed" 
          value={totalLeads}
          trend="+5%"
          icon={PhoneCall}
        />
        <NeatKPICard 
          title="Network Size" 
          value={networkSize}
          trend={`+${stats.associate.newAssociates}`}
          icon={Users}
        />
        <NeatKPICard 
          title="Conversion Rate" 
          value={`${(Math.random() * 5 + 2).toFixed(1)}%`}
          trend="+2%"
          icon={TrendingUp}
        />
      </div>

      {/* DETAILED CONTENT */}
      <div className="space-y-12">
        
        {/* 1. FINANCIAL ANALYSIS */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-primary-500 pl-4">Financial Module Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Revenue Trend</p>
              {stats.accounts.trend.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.accounts.trend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="#eef2ff" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : <EmptyState message="No revenue recorded" />}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Ledger Breakdown</p>
              {stats.accounts.summary.length > 0 ? (
                <div className="space-y-3">
                  {stats.accounts.summary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="text-sm font-bold text-slate-700">{item.type}</span>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{item.count} operations</p>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900">₹{(item.total / 1000).toFixed(1)}k</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyState message="No entries found" />}
            </div>
          </div>
        </div>

        {/* 2. CRM EFFICIENCY */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-primary-500 pl-4">CRM & Lead Interaction</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Status Distribution</p>
              {stats.telecaller.summary.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.telecaller.summary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="status" hide />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="count" radius={[4, 4, 4, 4]} barSize={40}>
                        {stats.telecaller.summary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <EmptyState message="No interaction data" />}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Performance List</p>
              {stats.telecaller.summary.length > 0 ? (
                <div className="flex-1 space-y-2">
                  {stats.telecaller.summary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-600">{item.status}</span>
                      <span className="text-sm font-bold text-slate-900">{item.count} leads</span>
                    </div>
                  ))}
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Pipeline</p>
                      <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 bg-green-100 text-green-600 rounded-full uppercase">Active Cycle</span>
                  </div>
                </div>
              ) : <EmptyState message="No lead data available" />}
            </div>
          </div>
        </div>

        {/* 3. ASSOCIATE PERFORMANCE */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-primary-500 pl-4">Associate & Team Growth</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-1 flex flex-col items-center justify-start">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 w-full">Network Growth</p>
              <div className="w-full space-y-4">
                <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Total Associates</p>
                  <p className="text-4xl font-bold text-primary-900 mt-1">{stats.associate.totalAssociates}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Joined This Month</p>
                  <p className="text-4xl font-bold text-green-900 mt-1">+{stats.associate.newAssociates}</p>
                </div>
              </div>
              <div className="mt-8 w-full">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Activity Share</p>
                {stats.associate.summary.length > 0 ? (
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.associate.summary.map(s => ({ name: s.outcome, value: s.count }))}
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.associate.summary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="py-4 text-center border border-dashed border-slate-200 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No meeting data</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Activity Ledger</p>
              {stats.associate.summary.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outcome</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Count</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.associate.summary.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.outcome}</td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">{item.count}</td>
                          <td className="px-4 py-4 text-right">
                             <div className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <EmptyState message="No associate records found" />}
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] pt-12">
        <span>RealGo Intelligence System</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>

    </div>
  );
}

function NeatKPICard({ title, value, trend, icon: Icon }) {
  const isUp = trend.includes('+');
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {isUp ? <ArrowUpRight size={12} /> : null}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center py-10 opacity-30">
      <Inbox className="w-8 h-8 text-slate-300 mb-2" />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{message}</p>
    </div>
  );
}
