import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Flame, Thermometer, Handshake, DollarSign, Inbox, Snowflake, Clock, Activity, TrendingUp, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { getStats, getActivities } from "@/services/crm.service";
import { formatDistanceToNow } from "date-fns";

export default function CRMDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, actRes] = await Promise.all([
        getStats(),
        getActivities()
      ]);
      setStats(statsRes.stats);
      setActivities(actRes.activities);
    } catch (error) {
      console.error("Dashboard load error", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">CRM Executive Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time performance metrics and pipeline health.</p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.total || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hot Leads</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.hot || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Handshake size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site Visits</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.sitevisits || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.booked || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* PIPELINE OVERVIEW */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="text-primary-600" size={20} /> Pipeline Funnel
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'NEW', count: stats?.new, color: 'bg-slate-100 text-slate-700' },
              { label: 'WARM', count: stats?.warm, color: 'bg-amber-100 text-amber-700' },
              { label: 'HOT', count: stats?.hot, color: 'bg-orange-100 text-orange-700' },
              { label: 'COLD', count: stats?.cold, color: 'bg-blue-100 text-blue-700' },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-xl p-4 flex flex-col items-center justify-center gap-1`}>
                <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
                <span className="text-xl font-bold">{s.count || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="text-primary-600" size={20} /> Live Stream
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {activities.map((act) => (
              <div key={act.id} className="relative pl-4 border-l-2 border-slate-100 last:border-0 pb-4">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: act.color }} />
                <p className="text-xs text-slate-700 leading-snug" dangerouslySetInnerHTML={{ __html: act.text }} />
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                  {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-10 italic">No recent activity detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* RANKINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary-600" size={20} /> Telecaller Rankings
          </h2>
          <div className="space-y-3">
            {stats?.rankings?.telecallers?.map((u, idx) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold text-primary-600">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.score} Conversions</p>
                </div>
              </div>
            ))}
            {(!stats?.rankings?.telecallers || stats?.rankings?.telecallers.length === 0) && (
              <p className="text-center text-slate-400 text-xs py-4">No rankings available yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="font-bold text-slate-800">Need more insights?</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-[250px]">
            Detailed conversion reports are available in the Reports section for deep-dive analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
