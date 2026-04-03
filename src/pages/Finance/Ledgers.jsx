import React, { useState } from 'react';
import { 
    Plus, Search, BookOpen, Layers, 
    MoreVertical, Loader2, Filter, RefreshCw
} from "lucide-react";
import { useGetLedgers, useAddLedger, useGetAccounts } from "@/hooks/useFinance";
import { ModalWrapper } from "@/components/Common";
import toast from "react-hot-toast";

const Ledgers = () => {
    const [selectedAccountTree, setSelectedAccountTree] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const { data, isLoading, isError, refetch } = useGetLedgers(selectedAccountTree);
    const { data: accountsData } = useGetAccounts();
    
    const ledgers = data?.items || [];
    const accounts = accountsData?.items || [];

    const filteredLedgers = ledgers.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.accountTree?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ledgers</h1>
                    <p className="text-slate-500 text-sm mt-1">Specific ledger accounts for grouping transactions</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200 active:scale-95 text-sm"
                    >
                        <Plus size={20} />
                        <span>Add New Ledger</span>
                    </button>
                    <button 
                        onClick={() => refetch()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search ledgers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>

                <div className="w-full lg:w-64">
                    <select 
                        value={selectedAccountTree} 
                        onChange={(e) => setSelectedAccountTree(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    >
                        <option value="">All Account Heads</option>
                        {accounts.filter(a => !a.children || a.children.length === 0).map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-slate-500 font-medium">Loading ledgers...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
                    <p className="text-red-500 font-medium">Error loading ledgers. Please try again.</p>
                </div>
            ) : filteredLedgers.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center text-slate-500">
                    <Layers className="mx-auto mb-4 text-slate-300" size={48} />
                    <h3 className="text-lg font-bold text-slate-900">No Ledgers Found</h3>
                    <p className="max-w-xs mx-auto mt-2">Create ledgers under your account tree to start tracking transactions.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredLedgers.map((ledger) => (
                        <div key={ledger.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                        <BookOpen size={20} />
                                    </div>
                                    {ledger.bifurcated && (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full tracking-wider">
                                            BIFURCATED
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-900 truncate mb-1">{ledger.name}</h3>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 uppercase">
                                    <Layers size={12} /> {ledger.accountTree?.name || "Uncategorized"}
                                </p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <span>{ledger.subledgers?.length || 0} Sub-ledgers</span>
                                <button className="text-indigo-600 hover:underline">View History</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ModalWrapper
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Add New Ledger Account"
                width="max-w-md"
            >
                <LedgerForm 
                    accounts={accounts.filter(a => !a.children || a.children.length === 0)} 
                    onClose={() => setIsFormOpen(false)} 
                    onRefetch={refetch} 
                />
            </ModalWrapper>
        </div>
    );
};

const LedgerForm = ({ accounts, onClose, onRefetch }) => {
    const { mutateAsync: addLedger, isLoading: isAdding } = useAddLedger();
    const [formData, setFormData] = useState({
        name: "",
        accountTreeId: "",
        bifurcated: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.accountTreeId) return toast.error("Please select an Account Head");
        
        try {
            await addLedger(formData);
            toast.success("Ledger created successfully");
            onRefetch();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating ledger");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Ledger Name *</label>
                <input 
                    required 
                    type="text" 
                    placeholder="e.g. ICICI Bank - 1234, Cash In Hand"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Under Account Head *</label>
                <select 
                    required
                    value={formData.accountTreeId} 
                    onChange={e => setFormData({...formData, accountTreeId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                    <option value="">Select Account Head</option>
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.type})</option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 ml-1 leading-tight italic">
                    Note: You can only select leaf nodes (bottom-most accounts) from the Account Tree.
                </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input 
                    type="checkbox" 
                    id="bifurcated"
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    checked={formData.bifurcated}
                    onChange={e => setFormData({...formData, bifurcated: e.target.checked})}
                />
                <label htmlFor="bifurcated" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Enable Bifurcation?
                </label>
            </div>

            <div className="pt-4">
                <button 
                    disabled={isAdding} 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold tracking-wide hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                >
                    {isAdding && <Loader2 className="animate-spin" size={20} />}
                    Create Ledger Account
                </button>
            </div>
        </form>
    );
};

export default Ledgers;
