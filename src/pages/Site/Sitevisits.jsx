import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  Phone,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Filter,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  getSiteVisits, 
  getTodaySiteVisits, 
  deleteSiteVisit 
} from '@/services/siteVisit.service';
import { getUser } from '@/services/auth.service';
import Button from '@/components/Common/Button';
import FormInput from '@/components/Common/FormInput';
import ModalWrapper from '@/components/Common/ModalWrapper';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import SiteVisitForm from './SiteVisitForm';

export default function Sitevisits() {
  const user = getUser();
  const navigate = useNavigate();
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

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <MapPin className="text-primary-500" />
            Site Visits
          </h1>
          <p className="text-slate-500 text-sm font-medium">Track and manage customer site visits</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200"
          icon={<Plus size={18} />}
        >
          New Site Visit
        </Button>
      </div>

      {/* TODAY'S VISITS SECTION */}
      {todayVisits.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Today's Visits
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

      {/* MAIN LIST SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search customer or phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" icon={<Filter size={16} />} className="text-slate-600">Filters</Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : siteVisits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <MapPin size={48} strokeWidth={1} />
            <p className="font-medium text-lg">No site visits found</p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    <div className={`group bg-white rounded-3xl p-5 border shadow-sm transition-all hover:shadow-md hover:border-primary-100 relative overflow-hidden ${isToday ? 'border-emerald-100' : 'border-slate-100'}`}>
      {isToday && (
        <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-emerald-500/10 rounded-full" />
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
          <User size={24} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
            <Pencil size={16} />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{visit.leadName}</h3>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Phone size={14} className="text-slate-400" />
          {visit.phone}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-bold">
          <Calendar size={12} className="text-primary-500" />
          {format(new Date(visit.date), 'MMM dd, yyyy')}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <Clock size={12} />
          {visit.time}
        </div>
      </div>
    </div>
  );
}
