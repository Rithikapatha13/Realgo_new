import React from 'react';

export default function StatCard({ label, value, gradient, icon, onClick }) {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary-500/30 hover:shadow-xl group" 
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: gradient }} />
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-black tracking-tight text-slate-900">{value ?? '—'}</div>
      <div className="absolute right-4 bottom-4 text-slate-200 group-hover:text-primary-200 transition-colors">
        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
      </div>
    </div>
  );
}
