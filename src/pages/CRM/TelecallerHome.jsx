import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Briefcase, UserCheck, ShieldCheck, Activity, 
  Clock, Flame, ClipboardList, MessageSquare, Calendar 
} from "lucide-react";
import Typewriter from "typewriter-effect";
import { getStats, getActivities } from "@/services/crm.service";
import { formatDistanceToNow } from 'date-fns';
import { getUser } from "@/services/auth.service";

export default function TelecallerHome() {
  const navigate = useNavigate();
  const user = getUser();
  const [crmStats, setCrmStats] = useState(null);
  const [crmActivities, setCrmActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrmData();
    const interval = setInterval(fetchCrmData, 45000);
    return () => clearInterval(interval);
  }, []);

  async function fetchCrmData() {
    try {
      const [statsRes, actsRes] = await Promise.all([
        getStats(),
        getActivities()
      ]);
      setCrmStats(statsRes.stats || null);
      setCrmActivities(actsRes.activities || []);
    } catch (error) {
      console.error("Telecaller Home fetch failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 min-h-screen pb-10">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[30vh] rounded-xl overflow-hidden shadow-sm bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 text-white">
          <div className="text-2xl sm:text-3xl font-semibold">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString(`Hello, ${user?.firstName || 'Telecaller'}`).start();
              }}
              options={{ delay: 70, cursor: "" }}
            />
          </div>
          <div className="mt-1 text-sm opacity-90">
            You have {crmStats?.pending || 0} calls pending in your queue today.
          </div>
        </div>
      </div>

      {/* ================= QUICK ACCESS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <QuickAccessTile
          title="Daily Queue"
          subtitle={`${crmStats?.pending || 0} Pending`}
          icon={Clock}
          bg="bg-amber-100"
          iconBg="bg-amber-500"
          onClick={() => navigate("/leads")}
        />
        <QuickAccessTile
          title="Hot Leads"
          subtitle={`${crmStats?.hot || 0} High Priority`}
          icon={Flame}
          bg="bg-rose-100"
          iconBg="bg-rose-500"
          onClick={() => navigate("/leads")}
        />
        <QuickAccessTile
          title="Follow-ups"
          subtitle={`${crmStats?.followups || 0} Scheduled`}
          icon={Calendar}
          bg="bg-indigo-100"
          iconBg="bg-indigo-500"
          onClick={() => navigate("/leads/followups")}
        />
        <QuickAccessTile
          title="Performance"
          subtitle="View Metrics"
          icon={Activity}
          bg="bg-emerald-100"
          iconBg="bg-emerald-500"
          onClick={() => navigate("/performance")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PIPELINE */}
        <div className="bg-white/80 rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-primary-500" /> Lead Pipeline
          </h2>
          <div className="space-y-5">
            <StatusRow label="NEW" value={crmStats?.new || 0} total={crmStats?.total || 1} color="bg-emerald-500" />
            <StatusRow label="HOT" value={crmStats?.hot || 0} total={crmStats?.total || 1} color="bg-rose-500" />
            <StatusRow label="WARM" value={crmStats?.warm || 0} total={crmStats?.total || 1} color="bg-amber-500" />
            <StatusRow label="COLD" value={crmStats?.cold || 0} total={crmStats?.total || 1} color="bg-slate-400" />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white/80 rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary-500" /> Recent Activities
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {crmActivities.length > 0 ? crmActivities.slice(0, 8).map((a) => (
              <div key={a.id} className="border-b border-slate-100 last:border-0 pb-3 flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: a.text }} />
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-bold uppercase">
                    <Clock size={10} /> {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center text-slate-400 italic text-sm">
                No recent lead activity.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAccessTile({ title, subtitle, icon: Icon, bg, iconBg, onClick }) {
  return (
    <div onClick={onClick} className={`rounded-xl p-5 cursor-pointer transition hover:shadow-md ${bg}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <div className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center text-white shadow-sm`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-2 font-medium">{subtitle}</p>
    </div>
  );
}

function StatusRow({ label, value, total = 1, color = "bg-primary-500" }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600 font-semibold">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-700`} 
          style={{ width: `${Math.min(((value || 0) / (total || 1)) * 100, 100)}%` }} 
        />
      </div>
    </div>
  );
}
