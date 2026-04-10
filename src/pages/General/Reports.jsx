import { useNavigate } from "react-router-dom";
import { getUserType, getUser } from "@/services/auth.service";
import SuperAdminReports from "../SuperAdmin/SuperAdminReports";
import { Users, BarChart3, TrendingUp, Building2 } from "lucide-react";

export default function Reports() {
  const navigate = useNavigate();
  const userType = getUserType()?.toLowerCase();
  const user = getUser();
  const roleNo = user?.roleNo ?? 999;

  if (userType === "superadmin" || userType === "super-admin") {
    return <SuperAdminReports />;
  }

  // Define reports with their required rank (roleNo)
  // Lower roleNo means higher rank.
  const allReports = [
    {
      title: "Users Report",
      subtitle: "Click to explore",
      icon: Users,
      path: "/reports/users",
      minRank: 999, // Everyone
    },
    {
      title: "Plots Report",
      subtitle: "Click to explore",
      icon: BarChart3,
      path: "/reports/plots",
      minRank: 999, // Everyone
    },
    {
      title: "Sales Report",
      subtitle: "Click to explore",
      icon: TrendingUp,
      path: "/reports/sales",
      minRank: 4, // Directors and above
    },
    {
      title: "Company Users Report",
      subtitle: "Click to explore",
      icon: Building2,
      path: "/reports/company-users",
      minRank: 2, // Owners and top directors
    },
  ];

  // Filter based on user's rank (roleNo)
  // Migration Fallback: If NO rank (roleNo) is defined yet, show all reports
  const reports = (!user?.roleNo && user?.roleNo !== 0) 
    ? allReports 
    : allReports.filter(r => roleNo <= r.minRank);

  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
      <p className="text-sm text-slate-500 mt-1">
        Select an Option to View the Report
      </p>

      {/* REPORT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {reports.map((report, idx) => {
          const Icon = report.icon;

          return (
            <button
              key={idx}
              onClick={() => navigate(report.path)}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm
                         hover:shadow-md transition text-left flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Icon className="text-primary-500" size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary-500">
                  {report.title}
                </p>
                <p className="text-xs text-slate-500">{report.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
