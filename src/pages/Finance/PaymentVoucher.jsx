import React, { useState, useEffect } from 'react';
import { 
    Plus, CreditCard, Calendar, Filter, Loader2,
    ArrowUpRight, Landmark, CheckCircle, AlertCircle, 
    XCircle, Trash2, Wallet, Globe, Banknote, Receipt
} from "lucide-react";
import { 
    useGetLedgers, useGetParties, useGetSubledgers,
    useAddPayment, useGetBanks
} from "@/hooks/useFinance";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const PaymentVoucher = () => {
    const { mutateAsync: addPayment, isLoading: isAdding } = useAddPayment();
    const { data: ledgersData } = useGetLedgers();
    const { data: partiesData } = useGetParties();
    const { data: banksData } = useGetBanks();
    
    const ledgers = ledgersData?.items || [];
    const parties = partiesData?.items || [];
    const banks = banksData?.items || [];

    const [formData, setFormData] = useState({
        transactionDate: dayjs().format("YYYY-MM-DD"),
        referenceNumber: "",
        narration: "",
        totalAmount: 0,
        partyId: "",
        projectId: null,
        entries: [
            { ledgerId: "", subledgerId: "", amount: 0, entryType: "DEBIT", narration: "" },
            { ledgerId: "", subledgerId: "", amount: 0, entryType: "CREDIT", narration: "" }
        ],
        modeDetails: [
            { mode: "CASH", amount: 0, companyBankId: "", chequeNumber: "", chequeDate: "", referenceNumber: "" }
        ]
    });

    const [totals, setTotals] = useState({ debit: 0, credit: 0, modes: 0 });

    useEffect(() => {
        let dr = 0;
        let cr = 0;
        formData.entries.forEach(e => {
            const val = parseFloat(e.amount) || 0;
            if (e.entryType === "DEBIT") dr += val;
            else cr += val;
        });

        let mTotal = 0;
        formData.modeDetails.forEach(m => {
            mTotal += (parseFloat(m.amount) || 0);
        });

        setTotals({ debit: dr, credit: cr, modes: mTotal });
    }, [formData]);

    const addEntry = (type) => {
        setFormData({
            ...formData,
            entries: [...formData.entries, { ledgerId: "", subledgerId: "", amount: 0, entryType: type, narration: "" }]
        });
    };

    const removeEntry = (index) => {
        setFormData({
            ...formData,
            entries: formData.entries.filter((_, i) => i !== index)
        });
    };

    const updateEntry = (index, field, value) => {
        const newEntries = [...formData.entries];
        newEntries[index][field] = value;
        setFormData({ ...formData, entries: newEntries });
    };

    const updateMode = (index, field, value) => {
        const newModes = [...formData.modeDetails];
        newModes[index][field] = value;
        setFormData({ ...formData, modeDetails: newModes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (Math.abs(totals.debit - totals.credit) > 0.01) {
            return toast.error("Journal entries are not balanced!");
        }

        if (Math.abs(totals.credit - totals.modes) > 0.01) {
            return toast.error("Payment mode sum does not match total amount!");
        }

        try {
            await addPayment({
                ...formData,
                totalAmount: totals.credit
            });
            toast.success("Payment Voucher recorded successfully");
            // Reset form
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to record payment");
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                                <CreditCard size={28} />
                            </div>
                            Payment Voucher
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">Record outgoing payments and generate expense vouchers</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    {/* Basic Info */}
                    <section className="bg-white/80 p-5 rounded-lg border border-slate-200 grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">Payment Date</label>
                            <input required type="date" value={formData.transactionDate} onChange={e => setFormData({...formData, transactionDate: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none transition-all" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">Voucher #</label>
                            <input type="text" placeholder="Auto-generated" value={formData.referenceNumber} onChange={e => setFormData({...formData, referenceNumber: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none transition-all" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">Paid To (Party)</label>
                            <select value={formData.partyId} onChange={e => setFormData({...formData, partyId: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none transition-all appearance-none cursor-pointer">
                                <option value="">Select Party</option>
                                {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </section>

                    {/* Journal Entries */}
                    <section className="bg-white/80 p-5 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                Ledger Breakdown
                            </h3>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => addEntry('DEBIT')} className="text-[10px] font-semibold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-all uppercase tracking-wider">
                                    + Debit Entry
                                </button>
                                <button type="button" onClick={() => addEntry('CREDIT')} className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all uppercase tracking-wider">
                                    + Credit Entry
                                </button>
                            </div>
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

                    {/* Payment Mode Details */}
                    <section className="bg-white/80 p-5 rounded-lg border border-slate-200">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 bg-rose-500 rounded-full" />
                            Payment Modes
                        </h3>

                        <div className="space-y-6">
                            {formData.modeDetails.map((mode, idx) => (
                                <ModeRow 
                                    key={idx}
                                    mode={mode}
                                    banks={banks}
                                    onUpdate={(f, v) => updateMode(idx, f, v)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Summary & Submit */}
                    <div className="sticky bottom-6 z-10 flex items-center justify-between gap-6 p-6 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-md">
                        <div className="flex-1">
                            <textarea placeholder="Payment Narration..." value={formData.narration} onChange={e => setFormData({...formData, narration: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-1 focus:ring-rose-500/20 outline-none resize-none h-12" />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Payment Amount</p>
                                <p className="text-xl font-semibold text-slate-900 tracking-tighter">₹{totals.modes.toLocaleString('en-IN')}</p>
                            </div>
                            <button 
                                disabled={isAdding || Math.abs(totals.debit - totals.credit) > 0.01 || totals.credit === 0}
                                type="submit" 
                                className="bg-white/80 border border-slate-200 text-slate-800 px-6 py-2.5 rounded-xl font-semibold tracking-widest hover:bg-black transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-3"
                            >
                                {isAdding ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                POST PAYMENT
                            </button>
                        </div>
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
        <div className={`grid grid-cols-12 gap-3 p-4 rounded-xl border transition-all ${entry.entryType === 'DEBIT' ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/30 border-slate-100'}`}>
            <div className="col-span-2">
                <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-semibold tracking-widest ${entry.entryType === 'DEBIT' ? 'bg-rose-600 text-white' : 'bg-primary-600 text-white'}`}>
                    {entry.entryType}
                </span>
            </div>
            <div className="col-span-4">
                <select value={entry.ledgerId} onChange={e => onUpdate("ledgerId", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-rose-500 outline-none appearance-none">
                    <option value="">Select Ledger Head</option>
                    {ledgers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
            </div>
            {selectedLedger?.bifurcated ? (
                <div className="col-span-3">
                    <select value={entry.subledgerId} onChange={e => onUpdate("subledgerId", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-rose-500 outline-none appearance-none">
                        <option value="">Select Sub-ledger</option>
                        {subledgers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            ) : <div className="col-span-3" />}
            <div className="col-span-2">
                <input type="number" placeholder="Amount" value={entry.amount || ''} onChange={e => onUpdate("amount", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-right focus:ring-1 focus:ring-rose-500 outline-none" />
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

const ModeRow = ({ mode, banks, onUpdate }) => {
    return (
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl w-fit shadow-sm border border-slate-100">
                <button type="button" onClick={() => onUpdate('mode', 'CASH')} className={`px-4 py-2 rounded-xl text-[10px] font-semibold tracking-widest flex items-center gap-2 transition-all ${mode.mode === 'CASH' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Banknote size={14} /> CASH
                </button>
                <button type="button" onClick={() => onUpdate('mode', 'CHEQUE')} className={`px-4 py-2 rounded-xl text-[10px] font-semibold tracking-widest flex items-center gap-2 transition-all ${mode.mode === 'CHEQUE' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Receipt size={14} /> CHEQUE
                </button>
                <button type="button" onClick={() => onUpdate('mode', 'ONLINE')} className={`px-4 py-2 rounded-xl text-[10px] font-semibold tracking-widest flex items-center gap-2 transition-all ${mode.mode === 'ONLINE' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Globe size={14} /> ONLINE
                </button>
            </div>

            <div className="grid grid-cols-4 gap-6">
                <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mode Amount</label>
                    <input type="number" value={mode.amount || ''} onChange={e => onUpdate("amount", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-rose-500 outline-none" />
                </div>

                {mode.mode === 'CASH' && (
                    <div className="col-span-3 py-6 text-slate-400 text-xs italic font-medium flex items-center gap-2">
                        <AlertCircle size={14} /> Disbursed directly from standard cash ledge.
                    </div>
                )}

                {mode.mode === 'CHEQUE' && (
                    <>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Paid From Bank</label>
                            <select value={mode.companyBankId} onChange={e => onUpdate("companyBankId", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-500 outline-none appearance-none cursor-pointer">
                                <option value="">Select Company Bank</option>
                                {banks.map(b => <option key={b.id} value={b.id}>{b.name} ({b.accountNumber})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Cheque Number</label>
                            <input type="text" placeholder="6-digit #" value={mode.chequeNumber} onChange={e => onUpdate("chequeNumber", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-500 outline-none" />
                        </div>
                    </>
                )}

                {mode.mode === 'ONLINE' && (
                    <>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Paid From Bank</label>
                            <select value={mode.companyBankId} onChange={e => onUpdate("companyBankId", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-500 outline-none appearance-none cursor-pointer">
                                <option value="">Select Company Bank</option>
                                {banks.map(b => <option key={b.id} value={b.id}>{b.name} ({b.accountNumber})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">UTR / Ref #</label>
                            <input type="text" placeholder="TXN ID" value={mode.referenceNumber} onChange={e => onUpdate("referenceNumber", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-500 outline-none" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentVoucher;
