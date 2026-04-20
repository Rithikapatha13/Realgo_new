import React, { useState } from 'react';
import { 
    User, Bookmark, Clock, CheckCircle2, ArrowLeft, Calendar, Loader2, FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetDayBook } from "@/hooks/useFinance";
import dayjs from "dayjs";

const DayBook = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        date: dayjs().format("YYYY-MM-DD")
    });

    const { data, isLoading } = useGetDayBook(filters);
    const transactions = data?.items || [];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                            <div className="p-2 bg-indigo-900 text-white rounded-xl">
                                <Bookmark size={24} />
                            </div>
                            Day Book
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium italic">Chronological list of all transactions for the day</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                        <Calendar size={20} className="text-indigo-600 ml-2" />
                        <input type="date" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} 
                            className="bg-transparent text-sm font-semibold outline-none px-2 py-2" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" size={40} /></div>
                ) : transactions.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-200 rounded-xl py-32 text-center">
                        <FileText className="mx-auto mb-4 text-slate-200" size={64} />
                        <p className="text-slate-400 font-semibold tracking-widest text-sm">NO TRANSACTIONS RECORDED ON THIS DAY</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                                <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-widest ${
                                            tx.transactionType === 'RECEIPT' ? 'bg-emerald-600 text-white' : 
                                            tx.transactionType === 'PAYMENT' ? 'bg-rose-600 text-white' : 
                                            'bg-primary-600 text-white'
                                        }`}>
                                            {tx.transactionType}
                                        </span>
                                        <div className="text-xs font-semibold text-slate-400 font-mono tracking-wider">#{tx.referenceNumber || "NO-REF"}</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <div className="flex items-center gap-1.5"><Clock size={14} /> {dayjs(tx.createdAt).format("HH:mm A")}</div>
                                        <div className="flex items-center gap-1.5"><User size={14} /> {tx.createdBy?.username}</div>
                                    </div>
                                </div>
                                
                                <div className="p-6 grid grid-cols-12 gap-5 items-center">
                                    <div className="col-span-4">
                                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{tx.narration || "No Narration"}</h3>
                                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Voucher Description</div>
                                    </div>

                                    <div className="col-span-5 grid grid-cols-2 gap-4 border-l border-r border-slate-100 px-8">
                                        <div className="space-y-2">
                                            {tx.entries.filter(e => e.entryType === 'DEBIT').map((e, idx) => (
                                                <div key={idx} className="text-xs font-bold text-slate-600 flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1 shrink-0" />
                                                    {e.ledger?.name}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2 border-l border-slate-50 pl-4">
                                            {tx.entries.filter(e => e.entryType === 'CREDIT').map((e, idx) => (
                                                <div key={idx} className="text-xs font-bold text-slate-400 flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1 shrink-0" />
                                                    {e.ledger?.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-3 text-right">
                                        <div className="text-xl font-semibold text-slate-900 tracking-tighter">₹{tx.totalAmount.toLocaleString()}</div>
                                        <div className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
                                            <CheckCircle2 size={12} /> POSTED
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayBook;
