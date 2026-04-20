import React, { useState } from 'react';
import {
    XCircle, ArrowLeft, Plus, Loader2, Save, Landmark, CreditCard, Building2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetBanks, useAddBank } from "@/hooks/useFinance";
import toast from "react-hot-toast";

const BankConfig = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useGetBanks();
    const { mutateAsync: addBank, isLoading: isAdding } = useAddBank();
    const banks = data?.items || [];

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        ifscCode: "",
        branchName: "",
        openingBalance: 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addBank(formData);
            toast.success("Bank added successfully");
            setIsFormOpen(false);
            setFormData({ name: "", accountNumber: "", ifscCode: "", branchName: "", openingBalance: 0 });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add bank");
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Bank Configuration</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage company bank accounts for transactions</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        {isFormOpen ? <XCircle size={18} /> : <Plus size={18} />}
                        {isFormOpen ? "Close Form" : "Add New Bank"}
                    </button>
                </div>

                {isFormOpen && (
                    <form onSubmit={handleSubmit} className="bg-white/80 p-5 rounded-lg border border-slate-200 mb-8 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Bank Name *</label>
                            <input required type="text" placeholder="e.g. HDFC Bank, SBI" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Number *</label>
                            <input required type="text" placeholder="XXXX XXXX XXXX" value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">IFSC Code</label>
                            <input type="text" placeholder="HDFC0001234" value={formData.ifscCode} onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Branch Name</label>
                            <input type="text" placeholder="Madhapur Branch" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Opening Balance</label>
                            <input type="number" value={formData.openingBalance} onChange={e => setFormData({ ...formData, openingBalance: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div className="col-span-2 pt-4">
                            <button disabled={isAdding} type="submit" className="w-full bg-white/80 border border-slate-200 text-slate-800 py-2.5 rounded-xl font-semibold tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                                {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                SAVE BANK ACCOUNT
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="col-span-2 py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" size={40} /></div>
                    ) : banks.length === 0 ? (
                        <div className="col-span-2 bg-white border border-dashed border-slate-300 rounded-xl py-20 text-center">
                            <Building2 className="mx-auto mb-4 text-slate-200" size={48} />
                            <p className="text-slate-400 font-bold">No banks configured yet.</p>
                        </div>
                    ) : banks.map(bank => (
                        <div key={bank.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Landmark size={24} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Balance</span>
                                    <p className="text-lg font-semibold text-slate-900">₹{(bank.currentBalance ?? 0).toLocaleString()}</p>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{bank.name}</h3>
                            <div className="space-y-1.5">
                                <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                    <CreditCard size={14} className="text-slate-300" /> {bank.accountNumber}
                                </p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Building2 size={12} className="text-slate-300" /> {bank.branchName || "N/A"} • {bank.ifscCode || "NO IFSC"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BankConfig;
