import React, { useState } from "react";
import { 
  BadgeIndianRupee, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical,
  Calendar,
  Building2,
  User,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle
} from "lucide-react";
import { useContributions } from "../../hooks/useAssociateFinance";
import { format } from "date-fns";

export default function AssociateContribution() {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useContributions(params);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
      case "HOLD": return "bg-blue-50 text-blue-600 border-blue-100";
      case "REJECT": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "PENDING": return <Clock className="w-3.5 h-3.5" />;
      case "HOLD": return <PauseCircle className="w-3.5 h-3.5" />;
      case "REJECT": return <AlertCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Associate Contributions</h1>
          <p className="text-gray-500 font-medium mt-1">Track and manage plot-based commissions for your associates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Commission", value: "₹45.2L", icon: BadgeIndianRupee, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Paid Amount", value: "₹28.5L", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Payouts", value: "₹12.4L", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "On Hold", value: "₹4.3L", icon: PauseCircle, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by associate or plot..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="h-8 w-px bg-gray-100 hidden md:block"></div>
          <select className="flex-1 md:flex-none bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer">
            <option>All Projects</option>
            <option>Realgo Heights</option>
            <option>Emerald Homes</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Associate</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Project & Plot</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Commission</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 h-20 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : data?.items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm">
                        {item.empName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.empName}</p>
                        <p className="text-[10px] font-bold text-gray-400 tracking-wider">{item.empUserAuthId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Building2 className="w-4 h-4 text-gray-300" />
                      <p className="text-sm font-bold">{item.plotNumber}</p>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Incentive Level {item.level || 1}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                        <span className="text-gray-300">Area:</span> {item.sqrYards} SqYds
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                        <span className="text-gray-300">Rate:</span> ₹{item.pricePerSqYard}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-base font-black text-indigo-600">₹{item.totalAmount.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(item.createdAt), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-5 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">
            Showing <span className="text-gray-900">1-10</span> of <span className="text-gray-900">{data?.total || 0}</span> Entries
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
