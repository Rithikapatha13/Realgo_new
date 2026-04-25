import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Check,
  X,
  Loader2,
  UserCircle,
  RefreshCw,
  InboxIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { getRequests, updateRequestStatus, deleteRequest } from "@/services/request.service";
import { resolveImageUrl } from "@/utils/common";

/* ─────────────── STATUS CONFIG ─────────────── */
const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-rose-600 bg-rose-50 border-rose-200",
    icon: XCircle,
  },
};

const REQUEST_TYPES = [
  "All Types",
  "USER_APPROVAL",
  "LEAVE",
  "ADVANCE",
  "EXPENSE",
  "TRANSFER",
  "PROMOTION",
  "OTHER",
];

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

/* ─────────────── COMPONENT ─────────────── */
export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Action state
  const [actionLoading, setActionLoading] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRequests({ status: filterStatus, type: filterType !== "All Types" ? filterType : "" });
      console.log("response :",res);
      setRequests(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError("Failed to load requests. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterType]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: status }));
      await updateRequestStatus(id, status);
      toast.success(`Request ${status.toLowerCase()} successfully`);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      toast.error("Failed to update request status");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "DELETE" }));
      await deleteRequest(id);
      toast.success("Request deleted");
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      toast.error("Failed to delete request");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setConfirmDelete(null);
    }
  };

  // Client-side search filter
  const filtered = requests.filter((r) => {
    const name = `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.toLowerCase();
    const type = (r.requestType || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || type.includes(q) || r.requestedName?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 min-h-screen bg-slate-50/50">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Requests</h1>
          <p className="text-slate-500 text-sm mt-1">
            Review and manage associate requests &mdash;{" "}
            <span className="font-semibold text-slate-700">{total}</span> total
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-600 transition-all shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ─── CONTROLS BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">

        {/* LEFT — Status tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2 ${
                filterStatus === tab.key
                  ? "bg-white border-indigo-600 text-indigo-600 shadow-sm"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CENTER — Search */}
        <div className="flex items-center flex-1 justify-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm max-w-full"
            />
          </div>
        </div>

        {/* RIGHT — Request Type */}
        <div className="shrink-0 flex justify-end">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>



      {/* ─── CONTENT ─── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-medium">Loading requests...</p>
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={fetchRequests}
            className="mt-4 text-indigo-600 underline text-sm"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-24 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <InboxIcon className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No requests found</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-1 text-sm">
            There are no requests matching your current filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((req) => {
            const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
            const StatusIcon = statusCfg.icon;
            const isActing = actionLoading[req.id];
            const user = req.user;

            return (
              <div
                key={req.id}
                className="relative bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3"
              >
                {/* Delete — top-right corner */}
                <button
                  disabled={!!isActing}
                  onClick={() => setConfirmDelete(req.id)}
                  className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                  title="Delete request"
                >
                  {isActing === "DELETE" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>

                {/* Avatar + Info row */}
                <div className="flex items-center gap-3 pr-8">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white shadow">
                    {user?.image ? (
                      <img
                        src={resolveImageUrl(user.image)}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="text-slate-400" size={26} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {user?.role?.displayName || "—"}
                      </span>
                    </div>

                    {/* Request type + action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                        {req.requestType}
                      </span>
                      
                      {req.status === "PENDING" && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            disabled={!!isActing}
                            onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all border border-emerald-200 disabled:opacity-50 whitespace-nowrap"
                          >
                            {isActing === "APPROVED" ? (
                              <Loader2 size={18} className="animate-spin border-2" />
                            ) : (
                              <Check size={18} />
                            )}
                            {/* Approve */}
                          </button>

                          <button
                            disabled={!!isActing}
                            onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all border border-rose-200 disabled:opacity-50 whitespace-nowrap"
                          >
                            {isActing === "REJECTED" ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <X size={18} />
                            )}
                            {/* Reject */}
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {req.timestamp
                        ? new Date(req.timestamp).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── DELETE CONFIRM MODAL ─── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Request?</h3>
            <p className="text-slate-500 mt-2 text-sm">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-100 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
