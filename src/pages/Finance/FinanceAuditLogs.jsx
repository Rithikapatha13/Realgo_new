import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileJson,
  LayoutList
} from "lucide-react";
import apiClient from "../../config/apiClient";
import { format } from "date-fns";

export default function FinanceAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 20 });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/finance/logs", { params });
      setLogs(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [params]);

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "UPDATE": return "text-indigo-600 bg-indigo-50 border-indigo-100";
      case "DELETE": return "text-rose-600 bg-rose-50 border-rose-100";
      case "UPDATE_STATUS": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Finance Audit Logs</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor all financial activities and changes across the system.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={fetchLogs}
                className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Search</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="By User or Record ID..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Modules</h3>
                    <div className="flex flex-wrap gap-2">
                        {["GENERAL_RECEIPT", "PAYMENT_VOUCHER", "ASSOCIATE_CONTRIBUTION", "ASSOCIATE_PAYOUT"].map(m => (
                            <button key={m} className="px-3 py-1.5 bg-gray-50 text-[10px] font-black text-gray-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                {m.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Date Range</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-bold text-gray-600">Last 30 Days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3 space-y-4">
            {loading ? (
                Array(5).fill(0).map((_, i) => <div key={i} className="h-24 animate-pulse bg-gray-100/50 rounded-3xl"></div>)
            ) : logs.map((log) => (
                <div key={log.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start justify-between group">
                    <div className="flex gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getActionColor(log.action)}`}>
                            {log.action === "CREATE" ? <PlusCircle className="w-6 h-6" /> : log.action === "DELETE" ? <Trash2 className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${getActionColor(log.action)}`}>
                                    {log.action}
                                </span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {log.module.replace("_", " ")}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-800 mt-2">{log.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                                    <User className="w-3.5 h-3.5" />
                                    {log.username}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    {format(new Date(log.createdAt), "MMM dd, hh:mm a")}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedLog(log)}
                        className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                    </button>
                </div>
            ))}
        </div>

      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <History className="text-indigo-600 w-5 h-5" />
                            <h2 className="text-xl font-black text-gray-900">Activity Details</h2>
                        </div>
                        <p className="text-sm font-bold text-gray-400">Record ID: {selectedLog.recordId || "N/A"}</p>
                    </div>
                    <button onClick={() => setSelectedLog(null)} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-8">
                        {selectedLog.details?.before ? (
                            <>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                        <ArrowDownRight className="w-3.5 h-3.5" /> Before Change
                                    </h4>
                                    <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 font-mono text-xs text-rose-700 space-y-2 whitespace-pre-wrap">
                                        {JSON.stringify(selectedLog.details.before, null, 2)}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <ArrowUpRight className="w-3.5 h-3.5" /> After Change
                                    </h4>
                                    <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 font-mono text-xs text-emerald-700 space-y-2 whitespace-pre-wrap">
                                        {JSON.stringify(selectedLog.details.after, null, 2)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileJson className="w-3.5 h-3.5" /> Data Snapshot
                                </h4>
                                <div className="bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100 font-mono text-xs text-indigo-700 whitespace-pre-wrap">
                                    {JSON.stringify(selectedLog.details, null, 2)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                    <button 
                        onClick={() => setSelectedLog(null)}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                    >
                        Close View
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

// Icons needed but not imported above
function PlusCircle(props) { return <PlusCircleIcon {...props} /> }
import { PlusCircle as PlusCircleIcon, Trash2, X } from "lucide-react";
