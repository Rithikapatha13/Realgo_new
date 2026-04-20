import React, { useState } from 'react';
import { 
    Receipt, Landmark, CreditCard, Clock, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetBRS } from "@/hooks/useFinance";
import dayjs from "dayjs";

const BRS = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetBRS();
    const items = data?.items || [];

    const getStatusColor = (status) => {
        switch(status) {
            case 'RECEIVED': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'ISSUED': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'CLEARED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'BOUNCED': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                            <div className="p-2 bg-white/80 border border-slate-200 text-slate-800 rounded-xl shadow-sm ring-4 ring-slate-100">
                                <RefreshCcw size={24} />
                            </div>
                            Bank Reconciliation (BRS)
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium italic">Tracking pending cheques and uncleared transactions</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm shadow-indigo-100">
                            <RefreshCcw size={16} /> REFRESH STATUS
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-[0.2em] mb-2">Pending Received</div>
                        <div className="text-xl font-semibold text-slate-900">₹{items.filter(i => i.status === 'RECEIVED').reduce((s, i) => s + (i.modeDetail?.amount || 0), 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-[10px] font-semibold text-blue-500 uppercase tracking-[0.2em] mb-2">Pending Issued</div>
                        <div className="text-xl font-semibold text-slate-900">₹{items.filter(i => i.status === 'ISSUED').reduce((s, i) => s + (i.modeDetail?.amount || 0), 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.2em] mb-2">Total Uncleared</div>
                        <div className="text-xl font-semibold text-slate-900">₹{items.reduce((s, i) => s + (i.modeDetail?.amount || 0), 0).toLocaleString()}</div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" size={40} /></div>
                ) : items.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-200 rounded-xl py-32 text-center">
                        <CheckCircle2 className="mx-auto mb-4 text-emerald-100" size={64} />
                        <p className="text-slate-400 font-semibold tracking-widest text-sm">ALL BANK TRANSACTIONS ARE RECONCILED</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-widest">Cheque Details</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-widest">Bank / Ref</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((cheque) => (
                                    <tr key={cheque.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-2.5">
                                            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                                                <CreditCard size={14} className="text-slate-400" /> {cheque.chequeNumber}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-1">Date: {dayjs(cheque.chequeDate).format("DD-MM-YYYY")}</div>
                                        </td>
                                        <td className="px-6 py-2.5 text-xs font-bold text-slate-600">
                                            <div className="flex items-center gap-2"><Landmark size={14} /> {cheque.bankName || "Internal Bank"}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 uppercase">TXN ID: {cheque.transaction?.referenceNumber || "N/A"}</div>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${getStatusColor(cheque.status)}`}>
                                                {cheque.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5 text-right">
                                            <div className="text-sm font-semibold text-slate-900">₹{(cheque.modeDetail?.amount || 0).toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-2.5 text-center">
                                            <button className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                                                CLEAR NOW
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BRS;
