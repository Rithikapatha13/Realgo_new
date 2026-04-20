import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Download, CheckCircle, X, Plus, Users2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { getUser } from '@/services/auth.service';

const SRC_OPTS = {
    WEBSITE: ['Company Website', '99Acres', 'MagicBricks', 'Housing.com', 'NoBroker'],
    SOCIAL_MEDIA: ['Facebook', 'Instagram', 'LinkedIn', 'YouTube'],
    REFERRAL: ['Client Referral', 'Employee Referral'],
    WALK_IN: ['Office Walk-in', 'Site Walk-in'],
    OTHER: ['Cold Call', 'Event', 'Newspaper']
};

export default function UploadLeads() {
    const navigate = useNavigate();
    const user = getUser();
    const token = localStorage.getItem("token");
    const [drag, setDrag] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [prog, setProg] = useState(0);
    const [result, setResult] = useState(null);
    const [form, setForm] = useState({ leadName: '', leadContact: '', leadEmail: '', leadCity: '', leadSource: 'WEBSITE', description: 'Company Website' });

    async function uploadFile(file) {
        if (!file) return;
        if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
            toast.error('Only CSV and Excel files are supported');
            return;
        }

        setUploading(true);
        setProg(20);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const API_URL = import.meta.env.VITE_API_URL + "/crm/leads/bulk";
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProg(percentCompleted > 90 ? 90 : percentCompleted);
                }
            });

            setProg(100);
            setResult({ count: response.data.count || 0, name: file.name });
            toast.success(`${response.data.count || 0} leads imported successfully`);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Import failed');
            setProg(0);
        } finally {
            setUploading(false);
            setTimeout(() => setProg(0), 1500);
        }
    }

    async function addManual() {
        if (!form.leadName || !form.leadContact) {
            toast.error('Name and phone are required');
            return;
        }
        try {
            const API_URL = import.meta.env.VITE_API_URL + "/crm/leads";
            await axios.post(API_URL, form, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success(`Lead added: ${form.leadName}`);
            setForm({ leadName: '', leadContact: '', leadEmail: '', leadCity: '', leadSource: 'WEBSITE', description: 'Company Website' });
        } catch (error) {
            toast.error('Failed to add lead');
        }
    }

    function dlSample() {
        const csv = `leadName,leadContact,leadEmail,leadSource,description,leadCity\nAmit Sharma,9876543210,amit@gmail.com,SOCIAL_MEDIA,Facebook,Hyderabad\nSunita Reddy,9876543211,sunita@gmail.com,WEBSITE,99Acres,Secunderabad`;
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'realcrm_sample.csv';
        a.click();
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Upload size={24} className="text-primary-600" />
                    Upload Leads
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    High-speed CSV batch processing and manual data entry terminal.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* CSV UPLOAD */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <FileText size={18} className="text-primary-600" />
                            Batch Processor
                        </h2>
                        <button onClick={dlSample} className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-1.5">
                            <Download size={14} /> Sample.csv
                        </button>
                    </div>

                    <div
                        className={`h-28 flex items-center justify-center gap-4 border-2 border-dashed rounded-xl px-4 transition-all duration-300 relative cursor-pointer
                            ${drag ? "border-primary-500 bg-primary-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
                        onClick={() => document.getElementById("csv-input").click()}
                        onDragOver={e => { e.preventDefault(); setDrag(true) }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => { e.preventDefault(); setDrag(false); uploadFile(e.dataTransfer.files[0]) }}
                    >
                        {!uploading ? (
                            <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-primary-600">
                                    <Upload size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                                    <p className="text-xs text-slate-500 mt-1">CSV or Excel (max. 10MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 w-full max-w-xs absolute">
                                <div className="text-sm font-bold text-primary-600 animate-pulse">Processing file...</div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: prog + '%' }} />
                                </div>
                            </div>
                        )}
                    </div>
                    <input id="csv-input" type="file" accept=".csv, .xlsx" className="hidden" onChange={e => uploadFile(e.target.files[0])} />

                    {result && !uploading && (
                        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <CheckCircle size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-emerald-800">Success: {result.count} Leads Imported</div>
                                <div className="text-xs text-emerald-600 truncate mt-0.5">{result.name}</div>
                            </div>
                            <button onClick={() => setResult(null)} className="text-emerald-600 hover:text-emerald-800 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* MANUAL ENTRY */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Plus size={18} className="text-primary-600" />
                            Manual Single Entry
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                            <input className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block" 
                                placeholder="Lead Name" value={form.leadName} onChange={e => setForm(p => ({ ...p, leadName: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                            <input className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block" 
                                placeholder="98XXXXXXXX" value={form.leadContact} onChange={e => setForm(p => ({ ...p, leadContact: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block" 
                                type="email" placeholder="example@mail.com" value={form.leadEmail} onChange={e => setForm(p => ({ ...p, leadEmail: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City/Location</label>
                            <input className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block" 
                                placeholder="Area, City" value={form.leadCity} onChange={e => setForm(p => ({ ...p, leadCity: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Traffic Source</label>
                            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block" 
                                value={form.leadSource} onChange={e => setForm(p => ({ ...p, leadSource: e.target.value, description: (SRC_OPTS[e.target.value] || [''])[0] }))}>
                                {Object.keys(SRC_OPTS).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specific Detail</label>
                            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block" 
                                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}>
                                {(SRC_OPTS[form.leadSource] || []).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={addManual} className="w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all focus:ring-4 focus:ring-primary-300 flex items-center justify-center gap-2">
                        <Plus size={18} /> Add New Lead
                    </button>
                </div>
            </div>
        </div>
    );
}
