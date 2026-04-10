import React, { useState } from 'react';
import { Phone, MapPin, X, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateLeadCall } from '@/services/crm.service';

export default function CallModal({ lead, onClose, onSaved }) {
    const [status, setStatus] = useState(lead.leadStatus !== 'NEW' ? lead.leadStatus : '');
    const [notes, setNotes] = useState('');
    const [cbAt, setCbAt] = useState('');
    const [saving, setSaving] = useState(false);

    async function save() {
        if (!status) {
            toast.error('Please select an outcome');
            return;
        }
        setSaving(true);
        try {
            await updateLeadCall(lead.id, {
                status,
                notes,
                callbackAt: cbAt ? new Date(cbAt) : null,
                isAssociateUpdate: false // Default to telecaller update
            });
            toast.success(`${lead.leadName} updated successfully`);
            onSaved();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update lead');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl flex items-center gap-2 text-slate-900">
                        <Phone size={20} className="text-primary-600" />
                        Log Interaction
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                    <div className="font-bold text-slate-800">{lead.leadName}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2 font-medium">
                        <span className="flex items-center gap-1.5"><Phone size={14} /> {lead.leadContact}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {lead.leadCity || 'City—'}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lead Outcome *</label>
                        <select 
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                            value={status} 
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="">Select an outcome</option>
                            <option value="HOT">🔥 Hot — Extremely Interested</option>
                            <option value="WARM">🌡️ Warm — Interested, Needs Discussion</option>
                            <option value="COLD">❄️ Cold — Not Interested</option>
                            <option value="LATER">⏰ Call Back Later</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Discussion Notes</label>
                        <textarea 
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                            rows={3} 
                            placeholder="Summarize your conversation..." 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                        />
                    </div>

                    {status === 'LATER' && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Scheduled Callback Time</label>
                            <input 
                                type="datetime-local" 
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                                value={cbAt} 
                                onChange={e => setCbAt(e.target.value)} 
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={save} 
                        disabled={saving} 
                        className="flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle size={18} /> Save Update</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
