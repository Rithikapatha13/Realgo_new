import React, { useState } from "react";
import { 
  CreditCard, 
  Search, 
  Plus, 
  Download, 
  Calendar, 
  User, 
  CheckCircle2,
  ExternalLink,
  History,
  TrendingUp,
  Wallet
} from "lucide-react";
import { usePayouts } from "../../hooks/useAssociateFinance";
import { format } from "date-fns";

export default function AssociatePayout() {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = usePayouts(params);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Associate Payouts</h1>
          <p className="text-gray-500 font-medium mt-1">Record and verify actual cash or bank transfers to associates.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Plus className="w-4 h-4" />
          New Payout
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <Wallet className="w-24 h-24 text-indigo-600" />
          </div>
          <div className="relative">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Available for Payout</p>
            <p className="text-3xl font-black text-gray-900 mt-1">₹12.45L</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[11px] font-bold">+12% from last month</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <CheckCircle2 className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="relative">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Paid (MTD)</p>
            <p className="text-3xl font-black text-gray-900 mt-1">₹6.20L</p>
            <p className="text-[11px] font-bold text-gray-400 mt-4 tracking-wide italic">Last payout: 2 hours ago</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <History className="w-24 h-24 text-amber-600" />
          </div>
          <div className="relative">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Verification</p>
            <p className="text-3xl font-black text-gray-900 mt-1">14 Entries</p>
            <button className="mt-4 text-[11px] font-bold text-indigo-600 hover:underline underline-offset-4 tracking-widest uppercase">Review Pending</button>
          </div>
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-4">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <History className="w-4 h-4" /> Payout History
             </h3>
             <div className="h-4 w-px bg-gray-200"></div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input type="text" placeholder="Search by ID..." className="pl-9 pr-4 py-1.5 bg-white border border-gray-100 rounded-lg text-xs outline-none" />
             </div>
          </div>
          <button className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all flex items-center gap-1">
             <Download className="w-4 h-4" /> CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Associate</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount Paid</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <tr key={i} className="h-20 animate-pulse bg-gray-50/20"></tr>)
              ) : data?.items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase tracking-tighter">
                          {item.associateId.slice(0, 2)}
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-900">Associate Name</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5">{format(new Date(item.payoutDate), "MMM dd, yyyy • HH:mm")}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <CreditCard className="w-4 h-4 text-gray-300" />
                       <span className="text-xs font-bold text-gray-700">{item.paymentMode || "Bank Transfer"}</span>
                    </div>
                    {item.contribution && (
                      <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">Linked to Plot {item.contribution.plotNumber}</p>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-mono font-bold text-gray-400">TXN-{item.transactionId || item.id.slice(0,8).toUpperCase()}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-lg font-black text-gray-900 tracking-tight">₹{item.amountPaid.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                       <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                          <ExternalLink className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
