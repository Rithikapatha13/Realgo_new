import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  PhoneCall,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Printer,
  User,
  Clock,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { getUser, getUserType } from "@/services/auth.service";
import { getTelecallerPerformance } from "@/services/performance.service";
import { exportToExcel, printHTMLTable } from "@/utils/exportExcel";
import { toast } from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  ANSWERED: "#10b981",
  INTERESTED: "#6366f1",
  NOT_INTERESTED: "#f59e0b",
  FOLLOW_UP: "#3b82f6",
  NOT_ANSWERED: "#ef4444",
  BUSY: "#8b5cf6",
  SWITCHED_OFF: "#94a3b8",
  WRONG_NUMBER: "#f43f5e",
  UNKNOWN: "#cbd5e1",
};

const STATUS_ICONS = {
  ANSWERED: CheckCircle2,
  INTERESTED: TrendingUp,
  NOT_ANSWERED: XCircle,
  FOLLOW_UP: Clock,
};

const normalise = (str) => (str || "").toLowerCase().replace(/[\s_-]/g, "");

// ─────────────────────────────────────────────────────────────────────────────
// Helper: is the logged-in user allowed to see all telecallers
// ─────────────────────────────────────────────────────────────────────────────
function canViewAll(roleKey, uType) {
  return (
    ["companyadmin", "clientadmin"].includes(roleKey) ||
    roleKey === "telecalleradmin" ||
    (roleKey === "telecaller" && uType === "admin") ||
    ["admin", "marketingadmin", "superadmin"].includes(roleKey)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={color} size={22} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function TelecallerPerformanceReport() {
  const navigate = useNavigate();
  const user = getUser();
  const userType = getUserType();
  const roleKey = normalise(user?.role);
  const uType = normalise(userType);

  const isAdmin = canViewAll(roleKey, uType);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    telecallerId: "",
    startDate: "",
    endDate: "",
  });

  // On mount, auto-fetch for telecallers (their own data)
  useEffect(() => {
    if (!isAdmin) {
      fetchData();                // telecaller → always fetch their own stats
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (overrideFilters) => {
    setLoading(true);
    try {
      const params = overrideFilters || filters;
      // For a non-admin telecaller, always scope to their own ID
      const finalParams = isAdmin
        ? params
        : { ...params, telecallerId: user?.id || user?.userId };

      const res = await getTelecallerPerformance(finalParams);
      if (res.success) {
        setData(res.data);
      } else {
        toast.error(res.message || "No data returned");
        setData(null);
      }
    } catch (err) {
      console.error("Telecaller performance fetch error:", err);
      toast.error("Failed to load performance data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => fetchData();
  const handleClear = () => {
    const reset = { telecallerId: "", startDate: "", endDate: "" };
    setFilters(reset);
    fetchData(reset);
  };

  const handleExport = () => {
    if (!data?.callLogs?.length) return toast("No data to export");
    exportToExcel(data.callLogs, "Telecaller_Performance.xlsx");
  };

  const handlePrint = () => {
    if (!data?.callLogs?.length) return toast("No data to print");
    printHTMLTable(data.callLogs, "Telecaller Performance Report");
  };

  // ── Summary stats ──────────────────────────────────────────────────────────
  const summary = data?.summary || [];
  const total = summary.reduce((acc, s) => acc + s.count, 0);

  const answered = summary.find((s) => s.status === "ANSWERED")?.count || 0;
  const interested = summary.find((s) => s.status === "INTERESTED")?.count || 0;
  const notAnswered = summary.find((s) => s.status === "NOT_ANSWERED")?.count || 0;
  const followUp = summary.find((s) => s.status === "FOLLOW_UP")?.count || 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Chart data
  const chartData = summary.map((s) => ({
    name: s.status?.replace(/_/g, " "),
    count: s.count,
    fill: STATUS_COLORS[s.status] || STATUS_COLORS.UNKNOWN,
  }));

  return (
    <div className="p-6 space-y-6 pb-16">
      
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <PhoneCall className="text-amber-500" size={26} />
            Telecaller Performance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin
              ? "View call logs and performance metrics for all telecallers"
              : "Your personal call activity and performance summary"}
          </p>
        </div>

        {data && (
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              <Download size={15} /> Export
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
            >
              <Printer size={15} /> Print
            </button>
          </div>
        )}
      </div>

      {/* ── FILTERS (admin only) ───────────────────────────────────────────── */}
      {isAdmin && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-end w-full">
          {/* Telecaller ID search */}
          <div className="w-full sm:flex-1 sm:min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
              Telecaller ID
            </label>
            <input
              type="text"
              value={filters.telecallerId}
              onChange={(e) => setFilters({ ...filters, telecallerId: e.target.value })}
              placeholder="Leave blank for all"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          {/* Start Date */}
          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white"
            />
          </div>

          {/* End Date */}
          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={handleFilter}
              disabled={loading}
              className="px-5 py-2 w-full sm:w-auto bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2"
            >
              <Filter size={15} /> Generate
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 w-full sm:w-auto bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── TELECALLER (user) – generate button ───────────────────────────── */}
      {!isAdmin && !data && (
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Filter size={16} /> View My Performance
        </button>
      )}

      {/* ── LOADING ───────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-9 h-9 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium animate-pulse">Loading performance data...</p>
        </div>
      )}

      {/* ── DATA VIEW ─────────────────────────────────────────────────────── */}
      {!loading && data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Calls" value={total} icon={PhoneCall} color="text-amber-600" bg="bg-amber-50" />
            <StatCard label="Answered" value={answered} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard label="Interested" value={interested} icon={TrendingUp} color="text-indigo-600" bg="bg-indigo-50" />
            <StatCard label="Not Answered" value={notAnswered} icon={XCircle} color="text-red-600" bg="bg-red-50" />
          </div>

          {/* Chart + Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base mb-6 flex items-center gap-2">
                <BarChart3 className="text-amber-500" size={18} />
                Call Status Distribution
              </h3>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={110}
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: "11px", fontWeight: 600 }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(251,191,36,0.06)" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-slate-400 py-12 italic">No call data available</p>
              )}
            </div>

            {/* Progress Bars */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base mb-6">Efficiency Breakdown</h3>
              <div className="space-y-5">
                {summary.length === 0 && (
                  <p className="text-slate-400 text-sm italic text-center py-8">No data</p>
                )}
                {summary.map((item, idx) => {
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  const color = STATUS_COLORS[item.status] || STATUS_COLORS.UNKNOWN;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {item.status?.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{item.count}</span>
                          <span className="text-xs text-slate-400">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Per-Telecaller Table (admin only, if returned) ─────────────── */}
          {isAdmin && data.telecallers && data.telecallers.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <User size={16} className="text-amber-500" />
                <h3 className="font-bold text-slate-800">Per Telecaller Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Total Calls</th>
                      <th className="px-6 py-3">Answered</th>
                      <th className="px-6 py-3">Interested</th>
                      <th className="px-6 py-3">Follow Up</th>
                      <th className="px-6 py-3">Not Answered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.telecallers.map((tc, idx) => (
                      <tr key={tc.id || idx} className="hover:bg-amber-50 transition">
                        <td className="px-6 py-4 font-semibold text-slate-900">{tc.name}</td>
                        <td className="px-6 py-4 text-slate-600">{tc.total}</td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-700 font-semibold">{tc.answered || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-indigo-700 font-semibold">{tc.interested || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-blue-700 font-semibold">{tc.followUp || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-red-600 font-semibold">{tc.notAnswered || 0}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Detailed Call Log Table ─────────────────────────────────────── */}
          {data.callLogs && data.callLogs.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall size={16} className="text-amber-500" />
                  <h3 className="font-bold text-slate-800">Call Log Details</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {data.callLogs.length} records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-3">#</th>
                      {isAdmin && <th className="px-6 py-3">Telecaller</th>}
                      <th className="px-6 py-3">Lead</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Notes</th>
                      <th className="px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.callLogs.map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-amber-50 transition">
                        <td className="px-6 py-3 text-slate-400">{idx + 1}</td>
                        {isAdmin && (
                          <td className="px-6 py-3 font-medium text-slate-800">
                            {log.telecallerName || "—"}
                          </td>
                        )}
                        <td className="px-6 py-3 font-medium text-slate-800">
                          {log.leadName || "—"}
                        </td>
                        <td className="px-6 py-3 text-slate-500">{log.phone || "—"}</td>
                        <td className="px-6 py-3">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                (STATUS_COLORS[log.status] || "#94a3b8") + "22",
                              color: STATUS_COLORS[log.status] || "#64748b",
                            }}
                          >
                            {log.status?.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-500 max-w-[200px] truncate">
                          {log.notes || "—"}
                        </td>
                        <td className="px-6 py-3 text-slate-500">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state when data loaded but no records */}
          {(!data.callLogs || data.callLogs.length === 0) && summary.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
              <PhoneCall className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">No call activity found for the selected period</p>
              <p className="text-slate-400 text-sm mt-1">Try widening the date range or checking a different telecaller</p>
            </div>
          )}
        </>
      )}

      {/* Initial empty state (admin hasn't clicked generate yet) */}
      {!loading && !data && isAdmin && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <PhoneCall className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">Set filters and click "Generate" to view telecaller performance</p>
        </div>
      )}
    </div>
  );
}
