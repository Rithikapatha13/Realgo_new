import React, { useState, useEffect } from "react";
import { X, Phone, Calendar, ClipboardList, Download, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { getLeadHistory } from "@/services/crm.service";

export default function HistoryModal({ leadId, onClose }) {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (leadId) fetchHistory();
  }, [leadId]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getLeadHistory(leadId);
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch lead history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!history) return;
    const { lead, calls, meetings } = history;
    const escapeCSV = (str) => `"${(str || '').replace(/"/g, '""')}"`;
    const rows = [
      ["Type", "Date & Time", "User", "Outcome", "Notes"],
      ...calls.map(c => ["Call", format(new Date(c.createdAt), "yyyy-MM-dd HH:mm:ss"), c.telecaller?.name || 'Unassigned', c.status, c.notes]),
      ...meetings.map(m => ["Meeting", m.meetingDate ? format(new Date(m.meetingDate), "yyyy-MM-dd HH:mm:ss") : '—', m.associate?.name || 'Unassigned', m.outcome, m.notes])
    ];

    const csvContent = rows.map(r => r.map(escapeCSV).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `History_${lead.name.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999]">
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Loading Timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-none">Activity Timeline</h2>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">{history?.lead?.name} • {history?.lead?.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <button
               onClick={handleExportCSV}
               className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download size={14} /> Export CSV
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 bg-white font-inter">
          <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-12 pb-4">
            
            {[...(history?.calls || []).map(c => ({...c, type: 'call'})), ...(history?.meetings || []).map(m => ({...m, type: 'meeting'}))]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((item) => (
               <div key={item.id} className="relative">
                 {/* DOT */}
                 <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                        item.type === 'meeting' ? 'bg-emerald-500' :
                        item.status === 'HOT' ? 'bg-orange-500' :
                        item.status === 'WARM' ? 'bg-amber-400' :
                        item.status === 'COLD' ? 'bg-blue-400' :
                        'bg-slate-400'
                    }`} />
                 </div>

                 <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             {item.type === 'meeting' ? <Calendar size={14} className="text-slate-400" /> : <Phone size={14} className="text-slate-400" />}
                             <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                {item.type === 'meeting' ? 'Meeting Logged' : 'Interaction Logged'}
                             </span>
                         </div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded">
                            {format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}
                         </span>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                                <User size={12} className="text-primary-600" />
                                {item.type === 'meeting' ? (item.associate?.name || 'Associate') : 
                                 (item.dedicatedTC?.firstName || item.adminTC?.firstName || item.telecaller?.firstName || 'System')}
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] border shadow-sm uppercase tracking-widest ${
                                item.type === 'meeting' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                item.status === 'HOT' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                item.status === 'WARM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                                {item.type === 'meeting' ? item.outcome : item.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                            "{item.notes || (item.type === 'meeting' ? "Meeting outcome recorded." : "No discussion notes recorded.")}"
                        </p>
                    </div>
                 </div>
               </div>
            ))}

            {(!history?.calls || history.calls.length === 0) && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <Clock size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No activity history found.</p>
                </div>
            )}

            {/* INITIAL CREATION */}
            <div className="relative pt-4">
                 <div className="absolute -left-[41px] top-5 w-5 h-5 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                 </div>
                 <div className="flex flex-col gap-1 pl-1">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lead Created</p>
                    <p className="text-[11px] text-slate-400">Initial record added to the CRM pipeline.</p>
                 </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end">
            <button onClick={onClose} className="px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-xl shadow-slate-200">
                Close Timeline
            </button>
        </div>
      </div>
    </div>
  );
}
