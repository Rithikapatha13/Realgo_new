import React, { useState } from "react";
import { 
  Receipt, 
  Search, 
  Plus, 
  Download, 
  Calendar, 
  User, 
  Tag, 
  MoreVertical,
  ArrowRight
} from "lucide-react";
import { useExpenses } from "../../hooks/useAssociateFinance";
import { format } from "date-fns";

export default function AssociateExpense() {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useExpenses(params);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Associate Expenses</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and reimburse associate-related business costs.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Plus className="w-4 h-4" />
          Log Expense
        </button>
      </div>

      {/* Grid Layout for Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search expenses..."
                className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-24 animate-pulse bg-gray-50/50"></div>)
              ) : data?.items?.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-gray-900">{item.expenseType}</p>
                        <span className="text-[10px] font-black px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase tracking-tighter">Verified</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                          <User className="w-3 h-3" />
                          {item.associateName}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(item.date), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="text-lg font-black text-gray-900">₹{item.amountSpent.toLocaleString()}</p>
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline mt-1">View Receipt</button>
                    </div>
                    <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
              {data?.items?.length === 0 && (
                <div className="p-12 text-center">
                  <Receipt className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                  <p className="text-sm font-bold text-gray-400">No expenses recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest opacity-80">Monthly Spent</p>
            <p className="text-3xl font-black mt-1">₹84,200</p>
            <div className="mt-6 pt-6 border-t border-indigo-500/50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-indigo-200">Pending Approval</p>
                <p className="text-sm font-black mt-0.5">₹12,500</p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-40" />
              <div className="text-right">
                <p className="text-[10px] font-bold text-indigo-200">Top Category</p>
                <p className="text-sm font-black mt-0.5">Site Visits</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Expense Categories</h3>
            <div className="space-y-4">
              {[
                { label: "Fuel & Travel", val: "45%", color: "bg-indigo-500" },
                { label: "Client Refreshments", val: "25%", color: "bg-emerald-500" },
                { label: "Marketing Collaterals", val: "20%", color: "bg-amber-500" },
                { label: "Other", val: "10%", color: "bg-rose-500" },
              ].map((c, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-gray-500">{c.label}</span>
                    <span className="text-gray-900">{c.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color}`} style={{ width: c.val }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
