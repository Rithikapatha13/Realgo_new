import AssociateDash from "../CRM/AssociateDash";
import { useNavigate, Navigate } from "react-router-dom";
import { Users, Briefcase, UserCheck, ShieldCheck, Activity, Clock, Flame, ClipboardList, MessageSquare, Calendar, ArrowLeft } from "lucide-react";
import CompactCalendar from "../../components/Calendar/CompactCalendar";
import Typewriter from "typewriter-effect";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import SystemDashboard from "../SuperAdmin/SystemDashboard";
import FinanceHome from "../Finance/FinanceHome";
import ClientAdminDashboard from "../administration/ClientAdminDashboard";
import { getStats, getActivities, getRecentLeads } from "@/services/crm.service";
import { formatDistanceToNow } from 'date-fns';
import TelecallerHome from "../CRM/TelecallerHome";
import MarketingHome from "../Marketing/MarketingHome";
import { getUser, getUserType } from "@/services/auth.service";
import { getHomeStats } from "@/services/common.service";





/* ================= QUICK ACCESS CARDS ================= */
const cards = [
  {
    title: "Projects",
    path: "/projects-home",
    image: "/assets/images/project.svg",
  },
  { title: "Team", path: "/team-home", image: "/assets/images/team.svg" },
  { title: "Designs", path: "/greetings", image: "/assets/images/designs.svg" },
  { title: "News", path: "/news", image: "/assets/images/news.svg" },
  { title: "Reports", path: "/reports", image: "/assets/images/reports.svg" },
  {
    title: "Services",
    path: "/services-home",
    image: "/assets/images/services.svg",
  },
];

const salesData = [
  { name: "Registered", value: 100 },
  { name: "Booked", value: 70 },
  { name: "Available", value: 100 },
  { name: "Hold", value: 60 },
];

const COLORS = ["#ff0000", "#ffa500", "#228b22", "#808080"];

