import React, { useState } from 'react';
import { Calendar, MapPin, X, CheckCircle, Phone, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { logMeeting } from '@/services/crm.service';
import { format } from 'date-fns';

export default function MeetModal({ lead, onClose, onSaved }) {
    const [outcome, setOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [meetingDate, setMeetingDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const [interested, setInterested] = useState('');
    const [bookingStatus, setBookingStatus] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [saving, setSaving] = useState(false);

    async function save() {
        if (!outcome) {
            toast.error('Please select a meeting outcome');
            return;
        }
        setSaving(true);
        try {
            await logMeeting(lead.id, {
                outcome,
                notes,
                meetingDate,
                interested,
                bookingStatus,
                followUpDate: followUpDate || null
            });
            toast.success(`Meeting outcome logged: ${outcome}`);
            onSaved();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to log meeting');
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
                        <Calendar size={20} className="text-primary-600" />
                        Log Meeting Outcome
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

                <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto px-1">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Date & Time</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                            value={meetingDate}
                            onChange={e => setMeetingDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Outcome *</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                            value={outcome}
                            onChange={e => {
                                setOutcome(e.target.value);
                                if (e.target.value !== 'SITEVISIT') setInterested('');
                            }}
                        >
                            <option value="">Select Outcome</option>
                            <option value="SITEVISIT">🏢 Site Visit Done</option>
                            <option value="FOLLOWUP">⏳ Follow Up Required</option>
                            <option value="BOOKED">💰 Booked / Paid</option>
                            <option value="COLD">❄️ Gone Cold</option>
                        </select>
                    </div>

                    {outcome === "SITEVISIT" && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interested to Book?</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setInterested('YES')}
                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${interested === 'YES' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-gray-50 border-gray-300 text-slate-500 hover:bg-gray-100'}`}
                                >
                                    Yes, Interested
                                </button>
                                <button
                                    onClick={() => { setInterested('NO'); setBookingStatus(''); }}
                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${interested === 'NO' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-gray-50 border-gray-300 text-slate-500 hover:bg-gray-100'}`}
                                >
                                    No / Maybe
                                </button>
                            </div>
                        </div>
                    )}

                    {interested === "YES" && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Final Booking Status</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                                value={bookingStatus}
                                onChange={e => setBookingStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                <option value="BOOKED">💰 Confirmed Booking</option>
                                <option value="PAYMENT_PENDING">💳 Payment Pending</option>
                            </select>
                        </div>
                    )}

                    {(interested === "NO" || outcome === "FOLLOWUP") && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next Followup Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                                value={followUpDate}
                                onChange={e => setFollowUpDate(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Closing Remarks</label>
                        <textarea
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                            rows={3}
                            placeholder="Detailed notes about the meeting..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
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
                        className="flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-black font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle size={18} /> Save Outcome</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
