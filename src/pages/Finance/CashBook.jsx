import React, { useState } from 'react';
import { 
    FileText, Calendar, Filter, Loader2, 
    Download, Printer, ChevronRight, 
    TrendingUp, TrendingDown, Landmark,
    Banknote, Receipt, ArrowDownLeft, ArrowUpRight
} from "lucide-react";
import { useGetCashBook } from "@/hooks/useFinance";
import dayjs from "dayjs";
import DateRangePicker from "@/components/Common/DateRangePicker";

const CashBook = () => {
    const [filters, setFilters] = useState({
        startDate: dayjs().startOf('month').format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD")
    });

    const { data, isLoading } = useGetCashBook(filters);
    const items = data?.items || [];

    let runningBalance = 0;

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                <Banknote size={24} />
                            </div>
                            Cash Book
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium italic">Statement of all cash transactions</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
                            <Printer size={16} /> PRINT
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm flex items-center gap-6">
                    <DateRangePicker 
                        startDate={filters.startDate} 
                        endDate={filters.endDate} 
                        onChange={(start, end) => setFilters({ ...filters, startDate: start, endDate: end })} 
                    />
                </div>

                {isLoading ? (
                    <div className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" size={40} /></div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em]">Date / Particulars</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em]">Type</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-right">Debit (In)</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-right">Credit (Out)</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-right">Running Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((entry) => {
                                    const amount = entry.amount;
                                    if (entry.entryType === 'DEBIT') runningBalance += amount;
                                    else runningBalance -= amount;

                                    return (
                                        <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-2.5">
                                                <div className="font-semibold text-slate-900 text-sm">{dayjs(entry.transaction.transactionDate).format("DD MMM YYYY")}</div>
                                                <div className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-1">{entry.transaction.narration || "No particulars"}</div>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-widest border ${entry.entryType === 'DEBIT' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                                                    {entry.entryType === 'DEBIT' ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                                                    {entry.entryType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2.5 text-right font-semibold text-emerald-600 text-sm">
                                                {entry.entryType === 'DEBIT' ? `₹${amount.toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-6 py-2.5 text-right font-semibold text-rose-600 text-sm">
                                                {entry.entryType === 'CREDIT' ? `₹${amount.toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-6 py-2.5 text-right font-semibold text-slate-900 text-sm">
                                                ₹{Math.abs(runningBalance).toLocaleString()} <span className="text-[10px] text-slate-400">{runningBalance >= 0 ? 'DR' : 'CR'}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashBook;