export default function Home() {
  const navigate = useNavigate();
  const [openPending, setOpenPending] = useState(false);
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [pendingAssociates, setPendingAssociates] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const userType = getUserType()?.toLowerCase();
  const role = user?.role?.toLowerCase();
  const userRoleStr = (user?.role?.roleName || user?.role || "").toLowerCase().replace(/\s/g, '');

  const isSuperAdmin = userType === "superadmin" || userType === "super-admin";
  const isClientAdmin = (userType === "clientadmin" || userType === "companyadmin" || userType === "admin" || userRoleStr === "companyadmin" || userRoleStr === "clientadmin" || userRoleStr.includes("admin")) && userRoleStr !== "telecalleradmin";
  const isTelecaller = userRoleStr === "telecaller";
  const isTelecallerAdmin = userRoleStr === "telecalleradmin";
  const isAssociate = userType === "user" && !isTelecaller && !isTelecallerAdmin && role !== "accounts";

  // CRM State
  const [crmStats, setCrmStats] = useState(null);
  const [crmActivities, setCrmActivities] = useState([]);
  const [loadingCrm, setLoadingCrm] = useState(false);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (isTelecaller || isTelecallerAdmin || isAssociate) {
      fetchCrmData();
      const interval = setInterval(fetchCrmData, 45000); // Poll every 45s
      return () => clearInterval(interval);
    }
  }, [isTelecaller, isTelecallerAdmin, isAssociate]);

  async function fetchCrmData() {
    try {
      setLoadingCrm(true);
      const [statsRes, actsRes, recentLeadsRes] = await Promise.all([
        getStats(),
        getActivities(),
        getRecentLeads()
      ]);
      setCrmStats(statsRes.stats || null);
      setCrmActivities(actsRes.activities || []);
      setLeads(recentLeadsRes.leads || []);
    } catch (error) {
      console.error("Home CRM fetch failed", error);
    } finally {
      setLoadingCrm(false);
    }
  }

  useEffect(() => {
    if (!isSuperAdmin && role !== "accounts" && !isClientAdmin && !isAssociate) {
      fetchHomeData(selectedProjectId);
    }
  }, [isSuperAdmin, role, isClientAdmin, isAssociate, selectedProjectId]);

  const fetchHomeData = async (projectId = "") => {
    try {
      setLoading(true);
      const res = await getHomeStats(projectId);
      if (res.success) {
        setStats(res.data);
        setNews(res.data.news || []);
        setPendingAssociates(res.data.pendingAssociates || []);
        setFollowUps(res.data.followUps || []);
        setProjectList(res.data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };



  // If superadmin, render the SystemDashboard instead of the regular Home view
  if (isSuperAdmin) {
    return (
      <div className="min-h-screen">
        <SystemDashboard />
      </div>
    );
  }

  // If accounts, render the FinanceHome
  if (role === "accounts") {
    return <FinanceHome />;
  }

  // If accounts, render the FinanceHome
  if (role === "accounts") {
    return <FinanceHome />;
  }

  // We no longer redirect associates to a separate dashboard, 
  // we customize the main Home body instead.

  return (
    <div className="space-y-5 min-h-screen pb-10">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[38vh] rounded-xl overflow-hidden shadow-sm">
        {/* Image */}
        <img
          src="/assets/Banner/banner.jpg"
          alt="Grupe Banner"
          className="w-full h-full object-cover object-bottom"
        />

        {/* Very soft overlay */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14">
          <div className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString(`Welcome to grupe, ${user?.firstName || 'Admin'}`).start();
              }}
              options={{
                delay: 70,
                cursor: "",
              }}
            />
          </div>

          <div className="mt-1 text-sm sm:text-base text-slate-800">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1200)
                  .typeString("Created by Brandwar")
                  .start();
              }}
              options={{
                delay: 50,
                cursor: "",
              }}
            />
          </div>
        </div>
      </div>

      {/* ================= PENDING ASSOCIATES MODAL ================= */}
      {openPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenPending(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-base font-semibold text-slate-800">
                Pending Associates
              </h2>
              <button
                onClick={() => setOpenPending(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3 max-h-[60vh] overflow-auto">
              {pendingAssociates?.map((assoc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{assoc.firstName} {assoc.lastName}</p>
                    <p className="text-xs text-slate-500">Awaiting approval</p>
                  </div>

                  <span className="text-xs px-2 py-1 rounded bg-secondary-500/10 text-secondary-500 font-medium">
                    Pending
                  </span>
                </div>
              ))}
              {pendingAssociates?.length === 0 && (
                <div className="py-10 text-center text-slate-500 italic text-sm">
                  No pending associates found.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= QUICK ACCESS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {isTelecaller || isTelecallerAdmin ? (
          <>
            <QuickAccessTile
              title="Leads"
              subtitle={`${crmStats?.total || 0} Total Leads`}
              icon={Users}
              bg="bg-blue-100"
              iconBg="bg-blue-500"
              onClick={() => navigate("/leads")}
            />
            <QuickAccessTile
              title="Pending"
              subtitle={`${crmStats?.pending || 0} Leads`}
              icon={Clock}
              bg="bg-amber-100"
              iconBg="bg-amber-500"
              onClick={() => navigate("/leads/pending")}
            />
            <QuickAccessTile
              title="Follow-ups"
              subtitle={`${crmStats?.followups || 0} Scheduled`}
              icon={Activity}
              bg="bg-purple-100"
              iconBg="bg-purple-500"
              onClick={() => navigate("/leads/followups")}
            />
            <QuickAccessTile
              title="Performance"
              subtitle="View metrics"
              icon={Activity}
              bg="bg-indigo-100"
              iconBg="bg-indigo-500"
              onClick={() => navigate("/performance")}
            />
            <QuickAccessTile
              title="My Team"
              subtitle="Associates"
              icon={UserCheck}
              bg="bg-emerald-100"
              iconBg="bg-emerald-500"
              onClick={() => navigate("/myteam")}
            />
            <QuickAccessTile
              title="Reports"
              subtitle="CRM Analytics"
              icon={Briefcase}
              bg="bg-pink-100"
              iconBg="bg-pink-500"
              onClick={() => navigate("/reports")}
            />
          </>
        ) : (
          <>
            <QuickAccessTile
              title="Projects"
              subtitle="Manage ventures"
              icon={Briefcase}
              bg="bg-blue-100"
              iconBg="bg-blue-500"
              onClick={() => navigate("/projects")}
            />
            <QuickAccessTile
              title="Team"
              subtitle="Your associates"
              icon={Users}
              bg="bg-purple-100"
              iconBg="bg-purple-500"
              onClick={() => navigate("/myteam")}
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
              icon={Users}
              bg="bg-emerald-100"
              iconBg="bg-emerald-500"
              onClick={() => navigate("/news")}
            />
            <QuickAccessTile
              title="Reports"
              subtitle="View analytics"
              icon={Briefcase}
              bg="bg-amber-100"
              iconBg="bg-amber-500"
              onClick={() => navigate("/reports")}
            />
            <QuickAccessTile
              title="Services"
              subtitle="Manage offerings"
              icon={ShieldCheck}
              bg="bg-indigo-100"
              iconBg="bg-indigo-500"
              onClick={() => navigate("/services-home")}
            />
          </>
        )}
      </div>


      {isClientAdmin ? (
        /* ================= CLIENT ADMIN VIEW ================= */
        <div className="pt-2">
          <ClientAdminDashboard />
        </div>
      ) : (
        /* ================= REGULAR ADMIN / ASSOCIATE VIEW ================= */
        <div className="space-y-5">
          {/* ================= KPI STATS (MINIMAL) ================= */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {isTelecaller || isTelecallerAdmin || isAssociate ? (
              <>
                <MinimalKpi
                  title="Total Leads"
                  value={isAssociate ? (stats?.summary?.totalLeads || 0) : (crmStats?.total || '0')}
                  icon={Users}
                  onClick={() => navigate("/leads")}
                />
                <MinimalKpi
                  title="Hot Leads"
                  value={isAssociate ? (leads?.filter(l => l.leadStatus === 'HOT').length || 0) : (crmStats?.hot || '0')}
                  icon={Flame}
                  onClick={() => navigate("/leads?status=HOT")}
                />
                <MinimalKpi
                  title="Warm Leads"
                  value={isAssociate ? (leads?.filter(l => l.leadStatus === 'WARM').length || 0) : (crmStats?.warm || '0')}
                  icon={Activity}
                  onClick={() => navigate("/leads?status=WARM")}
                />
                <MinimalKpi
                  title="Site Visits"
                  value={isAssociate ? (stats?.summary?.sitevisits || 0) : (crmStats?.sitevisits || '0')}
                  icon={Clock}
                  onClick={() => navigate("/leads?status=SITEVISIT")}
                />
              </>
            ) : (
              <>
                <MinimalKpi
                  title="Admins"
                  value={stats?.summary?.totalAdmins || "0"}
                  icon={ShieldCheck}
                  onClick={() => navigate("/admin")}
                />
                <div className="relative">
                  <MinimalKpi
                    title="Associates"
                    value={stats?.summary?.totalUsers || "0"}
                    icon={Users}
                    onClick={() => navigate("/users")}
                  />
                  <button
                    onClick={() => setOpenPending(true)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-sm"
                    title="View pending associates"
                  >
                    <Plus size={12} className="text-slate-600" />
                  </button>
                </div>
                <MinimalKpi
                  title="Projects"
                  value={stats?.summary?.totalProjects || "0"}
                  icon={Briefcase}
                  onClick={() => navigate("/projects")}
                />
                <MinimalKpi
                  title="Leads"
                  value={stats?.summary?.totalLeads || "0"}
                  icon={UserCheck}
                  onClick={() => navigate("/leads")}
                />
              </>
            )}
          </div>

          {/* ================= PLOT BOOKINGS + SALES + STATUS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Plot Bookings / CRM Pipeline */}
            {isTelecaller || isTelecallerAdmin || isAssociate ? (
              <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <ClipboardList size={18} className="text-primary-500" /> Lead Pipeline
                </h2>
                <div className="space-y-4">
                  {['HOT', 'WARM', 'COLD'].map(s => {
                    const count = isAssociate
                      ? leads?.filter(l => l.leadStatus === s).length
                      : (crmStats?.[s.toLowerCase()] || 0);
                    const total = isAssociate ? (leads?.length || 1) : (crmStats?.total || 1);
                    return <StatusRow key={s} label={s} value={count} total={total} color={s === 'HOT' ? 'bg-rose-500' : s === 'WARM' ? 'bg-amber-500' : 'bg-slate-400'} />;
                  })}
                </div>
              </div>
            ) : (
              <CompactCalendar />
            )}

            {/* SALES OVERVIEW / DISTRIBUTION (REPLACED WITH LEAD INSIGHTS FOR ASSOCIATES) */}
            <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-4">
                {isAssociate ? "Lead Insights" : (isTelecaller || isTelecallerAdmin ? "Lead Distribution" : "Sales Overview")}
              </h2>

              <div className="h-56 min-w-0" style={{ minHeight: '224px' }}>
                <ResponsiveContainer width="99%" height="100%">
                  <PieChart>
                    <Pie
                      data={isAssociate ? [
                        { name: 'Hot', value: leads?.filter(l => l.leadStatus === 'HOT').length || 0 },
                        { name: 'Warm', value: leads?.filter(l => l.leadStatus === 'WARM').length || 0 },
                        { name: 'Cold', value: leads?.filter(l => l.leadStatus === 'COLD').length || 0 },
                      ].filter(d => d.value > 0) : (isTelecaller || isTelecallerAdmin ? [
                        { name: 'Hot', value: crmStats?.hot || 0 },
                        { name: 'Warm', value: crmStats?.warm || 0 },
                        { name: 'Cold', value: crmStats?.cold || 0 },
                        { name: 'New', value: crmStats?.new || 0 },
                      ].filter(d => d.value > 0) : [
                        { name: "Registered", value: stats?.summary?.plots?.registered || 0 },
                        { name: "Booked", value: stats?.summary?.plots?.booked || 0 },
                        { name: "Available", value: stats?.summary?.plots?.available || 0 },
                        { name: "Hold", value: stats?.summary?.plots?.hold || 0 },
                      ].filter(d => d.value > 0))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {(isAssociate || isTelecaller || isTelecallerAdmin ? ['#f43f5e', '#f59e0b', '#94a3b8', '#10b981'] : COLORS).map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PROJECT STATUS */}
            <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-800">
                  {isTelecaller || isTelecallerAdmin ? "Call Status" : "Project Status"}
                </h2>
                {!(isTelecaller || isTelecallerAdmin) && (
                  <select
                    className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-600 outline-none"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <option value="">All Projects</option>
                    {projectList.map(p => (
                      <option key={p.id} value={p.id}>{p.projectName}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-4 pt-2">
                {isTelecaller || isTelecallerAdmin ? (
                  <>
                    <StatusRow label="Pending Calls" value={crmStats?.pending || 0} total={crmStats?.total || 1} color="bg-amber-500" />
                    <StatusRow label="Follow-ups" value={crmStats?.followups || 0} total={crmStats?.total || 1} color="bg-purple-500" />
                    <StatusRow label="Site Visits" value={crmStats?.sitevisits || 0} total={crmStats?.total || 1} color="bg-emerald-500" />
                    <StatusRow label="Closed/Lost" value={crmStats?.closed || 0} total={crmStats?.total || 1} color="bg-slate-400" />
                  </>
                ) : (
                  <>
                    <StatusRow label="Available" value={stats?.summary?.plots?.available || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#228b22]" />
                    <StatusRow label="Sold / Registered" value={stats?.summary?.plots?.registered || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#ff0000]" />
                    <StatusRow label="Booked" value={stats?.summary?.plots?.booked || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#ffa500]" />
                    <StatusRow label="Hold" value={stats?.summary?.plots?.hold || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#808080]" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= LOWER SECTION ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-10">
            {/* LATEST NEWS / CRM ACTIVITIES */}
            <div className={`${isAssociate ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm`}>
              <h2 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                {isTelecaller || isTelecallerAdmin ? <><MessageSquare size={18} className="text-primary-500" /> Recent CRM Activities</> : "Latest News"}
              </h2>

              <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {isTelecaller || isTelecallerAdmin ? (
                  crmActivities.length > 0 ? crmActivities.map((a) => (
                    <div key={a.id} className="border-b border-slate-100 last:border-0 pb-3">
                      <p className="text-sm font-medium text-slate-800" dangerouslySetInnerHTML={{ __html: a.text }} />
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Clock size={10} /> {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  )) : (
                    <div className="py-10 text-center opacity-30">
                      <MessageSquare className="mx-auto mb-2 text-slate-300" size={24} />
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quiet for now</div>
                    </div>
                  )
                ) : (
                  <>
                    {news?.slice(0, 5).map((item, i) => (
                      <div key={i} className="border-b border-slate-100 last:border-0 pb-3">
                        <p className="text-sm font-medium text-slate-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {news?.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No news updates yet.</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (HIDDEN FOR ASSOCIATES) */}
            {!isAssociate && (
              <div className="space-y-4">
                {/* CRM QUEUE STATUS / PENDING */}
                <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h2 className="text-base font-semibold text-slate-800 mb-3">
                    {isTelecaller || isTelecallerAdmin ? "Lead Queue" : "Pending Associates"}
                  </h2>

                  <div className="space-y-3 pt-1">
                    {isTelecaller || isTelecallerAdmin ? (
                      <>
                        <div className="flex justify-between items-center bg-rose-50 p-2 rounded-lg border border-rose-100">
                          <div>
                            <p className="text-[13px] font-bold text-rose-700">Hot Leads</p>
                            <p className="text-[10px] text-rose-500 uppercase tracking-widest mt-0.5">Urgent attention</p>
                          </div>
                          <span className="text-sm font-black text-rose-600 font-mono">{crmStats?.hot || 0}</span>
                        </div>
                        <div className="flex justify-between items-center bg-amber-50 p-2 rounded-lg border border-amber-100">
                          <div>
                            <p className="text-[13px] font-bold text-amber-700">Pending</p>
                            <p className="text-[10px] text-amber-500 uppercase tracking-widest mt-0.5">Daily queue</p>
                          </div>
                          <span className="text-sm font-black text-amber-600 font-mono">{crmStats?.pending || 0}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {pendingAssociates?.slice(0, 3).map((assoc, i) => (
                          <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                            <div>
                              <p className="text-[13px] font-bold text-slate-800">
                                {assoc.firstName} {assoc.lastName}
                              </p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Awaiting approval</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-bold bg-secondary-500/10 text-secondary-500 px-2 py-1 rounded">
                              Pending
                            </span>
                          </div>
                        ))}
                        {pendingAssociates?.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic">No pending associates.</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* FOLLOW UPS */}
                <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h2 className="text-base font-semibold text-slate-800 mb-3">
                    {isTelecaller || isTelecallerAdmin ? "Daily Tasks" : "Follow Ups"}
                  </h2>

                  <div className="space-y-3 pt-1">
                    {isTelecaller || isTelecallerAdmin ? (
                      <>
                        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                          <p className="text-[13px] font-bold text-slate-800">Scheduled Follow-ups</p>
                          <p className="text-[11px] text-indigo-500 font-medium mt-1">{crmStats?.followups || 0} Task(s) remaining</p>
                        </div>
                        <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50">
                          <p className="text-[13px] font-bold text-slate-800">Site Visits Planned</p>
                          <p className="text-[11px] text-emerald-500 font-medium mt-1">{crmStats?.sitevisits || 0} Scheduled</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {followUps?.slice(0, 2).map((follow, i) => (
                          <div key={i} className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                            <p className="text-[13px] font-bold text-slate-800">
                              {follow.leadName}
                            </p>
                            <p className="text-[11px] text-indigo-500 font-medium mt-1">
                              {follow.callbackAt ? new Date(follow.callbackAt).toLocaleString() : "TBD"}
                            </p>
                          </div>
                        ))}
                        {followUps?.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic">No scheduled follow-ups.</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MinimalKpi({ title, value, icon: Icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/80
        border border-slate-200
        rounded-xl
        px-4 py-3
        flex items-center gap-3
        ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      `}
    >

      {/* Icon */}
      <div className="h-9 w-9 rounded-lg bg-secondary-500/10 flex items-center justify-center">
        <Icon size={18} className="text-secondary-500" />
      </div>

      {/* Text */}
      <div>
        <div className="text-xs text-slate-500">{title}</div>
        <div className="text-xl font-semibold text-slate-900">{value}</div>
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
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <div
          className={`h-9 w-9 rounded-full ${iconBg} flex items-center justify-center text-white`}
        >
          <Icon size={16} />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
}

function StatusRow({ label, value, total = 1, color = "bg-primary-500" }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(((value || 0) / (total || 1)) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

