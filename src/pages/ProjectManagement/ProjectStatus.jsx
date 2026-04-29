import React, { useState } from "react";
import { 
  Activity, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { 
  useGetProjectStatuses, 
  useDeleteProjectStatus 
} from "../../hooks/useProjectStatus";
import ProjectStatusForm from "./ProjectStatusForm";
import ModalWrapper from "../../components/Common/ModalWrapper";
import { resolveImageUrl } from "../../utils/common";
import Button from "@/components/Common/Button";

export default function ProjectStatus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: statusesData, isLoading } = useGetProjectStatuses();
  const deleteMutation = useDeleteProjectStatus();

  const statuses = statusesData?.items || [];
  const filteredStatuses = statuses.filter(s => 
    s.statusName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingStatus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (status) => {
    setEditingStatus(status);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project status? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-slate-50/30 min-h-screen animate-in fade-in duration-500">
      
      {/* HEADER & ACTION AREA - Neat & Professional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-[0.1em] rounded">System Config</span>
             <ChevronRight size={10} className="text-slate-300" />
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Lifecycle Master</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Project <span className="text-primary-600">Status</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-lg mt-1">
            Define development milestones for consistent project tracking across the platform.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          variant="primary"
          className="shadow-xl shadow-primary-500/10 group px-6"
          icon={<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />}
        >
          New Stage
        </Button>
      </div>

      {/* SEARCH & STATS BAR - Streamlined like Leads page */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-sm">
         <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter stages by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
         </div>
         
         <div className="flex items-center gap-6 px-4 border-l border-slate-100 hidden md:flex">
            <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Sync Active</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total defined</span>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{statuses.length} Stages</span>
                </div>
                <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
                    <Activity size={18} />
                </div>
            </div>
         </div>
      </div>

      {/* CARD GRID - Refined & Decent Sizes */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-56 bg-white/60 rounded-3xl border border-white animate-pulse"></div>
          ))}
        </div>
      ) : filteredStatuses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredStatuses.map((status) => (
            <div
              key={status.id}
              className="group relative bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Subtle Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-50 group-hover:bg-primary-500 transition-colors duration-500" />
              
              {/* Compact Icon Container */}
              <div className="relative mb-5 mt-2">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:bg-primary-50 group-hover:border-primary-100 transition-all duration-500 shadow-inner">
                  {status.statusIcon ? (
                    <img 
                      src={resolveImageUrl(status.statusIcon)} 
                      alt="" 
                      className="w-full h-full object-cover p-3 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-200 group-hover:text-primary-300" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-slate-50 text-emerald-500">
                    <CheckCircle2 size={14} />
                </div>
              </div>

              {/* Status Info */}
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors">
                  {status.statusName}
                </h3>
                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-bold uppercase tracking-[0.1em] rounded">
                    Venture Stage
                </span>
              </div>

              {/* Discreet Action Floating Bar */}
              <div className="mt-6 pt-5 border-t border-slate-50 w-full flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                 <button
                  onClick={() => handleEdit(status)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all font-bold text-[10px] uppercase tracking-wider"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(status.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all rounded-xl"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Background Glass Accent */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-500/5 blur-2xl rounded-full group-hover:bg-primary-500/10 transition-all duration-700" />
            </div>
          ))}

          {/* ADD NEW STAGE CARD - Decent & Integrated */}
          <button 
             onClick={handleCreate}
             className="group border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-primary-200 hover:bg-primary-50/20 transition-all cursor-pointer min-h-[220px]"
          >
             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all group-hover:text-primary-500 shadow-inner group-hover:shadow-sm">
                <Plus size={24} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary-600 transition-colors">Add New Stage</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 mx-2">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 text-slate-200">
            <Layers size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Empty Pipeline</h3>
          <p className="text-sm text-slate-500 font-medium text-center max-w-sm px-6">
             No development stages defined yet. These stages help track the lifecycle of your real estate ventures.
          </p>
          <Button
            onClick={handleCreate}
            variant="primary"
            className="mt-8 px-8 py-3"
            icon={<Plus size={18} />}
          >
            Create First Stage
          </Button>
        </div>
      )}

      {/* REFINED MODAL WRAPPER */}
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStatus ? "Update Stage" : "New Lifecycle Stage"}
        width="max-w-xl"
      >
        <div className="px-2 pb-2">
            <ProjectStatusForm 
                status={editingStatus} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
      </ModalWrapper>

    </div>
  );
}
