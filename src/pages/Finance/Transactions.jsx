import React, { useState } from 'react';
import { 
    Plus, Receipt, FileText, 
    Calendar, Filter, Loader2,
    ArrowUpRight, ArrowDownLeft, RefreshCcw, Landmark,
    CheckCircle, AlertCircle, XCircle
} from "lucide-react";
import { 
    useGetTransactions, useAddTransaction, useGetLedgers, 
    useGetParties, useGetSubledgers 
} from "@/hooks/useFinance";
import { ModalWrapper } from "@/components/Common";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const Transactions = () => {
    const [params, setParams] = useState({
        type: "",
        startDate: "",
        endDate: "",
        projectId: ""
    });
    
    const { data, isLoading, isError, refetch } = useGetTransactions(params);
    const transactions = data?.items || [];

    const getStatusColor = (type) => {
        switch(type) {
            case 'RECEIPT': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'PAYMENT': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'JOURNAL': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Financial Transactions</h1>
                    <p className="text-slate-500 text-sm mt-1">Track Receipts, Payments, and Journals</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200 active:scale-95 text-sm"
                    >
                        <Plus size={20} />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px] relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                        value={params.type} 
                        onChange={e => setParams({...params, type: e.target.value})}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                    >
                        <option value="">All Types</option>
                        <option value="RECEIPT">Receipts</option>
                        <option value="PAYMENT">Payments</option>
                        <option value="JOURNAL">Journals</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl">
                    <Calendar size={16} className="text-slate-400" />
                    <input type="date" value={params.startDate} onChange={e => setParams({...params, startDate: e.target.value})} className="bg-transparent text-xs font-medium outline-none" />
                    <span className="text-slate-300">to</span>
                    <input type="date" value={params.endDate} onChange={e => setParams({...params, endDate: e.target.value})} className="bg-transparent text-xs font-medium outline-none" />
                </div>

                <button onClick={() => setParams({type: "", startDate: "", endDate: "", projectId: ""})} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-2">
                    RESET
                </button>
                <button onClick={() => refetch()} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all">
                    <RefreshCcw size={16} />
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-slate-500 font-medium">Loading transactions...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-20 text-red-500 font-medium">Error loading data.</div>
            ) : transactions.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-xl py-20 text-center text-slate-500">
                    <Receipt className="mx-auto mb-4 text-slate-300" size={48} />
                    <h3 className="text-lg font-bold text-slate-900">No Transactions Found</h3>
                    <p className="mt-1">Financial entries will appear here once recorded.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">Date / Ref</th>
                                <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">Party / Project</th>
                                <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">Ledger Heads</th>
                                <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-2.5">
                                        <div className="font-bold text-slate-900 text-sm">{dayjs(tx.transactionDate).format("DD MMM YYYY")}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.referenceNumber || "#NOREF"}</div>
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${getStatusColor(tx.transactionType)}`}>
                                            {tx.transactionType === 'RECEIPT' ? <ArrowDownLeft size={10} /> : tx.transactionType === 'PAYMENT' ? <ArrowUpRight size={10} /> : <FileText size={10} />}
                                            {tx.transactionType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <div className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{tx.party?.name || "—"}</div>
                                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                                            <Landmark size={10} /> {tx.project?.projectName || "General"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <div className="space-y-1">
                                            {tx.entries?.slice(0, 2).map((entry, idx) => (
                                                <div key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                                                    <span className={`w-1 h-1 rounded-full ${entry.entryType === 'DEBIT' ? 'bg-indigo-400' : 'bg-amber-400'}`} />
                                                    {entry.ledger?.name} {entry.subledger ? `(${entry.subledger.name})` : ''}
                                                </div>
                                            ))}
                                            {tx.entries?.length > 2 && <div className="text-[10px] text-indigo-500 font-bold">+{tx.entries.length - 2} MORE</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5 text-right">
                                        <div className="text-sm font-bold text-slate-900">₹{tx.totalAmount.toLocaleString('en-IN')}</div>
                                        <div className="text-[10px] text-slate-400 line-clamp-1">{tx.narration || "No narration"}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ModalWrapper
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Create Financial Transaction"
                width="max-w-4xl"
            >
                <TransactionForm onClose={() => setIsFormOpen(false)} onRefetch={refetch} />
            </ModalWrapper>
        </div>
    );
};

const TransactionForm = ({ onClose, onRefetch }) => {
    const { mutateAsync: addTransaction, isLoading: isAdding } = useAddTransaction();
    const { data: ledgersData } = useGetLedgers();
    const { data: partiesData } = useGetParties();
    
    const ledgers = ledgersData?.items || [];
    const parties = partiesData?.items || [];

    const [formData, setFormData] = useState({
        transactionType: "RECEIPT",
        transactionDate: dayjs().format("YYYY-MM-DD"),
        referenceNumber: "",
        narration: "",
        totalAmount: 0,
        partyId: "",
        projectId: null,
        entries: [{ ledgerId: "", subledgerId: "", amount: 0, entryType: "DEBIT", narration: "" }]
    });

    const [totals, setTotals] = useState({ debit: 0, credit: 0 });

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
        
        if (field === "ledgerId") {
            newEntries[index].subledgerId = "";
        }
        
        let dr = 0;
        let cr = 0;
        newEntries.forEach(e => {
            const val = parseFloat(e.amount) || 0;
            if (e.entryType === "DEBIT") dr += val;
            else cr += val;
        });

        setTotals({ debit: dr, credit: cr });
        setFormData({
            ...formData, 
            entries: newEntries, 
            totalAmount: dr
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (Math.abs(totals.debit - totals.credit) > 0.01) {
            return toast.error(`Transaction not balanced! Difference: ₹${Math.abs(totals.debit - totals.credit).toFixed(2)}`);
        }

        if (formData.entries.length < 2) {
            return toast.error("At least two entries are required.");
        }

        try {
            await addTransaction(formData);
            toast.success("Transaction recorded successfully");
            onRefetch();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to record transaction");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Type *</label>
                    <select value={formData.transactionType} onChange={e => setFormData({...formData, transactionType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="RECEIPT">Receipt</option>
                        <option value="PAYMENT">Payment</option>
                        <option value="JOURNAL">Journal</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Date *</label>
                    <input required type="date" value={formData.transactionDate} onChange={e => setFormData({...formData, transactionDate: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Party</label>
                    <select value={formData.partyId} onChange={e => setFormData({...formData, partyId: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="">Select Party</option>
                        {parties.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Reference #</label>
                    <input type="text" placeholder="Bill/Cheque number" value={formData.referenceNumber} onChange={e => setFormData({...formData, referenceNumber: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Journal Entries</label>
                    <button type="button" onClick={addEntry} className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        <Plus size={12} /> ADD ENTRY
                    </button>
                </div>
                {formData.entries.map((entry, idx) => (
                    <EntryRow 
                        key={idx} 
                        entry={entry} 
                        ledgers={ledgers} 
                        onUpdate={(field, value) => updateEntry(idx, field, value)}
                        onRemove={() => setFormData({...formData, entries: formData.entries.filter((_, i) => i !== idx)})}
                        showRemove={idx > 0}
                    />
                ))}
            </div>

            <div className="bg-slate-900 rounded-xl p-4 text-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Balancing Summary</span>
                    {Math.abs(totals.debit - totals.credit) < 0.01 ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle size={12} /> BALANCED
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                            <AlertCircle size={12} /> UNBALANCED: ₹{Math.abs(totals.debit - totals.credit).toFixed(2)}
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Debit</div>
                        <div className="text-xl font-bold">₹{totals.debit.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Credit</div>
                        <div className="text-xl font-bold">₹{totals.credit.toLocaleString('en-IN')}</div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button 
                    disabled={isAdding || Math.abs(totals.debit - totals.credit) > 0.01} 
                    type="submit" 
                    className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-100 active:scale-95 disabled:opacity-50"
                >
                    {isAdding && <Loader2 className="animate-spin" size={18} />}
                    Record Transaction
                </button>
            </div>
        </form>
    );
};

const EntryRow = ({ entry, ledgers, onUpdate, onRemove, showRemove }) => {
    const selectedLedger = ledgers.find(l => l.id === entry.ledgerId);
    const { data: subledgersData } = useGetSubledgers(entry.ledgerId);
    const subledgers = subledgersData?.items || [];

    return (
        <div className="grid grid-cols-12 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 items-end">
            <div className={`${selectedLedger?.bifurcated ? 'col-span-3' : 'col-span-4'}`}>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Ledger</label>
                <select value={entry.ledgerId} onChange={e => onUpdate("ledgerId", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none">
                    <option value="">Select Ledger</option>
                    {ledgers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
            </div>

            {selectedLedger?.bifurcated && (
                <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Sub-ledger</label>
                    <select value={entry.subledgerId} onChange={e => onUpdate("subledgerId", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none">
                        <option value="">Select Sub-ledger</option>
                        {subledgers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            )}

            <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1">DR/CR</label>
                <select value={entry.entryType} onChange={e => onUpdate("entryType", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none">
                    <option value="DEBIT">Debit</option>
                    <option value="CREDIT">Credit</option>
                </select>
            </div>

            <div className={`${selectedLedger?.bifurcated ? 'col-span-3' : 'col-span-3'}`}>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Amount</label>
                <input type="number" step="0.01" value={entry.amount} onChange={e => onUpdate("amount", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="col-span-1 text-right">
                {showRemove ? (
                    <button type="button" onClick={onRemove} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <XCircle size={18} />
                    </button>
                ) : <div className="w-8" />}
            </div>
        </div>
    );
};

export default Transactions;

