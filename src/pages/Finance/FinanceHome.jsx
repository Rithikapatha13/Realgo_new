import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Landmark,
  Receipt,
  Repeat,
  TrendingUp,
  BarChart3,
  FileText,
  CreditCard,
  Users
} from "lucide-react";
import Typewriter from "typewriter-effect";
import { getAccounts, getLedgers, getTransactions } from "@/services/finance.service";
import { getUser } from "@/services/auth.service";

/* ================= QUICK ACCESS TILES ================= */
const quickAccess = [
  {
    title: "Transactions",
    subtitle: "View all history",
    icon: Repeat,
    path: "/finance/transactions",
    bg: "bg-blue-100",
    iconBg: "bg-blue-500"
  },
  {
    title: "General Receipt",
    subtitle: "Record income",
    icon: Receipt,
    path: "/finance/general-receipt",
    bg: "bg-emerald-100",
    iconBg: "bg-emerald-500"
  },
  {
    title: "Payment Voucher",
    subtitle: "Record expenses",
    icon: CreditCard,
    path: "/finance/payment-voucher",
    bg: "bg-rose-100",
    iconBg: "bg-rose-500"
  },
  {
    title: "Journal Voucher",
    subtitle: "Internal transfers",
    icon: FileText,
    path: "/finance/journal-voucher",
    bg: "bg-purple-100",
    iconBg: "bg-purple-500"
  },
  {
    title: "Ledgers",
    subtitle: "Account details",
    icon: BarChart3,
    path: "/finance/ledgers",
    bg: "bg-amber-100",
    iconBg: "bg-amber-500"
  },
  {
    title: "Parties",
    subtitle: "Vendors & Clients",
    icon: Users,
    path: "/finance/parties",
    bg: "bg-indigo-100",
    iconBg: "bg-indigo-500"
  }
];

export default function FinanceHome() {
  const navigate = useNavigate();
  const loggedUser = getUser() || {};
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalLedgers: 0,
    recentTransactions: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [accountsRes, ledgersRes, transactionsRes] = await Promise.all([
        getAccounts(),
        getLedgers(),
        getTransactions({ limit: 5 })
      ]);

      setStats({
        totalAccounts: accountsRes.data?.length || 0,
        totalLedgers: ledgersRes.data?.length || 0,
        recentTransactions: transactionsRes.data || [],
        loading: false
      });
    } catch (error) {
      console.error("Failed to fetch finance dashboard data:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-5 min-h-screen">
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[38vh] rounded-xl overflow-hidden">
        {/* Image */}
        <img
          src="/assets/Banner/banner.jpg"
          alt="Finance Banner"
          className="w-full h-full object-cover object-bottom"
        />

        {/* Very soft overlay */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14">
          <h1 className="text-xl sm:text-xl font-semibold text-slate-900">
            <Typewriter
              onInit={(typewriter) => {
                const cName = loggedUser?.companyName ? ` - ${loggedUser.companyName}` : '';
                typewriter.typeString(`Welcome to Finance${cName}`).start();
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
                  .typeString("Managing wealth with precision")
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

      {/* ================= KPI STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MinimalKpi
          title="Total Accounts"
          value={stats.totalAccounts}
          icon={Landmark}
        />
        <MinimalKpi
          title="Total Ledgers"
          value={stats.totalLedgers}
          icon={BarChart3}
        />
        <MinimalKpi
          title="Active Parties"
          value="124"
          icon={Users}
        />
        <MinimalKpi
          title="Monthly Volume"
          value="₹ 4.2M"
          icon={TrendingUp}
        />
      </div>

      {/* ================= QUICK ACCESS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickAccess.map((item, idx) => (
          <QuickAccessTile
            key={idx}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            bg={item.bg}
            iconBg={item.iconBg}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RECENT TRANSACTIONS */}
        <div className="lg:col-span-2 bg-white/80 rounded-lg border border-slate-200 p-3">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
            <h2 className="text-base font-semibold text-slate-800">
              Recent Transactions
            </h2>
            <button
              onClick={() => navigate("/finance/transactions")}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {stats.loading ? (
              <div className="flex justify-center py-2.5">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              </div>
            ) : stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((tx, idx) => (
                <div key={idx} className="border-b border-slate-100 last:border-0 pb-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{tx.particulars}</p>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">₹ {tx.amount}</p>
                    <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${tx.type === 'RECEIPT' ? 'bg-emerald-100 text-emerald-700' :
                      tx.type === 'PAYMENT' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                      {tx.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-2.5 text-sm text-slate-500">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>

        {/* SIDE BAR WIDGETS */}
        <div className="space-y-4">
          {/* LIQUIDITY SUMMARY */}
          <div className="bg-white/80 rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
              <Wallet size={16} className="text-slate-600" />
              <h2 className="text-base font-semibold text-slate-800">
                Liquidity Overview
              </h2>
            </div>

            <div className="space-y-4">
              <StatusRow label="Petty Cash" value="₹ 45k" color="bg-primary-500" percent={60} />
              <StatusRow label="HDFC Bank" value="₹ 12.4L" color="bg-indigo-500" percent={85} />
              <StatusRow label="SBI Bank" value="₹ 8.9L" color="bg-emerald-500" percent={40} />
            </div>

            <button
              onClick={() => navigate("/finance/reports")}
              className="w-full mt-4 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              View Full Reports
            </button>
          </div>

          {/* HELP COMPONENT */}
          <div className="bg-white/80 rounded-lg border border-slate-200 p-3">
            <h2 className="text-base font-semibold text-slate-800 mb-2">
              Documentation
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Need help managing entries and viewing reports? Check our finance module constraints.
            </p>
            <button className="text-xs font-semibold text-primary-600 hover:underline">
              Read Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS (Matching Home.jsx) ================= */

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
      <div className="h-9 w-9 rounded-lg bg-secondary-500/10 flex items-center justify-center">
        <Icon size={18} className="text-secondary-500" />
      </div>

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

function StatusRow({ label, value, color = "bg-primary-500", percent }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
