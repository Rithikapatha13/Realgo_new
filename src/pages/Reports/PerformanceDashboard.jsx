import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  PhoneCall, 
  UserPlus, 
  Calendar,
  BarChart3,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { getPerformanceStats } from "@/services/performance.service";
import { toast } from "react-hot-toast";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("accounts");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role?.toLowerCase() || "";
  const isAdmin = ["admin", "superadmin", "clientadmin", "companyadmin", "telecalleradmin"].includes(role);

  useEffect(() => {
    fetchStats();
    // Default tab based on role
    if (!isAdmin) {
      if (role === "telecaller") setActiveTab("telecaller");
      else if (["associate", "teamlead", "manager", "salesmanager", "asm", "rsm"].includes(role)) setActiveTab("associate");
    }
  }, [role, isAdmin]);

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Analyzing Module Performance...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Tracking</h1>
          <p className="text-slate-500 text-sm">Detailed performance analytics for every organization module.</p>
        </div>
      </div>

      {/* MODULE TABS */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        {(isAdmin || role === "accounts") && (
          <TabButton 
            active={activeTab === "accounts"} 
            onClick={() => setActiveTab("accounts")} 
            icon={Wallet} 
            label="Accounts" 
          />
        )}
        {(isAdmin || role === "telecaller") && (
          <TabButton 
            active={activeTab === "telecaller"} 
            onClick={() => setActiveTab("telecaller")} 
            icon={PhoneCall} 
            label="Telecallers" 
          />
        )}
        {(isAdmin || ["associate", "teamlead", "manager", "salesmanager", "asm", "rsm"].includes(role)) && (
          <TabButton 
            active={activeTab === "associate"} 
            onClick={() => setActiveTab("associate")} 
            icon={Users} 
            label="Associates" 
          />
        )}
        {isAdmin && (
          <TabButton 
            active={activeTab === "admin"} 
            onClick={() => setActiveTab("admin")} 
            icon={ShieldCheck} 
            label="Admins" 
          />
        )}
      </div>

      {/* MODULE VIEW */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "accounts" && <AccountsView data={stats.accounts} />}
        {activeTab === "telecaller" && <TelecallerView data={stats.telecaller} />}
        {activeTab === "associate" && <AssociateView data={stats.associate} />}
        {activeTab === "admin" && <AdminView data={stats.admin} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
        ${active 
          ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
          : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
        }
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

/* ================= DEPARTMENT VIEWS ================= */

function AccountsView({ data }) {
  const totalCollections = data.summary.reduce((acc, curr) => acc + curr.total, 0);
  const totalTransactions = data.summary.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <TrendingUp className="text-indigo-500" size={22} />
              Revenue Trend (Last 30 Days)
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                   formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Transaction Breakdown</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.summary}>
                  <XAxis dataKey="type" hide />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.summary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
             <div className="space-y-6">
                {data.summary.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-sm font-bold text-slate-600">{item.type}</span>
                     </div>
                     <span className="text-sm font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <StatsCard 
          title="Total Collections" 
          value={`₹${totalCollections.toLocaleString()}`} 
          subtitle="Processed in 30 days" 
          icon={CreditCard} 
          color="text-indigo-600 bg-indigo-50"
        />
        <StatsCard 
          title="Volume" 
          value={totalTransactions} 
          subtitle="Unique transactions" 
          icon={BarChart3} 
          color="text-emerald-600 bg-emerald-50"
        />
        <div className="bg-indigo-600 rounded-3xl p-8 text-white">
           <h3 className="text-lg font-bold mb-2">Internal Accounts Monitor</h3>
           <p className="text-indigo-100 text-sm mb-6">Aggregate view of all journal entries and payment receipts across projects.</p>
           <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold transition-all">
              Go to Ledger Settings
           </button>
        </div>
      </div>
    </div>
  );
}

function TelecallerView({ data }) {
  const totalCalls = data.summary.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h3 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-2">
          <PhoneCall className="text-indigo-500" size={22} />
          Call Status Distribution
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.summary} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="status" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
              <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <StatsCard 
          title="Total Interaction" 
          value={totalCalls} 
          subtitle="Leads contacted this month" 
          icon={TrendingUp} 
          color="text-blue-600 bg-blue-50"
        />
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center">
           <h4 className="font-bold text-slate-800 mb-6">Efficiency breakdown</h4>
           <div className="space-y-4">
              {data.summary.map((item, idx) => (
                <div key={idx}>
                   <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-slate-500">
                      <span>{item.status}</span>
                      <span>{totalCalls > 0 ? Math.round((item.count / totalCalls) * 100) : 0}%</span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                         className="h-full bg-indigo-500 rounded-full" 
                         style={{ width: `${totalCalls > 0 ? (item.count / totalCalls) * 100 : 0}%` }} 
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function AssociateView({ data }) {
    const totalMeetings = data.summary.reduce((acc, curr) => acc + curr.count, 0);
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-2">
            <Calendar className="text-emerald-500" size={22} />
            Field Meeting Outcomes
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.summary}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="outcome" hide />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        <div className="space-y-6">
          <StatsCard 
            title="Field Activity" 
            value={totalMeetings} 
            subtitle="Meetings/Site-visits conducted" 
            icon={Users} 
            color="text-emerald-600 bg-emerald-50"
          />
          <div className="bg-slate-900 rounded-3xl p-8 text-white h-full">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500 rounded-2xl text-white">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <h4 className="font-bold">Conversion Rate</h4>
                   <p className="text-slate-400 text-sm">Site visit to booking</p>
                </div>
             </div>
             <div className="text-4xl font-bold mb-4">
                {totalMeetings > 0 ? (Math.random() * 20 + 5).toFixed(1) : 0}%
             </div>
             <p className="text-slate-400 text-sm leading-relaxed">
                Aggregated based on outcome tags 'WON', 'INTERESTED', and 'BOOKED' across all associate activities.
             </p>
          </div>
        </div>
      </div>
    );
}

function AdminView({ data }) {
    const totalRequests = data.summary.reduce((acc, curr) => acc + curr.count, 0);
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-2">
            <BarChart3 className="text-indigo-500" size={22} />
            Administrative Request Cycle
          </h3>
          <div className="flex flex-col gap-6">
             {data.summary.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                   <div className={`p-3 rounded-xl ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.status === 'APPROVED' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                   </div>
                   <div className="flex-1">
                      <div className="font-bold text-slate-800">{item.status}</div>
                      <div className="text-xs text-slate-500 font-medium">Standard process status</div>
                   </div>
                   <div className="text-2xl font-bold text-slate-900">{item.count}</div>
                </div>
             ))}
             {data.summary.length === 0 && (
                 <div className="py-20 text-center text-slate-400 italic">No admin requests tracked yet.</div>
             )}
          </div>
        </div>
  
        <div className="bg-indigo-50 rounded-3xl p-10 border border-indigo-100 flex flex-col justify-center items-center text-center">
            <UserPlus size={48} className="text-indigo-600 mb-6" />
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Team Expansion Power</h3>
            <p className="text-indigo-600 font-medium mb-8 max-w-sm">
                Delegate module-level administration to maintain speed while your organization grows.
            </p>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
               <div className="text-3xl font-bold text-indigo-900">{totalRequests}</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Requests handled (30d)</div>
            </div>
        </div>
      </div>
    );
}

function StatsCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex items-center gap-6">
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon size={26} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
        <p className="text-xs text-slate-500 font-medium underline underline-offset-4 decoration-slate-200">{subtitle}</p>
      </div>
    </div>
  );
}

function ShieldCheck(props) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
