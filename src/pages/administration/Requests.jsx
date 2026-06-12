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
  "PLOT_BOOKING",
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

  // View state
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const [activeRequestDetails, setActiveRequestDetails] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRequests({ status: filterStatus, type: filterType !== "All Types" ? filterType : "" });
      console.log("response :", res);
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
      const reqObj = requests.find((r) => r.id === id);
      if (reqObj && reqObj.requestType === "PLOT_BOOKING" && status === "APPROVED") {
        toast.success("Request approved! Plot is now Booked and payment reminders have been generated.");
      } else {
        toast.success(`Request ${status.toLowerCase()} successfully`);
      }
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2 ${filterStatus === tab.key
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

        {/* RIGHT — Request Type & View Mode */}
        <div className="shrink-0 flex items-center gap-3 justify-end">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white shrink-0">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3.5 py-2 text-xs font-bold transition-all ${
                viewMode === "cards"
                  ? "bg-indigo-600 text-white shadow-inner"
                  : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3.5 py-2 text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-inner"
                  : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Table
            </button>
          </div>
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
      ) : viewMode === "table" ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((req) => {
                  const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusCfg.icon;
                  const isActing = actionLoading[req.id];
                  const user = req.user;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Requester */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden ring-1 ring-slate-200 shadow-sm shrink-0">
                            {user?.image ? (
                              <img
                                src={resolveImageUrl(user.image)}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserCircle className="text-slate-400" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              {user?.role?.displayName || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Request Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {req.requestType}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-slate-500">
                          {req.timestamp
                            ? new Date(req.timestamp).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusCfg.color}`}>
                          <StatusIcon size={12} />
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveRequestDetails(req)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            View Details
                          </button>

                          {req.status === "PENDING" && (
                            <>
                              <button
                                disabled={!!isActing}
                                onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg disabled:opacity-50 transition-all shadow-sm"
                                title="Approve"
                              >
                                {isActing === "APPROVED" ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Check size={14} />
                                )}
                              </button>

                              <button
                                disabled={!!isActing}
                                onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg disabled:opacity-50 transition-all shadow-sm"
                                title="Reject"
                              >
                                {isActing === "REJECTED" ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <X size={14} />
                                )}
                              </button>
                            </>
                          )}

                          <button
                            disabled={!!isActing}
                            onClick={() => setConfirmDelete(req.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-all"
                            title="Delete"
                          >
                            {isActing === "DELETE" ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                className="relative bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 justify-between"
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

                <div className="space-y-3">
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
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          {user?.role?.displayName || "—"}
                        </span>
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

                  {/* Type + Status row */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {req.requestType}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${statusCfg.color}`}>
                      <StatusIcon size={12} />
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {/* View Details + Action Buttons */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveRequestDetails(req)}
                    className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all text-center shadow-sm"
                  >
                    View Details
                  </button>

                  {req.status === "PENDING" && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={!!isActing}
                        onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all border border-emerald-200 disabled:opacity-50 shadow-sm"
                        title="Approve"
                      >
                        {isActing === "APPROVED" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>

                      <button
                        disabled={!!isActing}
                        onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-all border border-rose-200 disabled:opacity-50 shadow-sm"
                        title="Reject"
                      >
                        {isActing === "REJECTED" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <X size={16} />
                        )}
                      </button>
                    </div>
                  )}
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

      {/* ─── REQUEST DETAILS MODAL ─── */}
      {activeRequestDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Request Details</h3>
              <button
                onClick={() => setActiveRequestDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* User Profiler block */}
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                  {activeRequestDetails.user?.image ? (
                    <img
                      src={resolveImageUrl(activeRequestDetails.user.image)}
                      alt={activeRequestDetails.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="text-slate-400" size={28} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {activeRequestDetails.user?.firstName} {activeRequestDetails.user?.lastName}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {activeRequestDetails.user?.role?.displayName || "—"}
                  </p>
                </div>
              </div>

              {/* Request Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Request Type</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 inline-block">
                    {activeRequestDetails.requestType}
                  </span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                  <span className="text-xs font-semibold text-slate-600 mt-0.5 inline-block">
                    {activeRequestDetails.timestamp
                      ? new Date(activeRequestDetails.timestamp).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date(activeRequestDetails.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border mt-1 ${
                  (STATUS_CONFIG[activeRequestDetails.status] || STATUS_CONFIG.PENDING).color
                }`}>
                  {(() => {
                    const cfg = STATUS_CONFIG[activeRequestDetails.status] || STATUS_CONFIG.PENDING;
                    const Icon = cfg.icon;
                    return (
                      <>
                        <Icon size={12} />
                        {cfg.label}
                      </>
                    );
                  })()}
                </span>
              </div>

              {/* Message Details */}
              {activeRequestDetails.message && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">Request Details</span>
                  <div className="bg-[#1e1e2d] text-slate-100 p-4 rounded-xl font-mono text-xs whitespace-pre-line leading-relaxed border border-slate-800 shadow-inner">
                    {activeRequestDetails.message}
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveRequestDetails(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Close
              </button>

              {activeRequestDetails.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={!!actionLoading[activeRequestDetails.id]}
                    onClick={async () => {
                      await handleStatusUpdate(activeRequestDetails.id, "APPROVED");
                      setActiveRequestDetails(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-100 flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading[activeRequestDetails.id] === "APPROVED" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Approve
                  </button>

                  <button
                    disabled={!!actionLoading[activeRequestDetails.id]}
                    onClick={async () => {
                      await handleStatusUpdate(activeRequestDetails.id, "REJECTED");
                      setActiveRequestDetails(null);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-100 flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading[activeRequestDetails.id] === "REJECTED" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <X size={14} />
                    )}
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
