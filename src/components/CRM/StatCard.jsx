import React, { useState } from 'react';
import { X, Download, Filter, MessageSquare, Phone } from 'lucide-react';
import { getLeads } from "@/services/crm.service";
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function StatCard({ label, value, gradient, icon, filterType, onClick }) {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function fetchLeads(f, t) {
    setIsLoading(true);
    try {
      const params = { status: filterType || 'ALL' };
      if (f) params.fromDate = f;
      if (t) params.toDate = t;
      
      const res = await getLeads(params);
      setLeads(res.leads || []);
    } catch (error) {
      toast.error('Failed to load leads list');
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpen = () => {
    if (onClick) {
      onClick();
      return;
    }
    setOpen(true);
    fetchLeads('', '');
  };

  const downloadCSV = () => {
    if (!leads.length) {
      toast.error('No leads available to download');
      return;
    }
    const headers = ['sl.no', 'Name', 'Phone', 'Source', 'Status', 'Date Added'];
    const rows = leads.map((l, i) => [
      i + 1,
      l.leadName,
      l.leadContact,
      l.leadSource,
      l.leadStatus || 'NEW',
      l.createdAt ? format(new Date(l.createdAt), 'dd MMM yyyy') : '--'
    ].map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${filterType || 'all'}_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
    toast.success(`${leads.length} leads exported!`);
  };

  return (
    <>
      <div 
        className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary-500/30 hover:shadow-xl group shadow-sm" 
        onClick={handleOpen}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: gradient }} />
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">{label}</div>
        <div className="text-2xl font-black tracking-tight text-slate-900">{value ?? '—'}</div>
        <div className="absolute right-4 bottom-4 text-slate-300 group-hover:text-primary-500/30 transition-colors">
          {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div className="absolute bottom-2 right-4 text-[8px] text-slate-400 font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all uppercase">Detail ↗</div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4" onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white text-slate-900">
              <div>
                <h2 className="text-xl font-black">{label} Results</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">List of leads currently in {label}</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[300px] flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">From Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" 
                    value={from} 
                    onChange={e => setFrom(e.target.value)} 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">To Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" 
                    value={to} 
                    onChange={e => setTo(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => fetchLeads(from, to)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Filter size={14} /> Filter
                </button>
                <button 
                  onClick={() => { setFrom(''); setTo(''); fetchLeads('', ''); }}
                  className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Clear
                </button>
              </div>

              <div className="ml-auto">
                <button 
                  onClick={downloadCSV}
                  className="px-6 py-2 border border-emerald-500/30 text-emerald-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto custom-scrollbar p-0 bg-white">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fetching lead records...</p>
                </div>
              ) : leads.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">
                    <tr>
                      <th className="px-6 py-4 text-slate-600">Lead Name</th>
                      <th className="px-6 py-4 text-slate-600">Contact</th>
                      <th className="px-6 py-4 text-slate-600">Source</th>
                      <th className="px-6 py-4 text-slate-600">Status</th>
                      <th className="px-6 py-4 text-slate-600">Created</th>
                      <th className="px-6 py-4 text-center text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{l.leadName}</td>
                        <td className="px-6 py-4 font-mono text-slate-500 text-xs">{l.leadContact}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                            {l.leadSource}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            l.leadStatus === 'HOT' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            l.leadStatus === 'WARM' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {l.leadStatus || 'NEW'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">{l.createdAt ? format(new Date(l.createdAt), 'dd/MM/yyyy') : '--'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                             <a 
                               href={`https://wa.me/91${l.leadContact.replace(/\D/g, '')}`} 
                               target="_blank" 
                               rel="noreferrer"
                               className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                             >
                               <MessageSquare size={14} />
                             </a>
                             <a 
                               href={`tel:${l.leadContact}`}
                               className="p-2 bg-primary-500/10 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
                             >
                               <Phone size={14} />
                             </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-600">
                  <div className="text-5xl mb-6 grayscale opacity-20">📁</div>
                  <p className="font-black uppercase tracking-widest text-xs">No lead records found for this period</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Showing {leads.length} result{leads.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
