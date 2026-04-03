import React, { useState } from 'react';
import { 
    Plus, Folder, FolderOpen, ChevronRight, ChevronDown, 
    FileText, Loader2, RefreshCw, AlertCircle
} from "lucide-react";
import { useGetAccounts, useAddAccount } from "@/hooks/useFinance";
import { ModalWrapper } from "@/components/Common";
import toast from "react-hot-toast";

const Accounts = () => {
    const { data, isLoading, isError, refetch } = useGetAccounts();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    const accounts = data?.items || [];

    // Helper to build hierarchy
    const buildTree = (items, parentId = null) => {
        return items
            .filter(item => item.parentId === parentId)
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }));
    };

    const accountTree = buildTree(accounts);

    const toggleNode = (id) => {
        const next = new Set(expandedNodes);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedNodes(next);
    };

    const handleAddClick = (parent = null) => {
        setSelectedParent(parent);
        setIsFormOpen(true);
    };

    const AccountNode = ({ node, depth = 0 }) => {
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div className="select-none">
                <div 
                    className={`flex items-center group py-2 px-3 rounded-lg hover:bg-indigo-50/50 transition-colors cursor-pointer ${depth === 0 ? 'bg-white border mb-2 shadow-sm' : 'ml-6 border-l border-slate-200'}`}
                    onClick={() => hasChildren && toggleNode(node.id)}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {hasChildren ? (
                            isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
                        ) : (
                            <div className="w-3.5" />
                        )}
                        
                        {hasChildren ? (
                            isExpanded ? <FolderOpen size={18} className="text-amber-500 shrink-0" /> : <Folder size={18} className="text-amber-500 shrink-0" />
                        ) : (
                            <FileText size={18} className="text-slate-400 shrink-0" />
                        )}
                        
                        <div className="flex flex-col min-w-0">
                            <span className={`text-sm font-semibold truncate ${depth === 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                                {node.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">
                                {node.code} • {node.type}
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddClick(node);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-indigo-600 hover:bg-white rounded-md transition-all sm:mr-2"
                        title="Add sub-account"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {isExpanded && hasChildren && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                        {node.children.map(child => (
                            <AccountNode key={child.id} node={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Tree</h1>
                    <p className="text-slate-500 text-sm mt-1">Hierarchical Chart of Accounts (COA)</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleAddClick(null)}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200 active:scale-95 text-sm"
                    >
                        <Plus size={20} />
                        <span>Add Root Account</span>
                    </button>
                    <button 
                        onClick={() => refetch()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-slate-500 font-medium">Loading Account Tree...</p>
                </div>
            ) : isError ? (
                <div className="bg-white border rounded-2xl p-10 text-center max-w-md mx-auto">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
                    <h3 className="text-lg font-bold text-slate-900">Error Loading Data</h3>
                    <p className="text-slate-500 mt-2">Could not load the chart of accounts. Please check your connection.</p>
                    <button onClick={() => refetch()} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium">Retry</button>
                </div>
            ) : accounts.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center text-slate-500 max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <RefreshCw className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Accounts Found</h3>
                    <p className="mt-1">Start by creating your first root account (e.g., Assets, Liabilities).</p>
                    <button onClick={() => handleAddClick(null)} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-md active:scale-95">Add Root Account</button>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-2">
                    {accountTree.map(node => (
                        <AccountNode key={node.id} node={node} />
                    ))}
                </div>
            )}

            <ModalWrapper
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={selectedParent ? `Add sub-account to "${selectedParent.name}"` : "Add Root Account"}
                width="max-w-md"
            >
                <AccountForm 
                    parentId={selectedParent?.id} 
                    parentType={selectedParent?.type}
                    onClose={() => setIsFormOpen(false)} 
                    onRefetch={refetch} 
                />
            </ModalWrapper>
        </div>
    );
};

const AccountForm = ({ parentId, parentType, onClose, onRefetch }) => {
    const { mutateAsync: addAccount, isLoading: isAdding } = useAddAccount();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        type: parentType || "ASSET",
        parentId: parentId || null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAccount(formData);
            toast.success("Account added to tree");
            onRefetch();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding account");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Account Name *</label>
                <input 
                    required 
                    type="text" 
                    placeholder="e.g. Current Assets, Bank Accounts"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Account Code</label>
                    <input 
                        required
                        type="text" 
                        placeholder="e.g. 1001, AS-01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={formData.code} 
                        onChange={e => setFormData({...formData, code: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Account Type</label>
                    <select 
                        disabled={!!parentType}
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
                    >
                        <option value="ASSET">Asset</option>
                        <option value="LIABILITY">Liability</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </div>
            </div>

            <div className="pt-4">
                <button 
                    disabled={isAdding} 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold tracking-wide hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                >
                    {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    {parentId ? "Add Sub-Account" : "Create Root Account"}
                </button>
            </div>
        </form>
    );
};

export default Accounts;
