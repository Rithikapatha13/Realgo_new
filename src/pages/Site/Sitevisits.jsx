import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  Phone,
  Pencil,
  Trash2,
  Filter,
  Camera
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { resolveImageUrl } from '@/utils/common';
import { 
  getSiteVisits, 
  getTodaySiteVisits, 
  deleteSiteVisit 
} from '@/services/siteVisit.service';
import { getUser } from '@/services/auth.service';
import Button from '@/components/Common/Button';
import ModalWrapper from '@/components/Common/ModalWrapper';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import SiteVisitForm from './SiteVisitForm';

export default function Sitevisits() {
  const user = getUser();
  const [siteVisits, setSiteVisits] = useState([]);
  const [todayVisits, setTodayVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [allRes, todayRes] = await Promise.all([
        getSiteVisits({ search: searchTerm, userId: user?.role_name === 'associate' ? user.id : undefined }),
        getTodaySiteVisits(user?.role_name === 'associate' ? user.id : undefined)
      ]);
      setSiteVisits(allRes.items || []);
      setTodayVisits(todayRes.items || []);
    } catch (err) {
      toast.error("Failed to fetch site visits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [searchTerm]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteSiteVisit(itemToDelete.id);
      toast.success("Site visit deleted successfully");
      fetchAllData();
    } catch (err) {
      toast.error("Failed to delete site visit");
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-2">
      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search customer or phone..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TODAY'S VISITS (Minimal Style) */}
      {todayVisits.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Today's Scheduled Visits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayVisits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onEdit={() => openEditModal(visit)}
                onDelete={() => {
                  setItemToDelete(visit);
                  setIsDeleteModalOpen(true);
                }}
                isToday
              />
            ))}
          </div>
        </section>
      )}

      {/* ALL VISITS */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            All Site Visits
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : siteVisits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300 space-y-2">
            <MapPin size={40} strokeWidth={1.5} />
            <p className="text-xs font-bold uppercase tracking-widest">No site visits found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {siteVisits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onEdit={() => openEditModal(visit)}
                onDelete={() => {
                  setItemToDelete(visit);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* MODALS */}
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Site Visit" : "Add Site Visit"}
        width="max-w-2xl"
      >
        <SiteVisitForm
          item={editingItem}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchAllData();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </ModalWrapper>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Site Visit"
        message={`Are you sure you want to delete the site visit for ${itemToDelete?.leadName}? This action cannot be undone.`}
      />
    </div>
  );
}

function VisitCard({ visit, onEdit, onDelete, isToday }) {
  return (
    <div className={`group bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative overflow-hidden flex flex-col`}>
      {/* Verification Image Preview */}
      {visit.siteVisitPicture && (
        <div className="h-32 w-full overflow-hidden relative">
          <img 
            src={resolveImageUrl(visit.siteVisitPicture)} 
            alt="Site Visit" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-3 text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
            <Camera size={10} /> Verified Visit
          </div>
        </div>
      )}

      <div className="p-3 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isToday ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
            <User size={16} />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-rose-50 rounded-md text-rose-600 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 line-clamp-1">{visit.leadName}</h3>
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
            <Phone size={12} className="text-slate-400" />
            {visit.phone}
          </div>
          {visit.project && (
             <div className="flex items-center gap-2 text-primary-600 text-[10px] font-black uppercase tracking-tighter mt-1">
               <MapPin size={10} /> {visit.project.projectName}
             </div>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-bold">
            <Calendar size={10} className="text-primary-600" />
            {format(new Date(visit.date), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Clock size={10} />
            {visit.time}
          </div>
        </div>
      </div>
    </div>
  );
}
