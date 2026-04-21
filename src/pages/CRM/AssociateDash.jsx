import React, { useState, useEffect, useCallback } from "react";
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
  ShieldCheck,
  Flame,
  Award,
  Handshake,
  LayoutDashboard,
  Activity,
  MessageSquare,
  Plus
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { getStats, getRecentLeads } from "@/services/crm.service";
import { getTeamTree } from "@/services/user.service";
import { getProjects } from "@/services/project.service";
import { toast } from "react-hot-toast";
import Typewriter from "typewriter-effect";

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#64748b", "#8b5cf6", "#ec4899"];

export default function AssociateDash() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, treeRes, projRes, recentRes] = await Promise.all([
        getStats(),
        getTeamTree(),
        getProjects(),
        getRecentLeads()
      ]);

      setStats(statsRes.stats || null);
      setTreeData(treeRes?.items || treeRes || null);
      setProjects(projRes?.items || []);
      setRecentLeads(recentRes?.leads || []);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Synchronizing Your Workspace...</p>
      </div>
    );
  }

  // Prepare Chart Data
  const leadDistribution = stats ? [
    { name: "Hot", value: stats.hot },
    { name: "Warm", value: stats.warm },
    { name: "Cold", value: stats.cold },
    { name: "SiteVisit", value: stats.sitevisits },
  ].filter(d => d.value > 0) : [];

  // Team summary from tree
  const flattenTeam = (node, acc = []) => {
    if (!node) return acc;
    if (node.id !== user.id) acc.push(node);
    if (node.childs) node.childs.forEach(c => flattenTeam(c, acc));
    return acc;
  };
  const myTeam = treeData ? flattenTeam(treeData) : [];

  return (
    <div className="space-y-6 pb-10 min-h-screen">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[35vh] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <img
          src="/assets/Banner/banner.jpg"
          alt="Grupe Banner"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 flex flex-col justify-center px-10">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString(`Welcome back, ${user.firstName || 'Associate'}`).start();
              }}
              options={{
                delay: 70,
                cursor: "",
              }}
            />
          </div>
          <div className="mt-2 text-slate-700 font-bold max-w-lg">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1200)
                  .typeString("Here's your premium command center for Leadflow & Realgo.")
                  .start();
              }}
              options={{
                delay: 40,
                cursor: "",
              }}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => navigate("/leads")}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center gap-2"
            >
              <LayoutDashboard size={14} /> My Desk
            </button>
          </div>
        </div>
      </div>

      {/* ================= QUICK ACCESS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <QuickAccessTile
          title="Projects"
          subtitle="Manage ventures"
          icon={Briefcase}
          bg="bg-blue-100"
          iconBg="bg-blue-500"
          onClick={() => navigate("/Projects")}
        />
        <QuickAccessTile
          title="Team"
          subtitle="Your associates"
          icon={Users}
          bg="bg-purple-100"
          iconBg="bg-purple-500"
          onClick={() => navigate("/my-team")}
        />
        <QuickAccessTile
          title="Designs"
          subtitle="Media & creatives"
          icon={UserCheck}
          bg="bg-pink-100"
          iconBg="bg-pink-500"
          onClick={() => navigate("/greetings")}
        />
        <QuickAccessTile
          title="News"
          subtitle="Latest updates"
          icon={MessageSquare}
          bg="bg-emerald-100"
          iconBg="bg-emerald-500"
          onClick={() => navigate("/news")}
        />
        <QuickAccessTile
          title="Reports"
          subtitle="View analytics"
          icon={TrendingUp}
          bg="bg-amber-100"
          iconBg="bg-amber-500"
          onClick={() => navigate("/reports")}
        />
        <QuickAccessTile
          title="Site Visits"
          subtitle="Log activity"
          icon={MapPin}
          bg="bg-indigo-100"
          iconBg="bg-indigo-500"
          onClick={() => navigate("/customer-sitevisits")}
        />
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Leads"
          value={stats?.total || 0}
          subtitle="Lifetime leads in your pipeline"
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          title="Hot Prospects"
          value={stats?.hot || 0}
          subtitle="High conversion priority"
          icon={Flame}
          color="bg-rose-50 text-rose-600"
        />
        <KpiCard
          title="Site Visits"
          value={stats?.sitevisits || 0}
          subtitle="Upcoming & completed tours"
          icon={Handshake}
          color="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title="My Network"
          value={myTeam.length}
          subtitle="Direct and indirect subordinates"
          icon={GitBranchIconCustom}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TEAM PERFORMANCE TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="text-primary-500" size={20} />
              Team Performance Tracking
            </h2>
            <BarChart3 className="text-slate-300" size={20} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-800">
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Progress</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {myTeam.slice(0, 6).map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors text-slate-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                            {member.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="font-semibold text-slate-800 text-sm">{member.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase ring-1 ring-slate-200">
                        {member.title || "Associate"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-xs font-bold text-primary-600">Active</div>
                      <div className="text-[9px] text-slate-400 font-medium uppercase">Network Member</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    </td>
                  </tr>
                ))}
                {myTeam.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic text-sm">
                      Start building your team to track performance here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100">
            <button 
                onClick={() => navigate("/tree")}
                className="text-[10px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest flex items-center gap-1"
            >
                View Full Organization Tree <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* PIPELINE SPLIT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col text-slate-800">
          <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={20} />
            Lead Quality Split
          </h2>

          <div className="flex-1 h-64 min-h-[250px]">
            {leadDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Add leads to see pipeline distribution
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Conversion Focus</span>
              <span className="font-bold text-slate-800">
                {stats?.total > 0 ? Math.round(((stats.hot + stats.sitevisits) / stats.total) * 100) : 0}% High Bio
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${stats?.total > 0 ? ((stats.hot + stats.sitevisits) / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT LEADS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              Recent Activities
            </h2>
            <button 
                onClick={() => navigate("/leads")}
                className="text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              Pipeline <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {recentLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-primary-600 border border-slate-100 shadow-sm">
                    {lead.leadName?.charAt(0) || "L"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{lead.leadName}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase">Source: {lead.leadSource}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      lead.leadStatus === 'HOT' ? 'bg-rose-100 text-rose-600' : 
                      lead.leadStatus === 'WARM' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                      {lead.leadStatus}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="py-10 text-center text-slate-400 italic text-sm">
                No recent leads in your desk.
              </div>
            )}
          </div>
        </div>

        {/* INCENTIVES & GROWTH */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between group h-full">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

          <div className="relative">
            <h3 className="text-2xl font-black mb-3">Maximize Your Rewards</h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed font-medium">
              Check out the latest incentive structures for our active projects. Reach higher levels for better commission percentages.
            </p>
          </div>

          <div className="relative mt-8 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 border border-primary-500/30">
                    <Award size={24} />
                  </div>
                  <div className="flex-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Projects</div>
                      <div className="text-2xl font-black">{projects.length}</div>
                  </div>
                  <button 
                    onClick={() => navigate("/project-incentives")}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                  >
                      <ChevronRight size={20} />
                  </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target</div>
                        <div className="text-xl font-bold">₹0</div>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Level</div>
                        <div className="text-xl font-bold text-primary-400">Pioneer</div>
                    </div>
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
      <div className="flex items-start justify-between mb-4 text-slate-800">
        <div className={`p-2.5 rounded-xl ${color} transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
          <Icon size={22} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mb-1">{value}</h3>
        <p className="text-xs text-slate-500 font-medium truncate">{subtitle}</p>
      </div>
    </div>
  );
}

function QuickAccessTile({ title, subtitle, icon: Icon, bg, iconBg, onClick }) {
    return (
      <div
        onClick={onClick}
        className={`rounded-xl p-4 cursor-pointer transition hover:shadow-md ${bg}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">{title}</p>
          <div
            className={`h-9 w-9 rounded-full ${iconBg} flex items-center justify-center text-white`}
          >
            <Icon size={16} />
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 font-medium">{subtitle}</p>
      </div>
    );
}

function GitBranchIconCustom(props) {
    return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
      )
}
