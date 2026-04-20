import React, { useState } from 'react';
import { 
    ArrowDownLeft, ArrowUpRight, Search, Building2, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetBankBook, useGetBanks } from "@/hooks/useFinance";
import dayjs from "dayjs";
import DateRangePicker from "@/components/Common/DateRangePicker";

const BankBook = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        startDate: dayjs().startOf('month').format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
        bankId: ""
    });

    const { data: banksData } = useGetBanks();
    const { data, isLoading } = useGetBankBook(filters);
    
    const banks = banksData?.items || [];
    const items = data?.items || [];

    let runningBalance = 0;

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                <Landmark size={24} />
                            </div>
                            Bank Book
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium italic">Detailed statement of bank transactions</p>
                    </div>

                    <button className="bg-white/80 border border-slate-200 text-slate-800 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-black transition-all flex items-center gap-2 shadow-sm shadow-indigo-100">
                        <Download size={16} /> EXPORT
                    </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm flex flex-wrap items-center gap-6">
                    <div className="flex-1 min-w-[250px] relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            value={filters.bankId} 
                            onChange={e => setFilters({...filters, bankId: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none cursor-pointer"
                        >
                            <option value="">All Bank Accounts</option>
                            {banks.map(b => <option key={b.id} value={b.id}>{b.name} ({b.accountNumber})</option>)}
                        </select>
                    </div>

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
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em]">Ref / Mode</th>
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
                                        <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-2.5">
                                                <div className="font-semibold text-slate-900 text-sm">{dayjs(entry.transaction.transactionDate).format("DD MMM YYYY")}</div>
                                                <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{entry.transaction.narration || "No particulars"}</div>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <div className="font-bold text-indigo-600 text-xs">{entry.transaction.referenceNumber || "#UNSET"}</div>
                                                <div className="flex gap-1 mt-1.5">
                                                    {entry.transaction.modeDetails?.map((m, i) => (
                                                        <span key={i} className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{m.mode}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-2.5 text-right font-semibold text-emerald-600 text-sm group-hover:scale-105 transition-transform">
                                                {entry.entryType === 'DEBIT' ? `₹${amount.toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-6 py-2.5 text-right font-semibold text-rose-600 text-sm group-hover:scale-105 transition-transform">
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

export default BankBook;
