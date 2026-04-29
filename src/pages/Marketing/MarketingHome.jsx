import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Briefcase, Map, Image as ImageIcon, 
  BarChart3, FileText, Plus, Landmark
} from "lucide-react";
import Typewriter from "typewriter-effect";
import { getHomeStats } from "@/services/common.service";
import { getUser } from "@/services/auth.service";

export default function MarketingHome() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await getHomeStats();
      if (res.success) setStats(res.data);
    } catch (error) {
      console.error("Marketing Home fetch failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 min-h-screen pb-10">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[35vh] rounded-xl overflow-hidden shadow-sm">
        <img src="/assets/Banner/banner.jpg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/10" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString(`Marketing Central - ${user?.firstName || 'Admin'}`).start();
              }}
              options={{ delay: 70, cursor: "" }}
            />
          </div>
          <div className="mt-1 text-slate-800 font-medium">
            Inventory: {stats?.summary?.plots?.available || 0} Plots Available across {stats?.summary?.totalProjects || 0} Projects.
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={stats?.summary?.totalProjects || 0} icon={Briefcase} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Available Plots" value={stats?.summary?.plots?.available || 0} icon={Map} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Booked Today" value={stats?.summary?.plots?.booked || 0} icon={Landmark} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Total Leads" value={stats?.summary?.totalLeads || 0} icon={Users} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <ActionTile title="Projects" icon={Briefcase} path="/projects" />
        <ActionTile title="Inventory" icon={Map} path="/plots" />
        <ActionTile title="Creative/Designs" icon={ImageIcon} path="/greetings" />
        <ActionTile title="News Feed" icon={FileText} path="/news" />
        <ActionTile title="Leads" icon={Users} path="/leads" />
        <ActionTile title="Reports" icon={BarChart3} path="/reports" />
      </div>

      {/* ================= INVENTORY STATUS ================= */}
      <div className="bg-white/80 rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 size={18} className="text-primary-500" /> Inventory Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <InventoryProgress label="Available" value={stats?.summary?.plots?.available || 0} total={stats?.summary?.plots?.total || 1} color="bg-emerald-500" />
          <InventoryProgress label="Booked" value={stats?.summary?.plots?.booked || 0} total={stats?.summary?.plots?.total || 1} color="bg-amber-500" />
          <InventoryProgress label="Registered" value={stats?.summary?.plots?.registered || 0} total={stats?.summary?.plots?.total || 1} color="bg-rose-500" />
          <InventoryProgress label="On Hold" value={stats?.summary?.plots?.hold || 0} total={stats?.summary?.plots?.total || 1} color="bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className={`p-4 rounded-xl border border-slate-100 shadow-sm bg-white flex items-center gap-4`}>
      <div className={`h-12 w-12 rounded-lg ${bg} flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ActionTile({ title, icon: Icon, path }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-500 hover:text-primary-500 transition-all group"
    >
      <Icon size={20} className="text-slate-400 group-hover:text-primary-500" />
      <span className="text-xs font-semibold">{title}</span>
    </div>
  );
}

function InventoryProgress({ label, value, total, color }) {
  const percent = Math.min((value / total) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <span className="text-lg font-black text-slate-800">{value}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
