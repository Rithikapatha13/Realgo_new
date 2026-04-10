import React, { useState } from 'react';
import { 
    Plus, Search, User, Mail, Phone, MapPin, 
    Briefcase, Loader2, MoreVertical, Filter,
    CheckCircle, XCircle, Clock
} from "lucide-react";
import { useGetParties, useAddParty } from "@/hooks/useFinance";
import { ModalWrapper } from "@/components/Common";
import toast from "react-hot-toast";

const Parties = () => {
    const [filterType, setFilterType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const { data, isLoading, isError, refetch } = useGetParties(filterType);
    const parties = data?.items || [];

    const filteredParties = parties.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const typeTabs = [
        { key: "", label: "All Parties" },
        { key: "VENDOR", label: "Vendors" },
        { key: "CUSTOMER", label: "Customers" },
        { key: "EMPLOYEE", label: "Employees" },
        { key: "OTHER", label: "Others" },
    ];

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Parties</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage Vendors, Customers, and financial entities</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200 active:scale-95 text-sm"
                    >
                        <Plus size={20} />
                        <span>Add New Party</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search parties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full lg:w-auto">
                    {typeTabs.map((tab) => (
                        <button key={tab.key} onClick={() => setFilterType(tab.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2
                                ${filterType === tab.key
                                    ? "bg-white border-indigo-600 text-indigo-600 shadow-sm"
                                    : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-slate-500 font-medium">Loading parties...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-20">
                    <p className="text-red-500 font-medium">Error loading parties. Please try again.</p>
                    <button onClick={() => refetch()} className="mt-4 text-indigo-600 underline">Retry</button>
                </div>
            ) : filteredParties.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-xl py-20 text-center text-slate-500">
                    No parties found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredParties.map((party) => (
                        <div key={party.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                    <User size={24} />
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                                    {party.type}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-slate-900 truncate mb-1">{party.name}</h3>
                            <div className="space-y-2 text-sm text-slate-600">
                                {party.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {party.phone}</div>}
                                {party.email && <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {party.email}</div>}
                                {party.address && <div className="flex items-center gap-2 truncate"><MapPin size={14} className="text-slate-400" /> {party.address}</div>}
                                {(party.panNumber || party.gstNumber) && (
                                    <div className="pt-2 flex gap-2">
                                        {party.panNumber && <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded font-medium">PAN: {party.panNumber}</span>}
                                        {party.gstNumber && <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">GST: {party.gstNumber}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Party Modal */}
            <ModalWrapper
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Add New Party"
                width="max-w-md"
            >
                <PartyForm onClose={() => setIsFormOpen(false)} onRefetch={refetch} />
            </ModalWrapper>
        </div>
    );
};

const PartyForm = ({ onClose, onRefetch }) => {
    const { mutateAsync: addParty, isLoading: isAdding } = useAddParty();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        panNumber: "",
        gstNumber: "",
        type: "VENDOR"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addParty(formData);
            toast.success("Party added successfully");
            onRefetch();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding party");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Party Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="VENDOR">Vendor</option>
                        <option value="CUSTOMER">Customer</option>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PAN Number</label>
                    <input type="text" value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GST Number</label>
                    <input type="text" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
            </div>

            <button disabled={isAdding} type="submit" className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                {isAdding && <Loader2 className="animate-spin" size={18} />}
                Add Party
            </button>
        </form>
    );
};

export default Parties;
