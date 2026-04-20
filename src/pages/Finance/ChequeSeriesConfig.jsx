import React, { useState } from 'react';
import { 
    Plus, Receipt, Loader2, Save, Trash2, 
    AlertCircle, CheckCircle, Hash, Layers, XCircle, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetChequeSeries, useAddChequeSeries, useGetBanks } from "@/hooks/useFinance";
import toast from "react-hot-toast";

const ChequeSeriesConfig = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useGetChequeSeries();
    const { mutateAsync: addSeries, isLoading: isAdding } = useAddChequeSeries();
    const series = data?.items || [];

    const { data: banksData } = useGetBanks();
    const banks = banksData?.items || [];

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        bankId: "",
        startNumber: "",
        endNumber: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addSeries(formData);
            toast.success("Cheque series recorded");
            setIsFormOpen(false);
            setFormData({ bankId: "", startNumber: "", endNumber: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add series");
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cheque Series Configuration</h1>
                        <p className="text-slate-500 text-sm mt-1">Track ranges of cheques issued to the company</p>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        {isFormOpen ? <XCircle size={18} /> : <Plus size={18} />}
                        {isFormOpen ? "Close Form" : "Register Series"}
                    </button>
                </div>

                {isFormOpen && (
                    <form onSubmit={handleSubmit} className="bg-white/80 p-5 rounded-lg border border-slate-200 mb-8 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Bank *</label>
                            <select 
                                required 
                                value={formData.bankId} 
                                onChange={e => setFormData({...formData, bankId: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700"
                            >
                                <option value="">Select a Bank</option>
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Number</label>
                            <input required type="text" placeholder="000001" value={formData.startNumber} onChange={e => setFormData({...formData, startNumber: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">End Number</label>
                            <input required type="text" placeholder="000100" value={formData.endNumber} onChange={e => setFormData({...formData, endNumber: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div className="col-span-3 pt-4">
                            <button disabled={isAdding} type="submit" className="w-full bg-white/80 border border-slate-200 text-slate-800 py-2.5 rounded-xl font-semibold tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                                {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                REGISTER SERIES
                            </button>
                        </div>
                    </form>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Bank</th>
                                <th className="px-6 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Range</th>
                                <th className="px-6 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan="3" className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" /></td></tr>
                            ) : series.length === 0 ? (
                                <tr><td colSpan="3" className="py-20 text-center text-slate-400 font-bold">No cheque series found.</td></tr>
                            ) : series.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-2.5 font-bold text-slate-900">{banks.find(b => b.id === s.bankId)?.name || 'Unknown Bank'}</td>
                                    <td className="px-6 py-2.5 font-mono text-xs text-indigo-600 font-bold">
                                        {s.startNumber} <span className="text-slate-300">—</span> {s.endNumber}
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-emerald-100">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChequeSeriesConfig;
