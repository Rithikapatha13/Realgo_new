import React, { useState, useEffect } from 'react';
import { 
    Plus, FileText, Calendar, Filter, Loader2,
    RefreshCcw, Landmark, CheckCircle, AlertCircle, 
    XCircle, Trash2
} from "lucide-react";
import { 
    useGetLedgers, useGetSubledgers, useAddTransaction
} from "@/hooks/useFinance";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const JournalVoucher = () => {
    const { mutateAsync: addTransaction, isLoading: isAdding } = useAddTransaction();
    const { data: ledgersData } = useGetLedgers();
    
    const ledgers = ledgersData?.items || [];

    const [formData, setFormData] = useState({
        transactionType: "JOURNAL",
        transactionDate: dayjs().format("YYYY-MM-DD"),
        referenceNumber: "",
        narration: "",
        totalAmount: 0,
        entries: [
            { ledgerId: "", subledgerId: "", amount: 0, entryType: "DEBIT", narration: "" },
            { ledgerId: "", subledgerId: "", amount: 0, entryType: "CREDIT", narration: "" }
        ]
    });

    const [totals, setTotals] = useState({ debit: 0, credit: 0 });

    useEffect(() => {
        let dr = 0;
        let cr = 0;
        formData.entries.forEach(e => {
            const val = parseFloat(e.amount) || 0;
            if (e.entryType === "DEBIT") dr += val;
            else cr += val;
        });
        setTotals({ debit: dr, credit: cr });
    }, [formData]);

    const addEntry = () => {
        const lastType = formData.entries[formData.entries.length - 1]?.entryType;
        setFormData({
            ...formData,
            entries: [...formData.entries, { 
                ledgerId: "", 
                subledgerId: "", 
                amount: 0, 
                entryType: lastType === "DEBIT" ? "CREDIT" : "DEBIT", 
                narration: "" 
            }]
        });
    };

    const updateEntry = (index, field, value) => {
        const newEntries = [...formData.entries];
        newEntries[index][field] = value;
        setFormData({ ...formData, entries: newEntries });
    };

    const removeEntry = (index) => {
        setFormData({
            ...formData,
            entries: formData.entries.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (Math.abs(totals.debit - totals.credit) > 0.01) {
            return toast.error("Journal is not balanced!");
        }

        try {
            await addTransaction({
                ...formData,
                totalAmount: totals.debit
            });
            toast.success("Journal Voucher recorded successfully");
            // Reset form
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to record journal");
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                <RefreshCcw size={28} />
                            </div>
                            Journal Voucher
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">Record adjustment entries and inter-ledger transfers</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    <section className="bg-white/80 p-5 rounded-lg border border-slate-200 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">Voucher Date</label>
                            <input required type="date" value={formData.transactionDate} onChange={e => setFormData({...formData, transactionDate: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">Reference Number</label>
                            <input type="text" placeholder="e.g. ADJ-001" value={formData.referenceNumber} onChange={e => setFormData({...formData, referenceNumber: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                    </section>

                    <section className="bg-white/80 p-5 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                Adjustment Entries
                            </h3>
                            <button type="button" onClick={addEntry} className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all uppercase tracking-wider">
                                + Add Entry Line
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.entries.map((entry, idx) => (
                                <EntryRow 
                                    key={idx}
                                    entry={entry}
                                    ledgers={ledgers}
                                    onUpdate={(f, v) => updateEntry(idx, f, v)}
                                    onRemove={() => removeEntry(idx)}
                                    showRemove={formData.entries.length > 2}
                                />
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end gap-12 px-6 py-2.5 bg-white/80 border border-slate-200 text-slate-800 rounded-xl shadow-sm">
                            <div className="text-right">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Debit</p>
                                <p className="text-xl font-semibold italic">₹{totals.debit.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-right border-l border-slate-700 pl-12">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Credit</p>
                                <p className="text-xl font-semibold italic">₹{totals.credit.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </section>

                    <div className="sticky bottom-6 z-10 flex items-center justify-between gap-6 p-6 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-md">
                        <div className="flex-1">
                            <textarea placeholder="Reason for adjustment / Narration..." value={formData.narration} onChange={e => setFormData({...formData, narration: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-1 focus:ring-indigo-500/20 outline-none resize-none h-12" />
                        </div>
                        <button 
                            disabled={isAdding || Math.abs(totals.debit - totals.credit) > 0.01 || totals.debit === 0}
                            type="submit" 
                            className="bg-white/80 border border-slate-200 text-slate-800 px-6 py-2.5 rounded-xl font-semibold tracking-widest hover:bg-black transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-3"
                        >
                            {isAdding ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                            POST JOURNAL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EntryRow = ({ entry, ledgers, onUpdate, onRemove, showRemove }) => {
    const selectedLedger = ledgers.find(l => l.id === entry.ledgerId);
    const { data: subledgersData } = useGetSubledgers(entry.ledgerId);
    const subledgers = subledgersData?.items || [];

    return (
        <div className="grid grid-cols-12 gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50 items-center">
            <div className="col-span-2">
                <select value={entry.entryType} onChange={e => onUpdate("entryType", e.target.value)}
                    className={`w-full border-none rounded-xl px-3 py-2 text-[10px] font-semibold tracking-widest focus:ring-2 outline-none appearance-none cursor-pointer ${
                        entry.entryType === 'DEBIT' ? 'bg-primary-600 text-white ring-indigo-500/20' : 'bg-slate-200 text-slate-600 ring-slate-500/20'
                    }`}>
                    <option value="DEBIT">DEBIT</option>
                    <option value="CREDIT">CREDIT</option>
                </select>
            </div>
            <div className="col-span-4">
                <select value={entry.ledgerId} onChange={e => onUpdate("ledgerId", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none">
                    <option value="">Select Ledger Head</option>
                    {ledgers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
            </div>
            <div className="col-span-3">
                {selectedLedger?.bifurcated && (
                    <select value={entry.subledgerId} onChange={e => onUpdate("subledgerId", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none">
                        <option value="">Select Sub-ledger</option>
                        {subledgers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                )}
            </div>
            <div className="col-span-2">
                <input type="number" placeholder="0.00" value={entry.amount || ''} onChange={e => onUpdate("amount", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-right focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="col-span-1 flex justify-end">
                {showRemove && (
                    <button type="button" onClick={onRemove} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default JournalVoucher;
