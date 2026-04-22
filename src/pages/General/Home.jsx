import { useNavigate } from "react-router-dom";
import { Users, Briefcase, UserCheck, ShieldCheck } from "lucide-react";
import CompactCalendar from "../../components/Calendar/CompactCalendar";
import Typewriter from "typewriter-effect";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import SystemDashboard from "../SuperAdmin/SystemDashboard";
import FinanceHome from "../Finance/FinanceHome";
import ClientAdminDashboard from "../administration/ClientAdminDashboard";
import { getUser, getUserType } from "@/services/auth.service";
import { getHomeStats } from "@/services/common.service";
import { useEffect } from "react";



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
  const userType = getUserType()?.toLowerCase();
  const role = user?.role?.toLowerCase();
  
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [pendingAssociates, setPendingAssociates] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);


  const isSuperAdmin = userType === "superadmin" || userType === "super-admin";
  const userRoleStr = role || "";
  const isClientAdmin = userType === "clientadmin" || userType === "companyadmin" || userRoleStr === "companyadmin" || userRoleStr === "clientadmin";

  useEffect(() => {
    if (!isSuperAdmin && role !== "accounts" && !isClientAdmin) {
      fetchHomeData(selectedProjectId);
    }
  }, [isSuperAdmin, role, isClientAdmin, selectedProjectId]);

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

  return (
    <div className="space-y-5 min-h-screen pb-10">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[38vh] rounded-xl overflow-hidden shadow-sm">
        {/* Image */}
        <img
          src=" /assets/Banner/banner.jpg"
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

           </div>


           {/* ================= PLOT BOOKINGS + SALES + STATUS ================= */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             {/* Plot Bookings */}
             <CompactCalendar />

             {/* SALES OVERVIEW */}
             <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
               <h2 className="text-base font-semibold text-slate-800 mb-4">
                 Sales Overview
               </h2>

               <div className="h-56 min-w-0" style={{ minHeight: '224px' }}>
                 <ResponsiveContainer width="99%" height="100%">
                   <PieChart>
                     <Pie
                       data={[
                         { name: "Registered", value: stats?.summary?.plots?.registered || 0 },
                         { name: "Booked", value: stats?.summary?.plots?.booked || 0 },
                         { name: "Available", value: stats?.summary?.plots?.available || 0 },
                         { name: "Hold", value: stats?.summary?.plots?.hold || 0 },
                       ].filter(d => d.value > 0)}
                       dataKey="value"
                       nameKey="name"
                       cx="50%"
                       cy="50%"
                       outerRadius={80}
                       innerRadius={45}
                       paddingAngle={3}
                     >
                       {[
                         { name: "Registered", value: stats?.summary?.plots?.registered || 0 },
                         { name: "Booked", value: stats?.summary?.plots?.booked || 0 },
                         { name: "Available", value: stats?.summary?.plots?.available || 0 },
                         { name: "Hold", value: stats?.summary?.plots?.hold || 0 },
                       ].filter(d => d.value > 0).map((_, index) => (
                         <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
                    Project Status
                  </h2>
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
                </div>

                 <div className="space-y-4 pt-2">
                   <StatusRow label="Available" value={stats?.summary?.plots?.available || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#228b22]" />
                   <StatusRow label="Sold / Registered" value={stats?.summary?.plots?.registered || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#ff0000]" />
                   <StatusRow label="Booked" value={stats?.summary?.plots?.booked || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#ffa500]" />
                   <StatusRow label="Hold" value={stats?.summary?.plots?.hold || 0} total={stats?.summary?.plots?.total || 1} color="bg-[#808080]" />
                 </div>

             </div>
           </div>

           {/* ================= LOWER SECTION ================= */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-10">
             {/* LATEST NEWS */}
             <div className="lg:col-span-2 bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
               <h2 className="text-base font-semibold text-slate-800 mb-3">
                 Latest News
               </h2>

                <div className="space-y-3 pt-2">
                  {news?.slice(0, 3).map((item, i) => (
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
                </div>

             </div>

             {/* RIGHT COLUMN */}
             <div className="space-y-4">
               {/* PENDING ASSOCIATES */}
               <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
                 <h2 className="text-base font-semibold text-slate-800 mb-3">
                   Pending Associates
                 </h2>

                  <div className="space-y-3 pt-1">
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
                  </div>

               </div>

               {/* FOLLOW UPS */}
               <div className="bg-white/80 rounded-xl border border-slate-200 p-4 shadow-sm">
                 <h2 className="text-base font-semibold text-slate-800 mb-3">
                   Follow Ups
                 </h2>

                  <div className="space-y-3 pt-1">
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
                  </div>

               </div>
             </div>
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
          className={`h-full ${color} rounded-full`} 
          style={{ width: `${Math.min(((value || 0) / (total || 1)) * 100, 100)}%` }} 
        />
      </div>
    </div>
  );
}
