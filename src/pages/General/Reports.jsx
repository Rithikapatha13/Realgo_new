import { useNavigate } from "react-router-dom";
import { getUserType, getUser } from "@/services/auth.service";
import SuperAdminReports from "../SuperAdmin/SuperAdminReports";
import {
  Users,
  BarChart3,
  TrendingUp,
  Building2,
  LandPlot,
  PhoneCall,
  ArrowLeft,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Role constants (normalised – no spaces / dashes / underscores)
// ─────────────────────────────────────────────────────────────────────────────
const COMPANY_ADMIN_ROLES  = ["companyadmin", "clientadmin"];
const TELECALLER_ADMIN     = "telecalleradmin";
const MARKETING_ADMIN_ROLES = ["admin", "marketingadmin"];
const ASSOCIATE_ROLES      = ["associate", "user", "teamlead"];
const TELECALLER_ROLE      = "telecaller";

// ─────────────────────────────────────────────────────────────────────────────
// Helper – normalise a role string to a single key
// ─────────────────────────────────────────────────────────────────────────────
const normalise = (str) =>
  (str || "").toLowerCase().replace(/[\s_-]/g, "");

// ─────────────────────────────────────────────────────────────────────────────
// Report card definitions
// ─────────────────────────────────────────────────────────────────────────────
const ALL_REPORT_CARDS = {
  plots: {
    title: "Plots Report",
    subtitle: "View plot availability & booking status",
    icon: LandPlot,
    path: "/reports/plots",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  sales: {
    title: "Sales Report",
    subtitle: "View booked & registered sales data",
    icon: TrendingUp,
    path: "/reports/sales",
    gradient: "from-rose-500 to-orange-500",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  users: {
    title: "Users Report",
    subtitle: "View associate & team member data",
    icon: Users,
    path: "/reports/users",
    gradient: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  companyUsers: {
    title: "Company Users Report",
    subtitle: "View company-linked user data",
    icon: Building2,
    path: "/reports/company-users",
    gradient: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  telecallerPerformance: {
    title: "Telecaller Performance",
    subtitle: "View call logs & performance metrics",
    icon: PhoneCall,
    path: "/reports/telecaller-performance",
    gradient: "from-amber-500 to-yellow-400",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Role → visible report cards mapping
//
//  1. Company Admin       → Plots, Sales, Users, CompanyUsers, TelecallerPerf
//  2. Telecaller Admin    → Plots, Users, TelecallerPerf
//  3. Marketing Admin     → Plots, Sales, Users, CompanyUsers
//  4. Associate           → Plots, Users
//  5. Telecaller (user)   → TelecallerPerf  (redirected directly)
// ─────────────────────────────────────────────────────────────────────────────
function getReportCards(roleKey, userType) {
  // Telecaller admin
  if (roleKey === TELECALLER_ADMIN || (roleKey === TELECALLER_ROLE && normalise(userType) === "admin")) {
    return ["plots", "users", "telecallerPerformance"];
  }

  // Company admin / client admin
  if (COMPANY_ADMIN_ROLES.includes(roleKey)) {
    return ["plots", "sales", "users", "companyUsers", "telecallerPerformance"];
  }

  // Marketing / regular admin
  if (MARKETING_ADMIN_ROLES.includes(roleKey)) {
    return ["plots", "sales", "users", "companyUsers"];
  }

  // Associates / team leads
  if (ASSOCIATE_ROLES.includes(roleKey)) {
    return ["plots", "users"];
  }

  // Telecaller (user) – show only their personal performance
  if (roleKey === TELECALLER_ROLE) {
    return ["telecallerPerformance"];
  }

  // Fallback – show basic reports
  return ["plots", "users"];
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Reports() {
  const navigate  = useNavigate();
  const userType  = getUserType();
  const user      = getUser();

  const roleKey   = normalise(user?.role);
  const uType     = normalise(userType);

  // SuperAdmin gets its own view
  if (roleKey === "superadmin" || uType === "superadmin") {
    return <SuperAdminReports />;
  }

  const cardKeys  = getReportCards(roleKey, userType);
  const cards     = cardKeys.map((k) => ALL_REPORT_CARDS[k]).filter(Boolean);

  return (
    <div className="p-6">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a report to view and export data
        </p>
      </div>

      {/* REPORT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((report, idx) => {
          const Icon = report.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(report.path)}
              className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm
                         hover:shadow-lg transition-all duration-200 text-left
                         hover:-translate-y-1 active:scale-95"
            >
              {/* Icon */}
              <div
                className={`h-12 w-12 rounded-xl ${report.bg} flex items-center justify-center mb-4
                            group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={report.iconColor} size={22} />
              </div>

              {/* Text */}
              <p className="text-base font-semibold text-slate-800 mb-1">
                {report.title}
              </p>
              <p className="text-xs text-slate-500">{report.subtitle}</p>

              {/* Arrow */}
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Report</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
