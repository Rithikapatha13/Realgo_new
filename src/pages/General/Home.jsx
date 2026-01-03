import { useNavigate } from "react-router-dom";
import { Users, Briefcase, UserCheck, ShieldCheck } from "lucide-react";
import CompactCalendar from "../../components/Calendar/CompactCalendar";
import Typewriter from "typewriter-effect";
import ExampleModalUsage from "../ExampleModalUsage";
import { useState } from "react";
import { Plus } from "lucide-react";


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



export default function Home() {
  const navigate = useNavigate();
const [openPending, setOpenPending] = useState(false);
  return (
    <div className="p-4 sm:p-5 space-y-5 bg-slate-100/70 min-h-screen">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[38vh] rounded-xl overflow-hidden">
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
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString("Welcome to Grupe").start();
              }}
              options={{
                delay: 70,
                cursor: "",
              }}
            />
          </h1>

          <p className="mt-1 text-sm sm:text-base text-slate-800">
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
          </p>
        </div>
      </div>

{/* ================= PENDING ASSOCIATES MODAL ================= */}
{openPending && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setOpenPending(false)}
    />

    {/* Modal */}
    <div className="relative bg-white rounded-xl w-full max-w-md shadow-lg">
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
        {[
          "Ravi Kumar",
          "Anjali Sharma",
          "Suresh Reddy",
          "Meena Patel",
        ].map((name, i) => (
          <div
            key={i}
            className="flex items-center justify-between border rounded-lg px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">
                {name}
              </p>
              <p className="text-xs text-slate-500">
                Awaiting approval
              </p>
            </div>

            <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
              Pending
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      {/* ================= KPI STATS ================= */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Total Admins" value="8" icon={ShieldCheck} />
        <StatCard title="Total Associates" value="424" icon={Users} />
        <StatCard title="Total Projects" value="324" icon={Briefcase} />
        <StatCard title="Team Leads" value="56" icon={UserCheck} />
      </div> */}
      {/* ================= KPI STATS (NEW DESIGN) ================= */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          title="Total Admins"
          value="8"
          subtitle="Active admins"
          change="+2.1%"
          icon={ShieldCheck}
          gradient="from-purple-400 to-indigo-400"
        />
        <KpiCard
          title="Total Associates"
          value="424"
          subtitle="Last 7 days"
          change="+3.2%"
          icon={Users}
          gradient="from-blue-300 to-cyan-400"
        />
        <KpiCard
          title="Total Projects"
          value="324"
          subtitle="Ongoing"
          change="+1.4%"
          icon={Briefcase}
          gradient="from-orange-300 to-amber-400"
        />
        <KpiCard
          title="Team Leads"
          value="56"
          subtitle="Active"
          change="+0.9%"
          icon={UserCheck}
          gradient="from-emerald-300 to-teal-300"
        />
      </div> */}
      {/* ================= KPI STATS (MINIMAL) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MinimalKpi title="Total Admins" value="8" icon={ShieldCheck} />
        {/* <MinimalKpi title="Total Associates" value="424" icon={Users} /> */}
        <div className="relative">
          <MinimalKpi title="Total Associates" value="424" icon={Users} />

          {/* SMALL BUTTON */}
          <button
            onClick={() => setOpenPending(true)}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
            title="View pending associates"
          >
            <Plus size={12} className="text-slate-600" />
          </button>
        </div>

        <MinimalKpi title="Total Projects" value="324" icon={Briefcase} />
        <MinimalKpi title="Team Leads" value="56" icon={UserCheck} />
      </div>

      {/* ================= QUICK ACCESS ================= */}
      {/* <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="min-w-[200px] bg-slate-200/70 hover:bg-slate-300/70 transition rounded-lg p-3 cursor-pointer flex flex-col justify-between"
          >
            <h3 className="text-sm font-semibold text-blue-700">
              {card.title}
            </h3>

            <div className="flex justify-between items-end mt-4">
              <img src={card.image} alt={card.title} className="h-14" />
              <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">
                →
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* ================= QUICK ACCESS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <QuickAccessTile
          title="Projects"
          subtitle="Manage ventures"
          icon={Briefcase}
          bg="bg-blue-100"
          iconBg="bg-blue-500"
          onClick={() => navigate("/projects-home")}
        />
        <QuickAccessTile
          title="Team"
          subtitle="Your associates"
          icon={Users}
          bg="bg-purple-100"
          iconBg="bg-purple-500"
          onClick={() => navigate("/team-home")}
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
          iconBg="bg-amtuber-500"
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

      {/* ================= PLOT BOOKINGS + SALES + STATUS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <CompactCalendar />

        {/* SALES OVERVIEW */}
        <div className="bg-white/80 rounded-lg border border-slate-200 p-3">
          <h2 className="text-base font-semibold text-slate-800">
            Sales Overview
          </h2>

          <div className="flex items-center gap-4 mt-3">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
              72%
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2" />
                Sold
              </p>
              <p>
                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2" />
                Ongoing
              </p>
              <p>
                <span className="inline-block w-2 h-2 bg-slate-300 rounded-full mr-2" />
                Available
              </p>
            </div>
          </div>
        </div>

        {/* PROJECT STATUS */}
        <div className="bg-white/80 rounded-lg border border-slate-200 p-3">
          <h2 className="text-base font-semibold text-slate-800 mb-3">
            Project Status
          </h2>

          <div className="space-y-2">
            <StatusRow label="Available" value={258} />
            <StatusRow label="Sold" value={89} />
            <StatusRow label="Ongoing" value={42} />
            <StatusRow label="Closed" value={34} />
          </div>
        </div>
      </div>

      {/* ================= LOWER SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LATEST NEWS */}
        <div className="lg:col-span-2 bg-white/80 rounded-lg border border-slate-200 p-3">
          <h2 className="text-base font-semibold text-slate-800 mb-3">
            Latest News
          </h2>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b last:border-0 pb-2">
                <p className="text-sm font-medium text-slate-800">
                  New project launch announced
                </p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* PENDING ASSOCIATES */}
          <div className="bg-white/80 rounded-lg border border-slate-200 p-3">
            <h2 className="text-base font-semibold text-slate-800 mb-3">
              Pending Associates
            </h2>

            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Associate Name
                    </p>
                    <p className="text-xs text-slate-500">Awaiting approval</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 rounded">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FOLLOW UPS */}
          <div className="bg-white/80 rounded-lg border border-slate-200 p-3">
            <h2 className="text-base font-semibold text-slate-800 mb-3">
              Follow Ups
            </h2>

            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-slate-800">
                    Client follow-up call
                  </p>
                  <p className="text-xs text-slate-500">Today at 4:00 PM</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MinimalKpi({ title, value, icon: Icon }) {
  return (
    <div
      className="
      bg-white/80
      border border-slate-200
      rounded-xl
      px-4 py-3
      flex items-center gap-3
    "
    >
      <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
        <Icon size={18} className="text-slate-600" />
      </div>

      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white/90 border border-slate-200 rounded-lg px-4 py-3 flex items-center gap-4">
      <div className="p-2.5 rounded-md bg-purple-100 text-purple-600">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
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

function StatusRow({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded">
        <div className="h-2 bg-purple-500 rounded w-2/3" />
      </div>
    </div>
  );
}
