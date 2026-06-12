import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Eye, Pencil, Trash2,
  Settings, LandPlot, CalendarDays, X,
  CheckCircle2, BookOpen, FileCheck, PauseCircle, Filter, SlidersHorizontal, MoreVertical,
  LayoutGrid, Map as MapIcon, ChevronRight, ChevronDown, Building2, MapPin, Sparkles, Layers,
  Check, ChevronLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetPlots, useGetPlotById, useDeletePlot, useUpdatePlotStatus, useGetPhases } from "../../hooks/usePlot";
import { useGetAllProjects } from "../../hooks/useProject";
import { useGetUsersNames } from "../../hooks/useUser";
import PlotFormDialog from "../../components/plots/PlotFormDialog";
import PlotStatusDialog from "../../components/plots/PlotStatusDialog";
import PlotBookingDialog from "../../components/plots/PlotBookingDialog";
import PlotRegistrationDialog from "../../components/plots/PlotRegistrationDialog";
import PlotBookingPlanDialog from "../../components/plots/PlotBookingPlanDialog";
import PlotBulkDialog from "../../components/plots/PlotBulkDialog";
import PlotBookingRequestDialog from "../../components/plots/PlotBookingRequestDialog";

/* ── Colour map ── */
const STATUS_CONFIG = {
  AVAILABLE: { bg: "from-emerald-500 to-green-600", dot: "bg-emerald-400", text: "text-emerald-700", light: "bg-emerald-50", icon: CheckCircle2 },
  BOOKED: { bg: "from-amber-500 to-yellow-500", dot: "bg-amber-400", text: "text-amber-700", light: "bg-amber-50", icon: BookOpen },
  REGISTERED: { bg: "from-rose-500 to-pink-600", dot: "bg-rose-400", text: "text-rose-700", light: "bg-rose-50", icon: FileCheck },
  HOLD: { bg: "from-slate-400 to-slate-500", dot: "bg-slate-400", text: "text-slate-700", light: "bg-slate-100", icon: PauseCircle },
};

const toTitleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "—");

export default function Plots() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = ["admin", "accounts", "superadmin", "pro"].includes(
    user.role?.roleName?.toLowerCase() ||
    user.roleName?.toLowerCase() ||
    user.role?.toLowerCase() ||
    user.userType?.toLowerCase()
  );

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  /* ── View State ── */
  const [viewMode, setViewMode] = useState("projects"); // "projects", "grid"
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  /* ── filters ── */
  const [project, setProject] = useState("");
  const [phase, setPhase] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sqrSize, setSqrSize] = useState("");
  const [facing, setFacing] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [soldBy, setSoldBy] = useState("");
  const [page, setPage] = useState(1);
  const [soldByDropdownOpen, setSoldByDropdownOpen] = useState(false);
  const [soldBySearch, setSoldBySearch] = useState("");
  const pageSize = 40;

  /* ── dialogs ── */
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [formAction, setFormAction] = useState("Create");
  const [editId, setEditId] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusPlotId, setStatusPlotId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  const [bookingPlanId, setBookingPlanId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bookingRequestPlot, setBookingRequestPlot] = useState(null);

  /* ── data ── */
  const queryParams = {
    page: page - 1, size: pageSize,
    ...(project && { project }), ...(status && { status }),
    ...(category && { category }), ...(sqrSize && { sqrSize }),
    ...(facing && { facing }), ...(phase && { phases: phase }),
    ...(plotNumber && { plotNumber }),
    ...(soldBy && { soldBy }),
  };
  const { data: plotsData, isLoading, refetch } = useGetPlots(queryParams);
  const { data: projectsData, isLoading: projectsLoading } = useGetAllProjects();
  const { data: phasesData } = useGetPhases(project || selectedProjectId);
  const { data: plotDetail } = useGetPlotById(editId);
  const deleteMutation = useDeletePlot();
  const statusMutation = useUpdatePlotStatus();

  const { data: associatesData, isLoading: associatesLoading, error: associatesError } = useGetUsersNames({ 
    role: "Associate", 
    search: soldBySearch.trim() || undefined 
  });

  const associatesList = useMemo(() => {
    if (!associatesData) return [];
    if (associatesData.data?.items) return associatesData.data.items;
    if (associatesData.items) return associatesData.items;
    if (Array.isArray(associatesData)) return associatesData;
    return [];
  }, [associatesData]);

  const plots = plotsData?.items || [];
  const totalPlots = plotsData?.total || 0;
  const totalPages = Math.ceil(totalPlots / pageSize);
  const projectsList = projectsData?.items || [];
  const phasesList = phasesData?.phase || [];

  useEffect(() => { setPage(1); }, [project, status, category, sqrSize, facing, phase, plotNumber, soldBy]);

  const hasFilters = project || phase || status || category || sqrSize || facing || plotNumber || soldBy;
  const activeFilterCount = [project, phase, status, category, sqrSize, facing, plotNumber, soldBy].filter(Boolean).length;

  /* ── handlers ── */
  const clearAll = () => {
    setProject(""); setPhase(""); setStatus(""); setCategory("");
    setSqrSize(""); setFacing(""); setPlotNumber(""); setSoldBy(""); setPage(1);
  };
  const openCreate = () => { setEditId(null); setFormAction("Create"); setShowForm(true); };
  const openEdit = (id) => { setEditId(id); setFormAction("Update"); setShowForm(true); };
  const openView = (id) => { setEditId(id); setFormAction("View"); setShowForm(true); };

  const handleDelete = async () => {
    try { await deleteMutation.mutateAsync(deleteConfirm); toast.success("Plot deleted"); setDeleteConfirm(null); }
    catch { toast.error("Failed to delete"); }
  };
  const handleStatusChange = async (s, r) => {
    try { await statusMutation.mutateAsync({ id: statusPlotId, status: s, reasonForRejection: r }); toast.success("Status updated"); setStatusDialogOpen(false); }
    catch { toast.error("Failed to update status"); }
  };

  const handleProjectClick = (id) => {
    navigate(`/plots/map/${id}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#fdfdfd] min-h-screen overflow-x-hidden">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Venture <span className="text-[#1e1e62]">Plots</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {viewMode === "projects" ? "Select a project to view its interactive layout map."
              : `Browsing ${totalPlots} Plots Data`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {viewMode === "projects" ? (
            <button
              onClick={() => { setViewMode("grid"); setProject(""); }}
              className="bg-[#1e1e62] hover:bg-[#2e2e8a] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <LayoutGrid size={18} />
              Show Plots Data
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {isAdmin && (
                <>
                  <button
                    onClick={() => { setFormAction("Create"); setEditId(null); setShowForm(true); }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs md:text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Plot
                  </button>
                  <button
                    onClick={() => setShowBulkForm(true)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs md:text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Layers size={18} />
                    Bulk Plots
                  </button>
                </>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all active:scale-95 flex items-center gap-2 border ${showFilters ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <SlidersHorizontal size={18} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3.5 py-2 text-xs font-bold transition-all ${
                    viewMode === "grid"
                      ? "bg-[#1e1e62] text-white shadow-inner"
                      : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3.5 py-2 text-xs font-bold transition-all ${
                    viewMode === "table"
                      ? "bg-[#1e1e62] text-white shadow-inner"
                      : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Table
                </button>
              </div>

              <button
                onClick={() => setViewMode("projects")}
                className="bg-white border border-[#1e1e62] text-[#1e1e62] px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2"
              >
                <Building2 size={18} />
                Select Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ VIEW MODES ═══════════ */}

      {/* 1. PROJECT SELECTION VIEW */}
      {viewMode === "projects" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
          {projectsLoading ? (
            <div className="flex justify-center py-32">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1e1e62] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {projectsList.map((p) => {
                const hasImage = p.projectImage && p.projectImage.trim() !== "";
                const imageUrl = hasImage 
                  ? (p.projectImage.startsWith("http") ? p.projectImage : `${IMAGE_BASE_URL}/${p.projectImage}`)
                  : null;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleProjectClick(p.id)}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                  >
                    {/* Top banner / Image */}
                    <div className="h-40 w-full bg-gradient-to-tr from-[#1e1e62] to-[#2e2e8a] relative overflow-hidden shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={p.projectName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">
                          <Building2 size={80} className="text-white" />
                        </div>
                      )}
                      
                      {/* Floating status tag */}
                      {p.projectStatus?.statusName && (
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#1e1e62] px-3 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase shadow-sm">
                          {p.projectStatus.statusName}
                        </span>
                      )}

                      {/* Available plots tag */}
                      <span className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {p.availablePlots} Plots Available
                      </span>
                    </div>

                    {/* Content area */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-white">
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-slate-800 tracking-tight transition-colors line-clamp-1">
                          {p.projectName}
                        </h3>
                        {p.projectAddress && (
                          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 line-clamp-1 leading-relaxed">
                            <MapPin size={12} className="shrink-0 text-slate-400" />
                            {p.projectAddress}
                          </p>
                        )}
                      </div>

                      {/* Action text */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1e1e62] uppercase tracking-wider">
                        <span>Explore Venture Map</span>
                        <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. MASTER GRID VIEW */}
      {(viewMode === "grid" || viewMode === "table") && (
        <>
          {/* Permanent Search Bar */}
          <div className="mb-4">
             <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  placeholder="Quick search by plot number..." 
                  value={plotNumber} 
                  onChange={(e) => setPlotNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm md:text-base font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all shadow-sm group-hover:border-slate-300" 
                />
             </div>
          </div>

          {/* Collapsible Filters Grid */}
          {showFilters && (
            <div className="mb-8 p-4 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-md animate-in slide-in-from-top-4 fade-in duration-300">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Project</label>
                    <select value={project} onChange={(e) => setProject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium appearance-none">
                      <option value="">All Projects</option>
                      {projectsList.map((p) => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 bottom-3 text-slate-400 pointer-events-none" size={14} />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Phase</label>
                    <select value={phase} onChange={(e) => setPhase(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium appearance-none">
                      <option value="">All Phases</option>
                      {phasesList.map((ph) => <option key={ph.id} value={ph.phaseName}>{ph.phaseName}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 bottom-3 text-slate-400 pointer-events-none" size={14} />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium appearance-none">
                      <option value="">All Status</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="BOOKED">Booked</option>
                      <option value="REGISTERED">Registered</option>
                      <option value="HOLD">Hold</option>
                    </select>
                    <ChevronDown className="absolute right-3 bottom-3 text-slate-400 pointer-events-none" size={14} />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium appearance-none">
                      <option value="">All Categories</option>
                      <option value="premium">Premium</option><option value="executive">Executive</option>
                      <option value="commercial">Commercial</option><option value="semicommercial">Semi Commercial</option>
                      <option value="vip">VIP</option><option value="villaplots">Villa Plots</option>
                      <option value="residential">Residential</option>
                    </select>
                    <ChevronDown className="absolute right-3 bottom-3 text-slate-400 pointer-events-none" size={14} />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Facing</label>
                    <select value={facing} onChange={(e) => setFacing(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium appearance-none">
                      <option value="">All Facing</option>
                      <option value="east">East</option><option value="west">West</option>
                      <option value="north">North</option><option value="south">South</option>
                      <option value="corner">Corner</option>
                    </select>
                    <ChevronDown className="absolute right-3 bottom-3 text-slate-400 pointer-events-none" size={14} />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Plot Size</label>
                    <select value={sqrSize} onChange={(e) => setSqrSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium appearance-none">
                      <option value="">All Sizes</option>
                      <option value="0-150">0 – 150</option><option value="150-200">150 – 200</option>
                      <option value="200-300">200 – 300</option><option value="1000-">1000+</option>
                    </select>
                    <ChevronDown className="absolute right-3 bottom-3 text-slate-400 pointer-events-none" size={14} />
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                   <div className="relative flex-1 w-full max-w-sm">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Sold By (Associate)</label>
                      <div 
                        onClick={() => setSoldByDropdownOpen(!soldByDropdownOpen)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium flex items-center justify-between cursor-pointer text-slate-700"
                      >
                        <span className="truncate">
                          {soldBy ? (associatesList.find(a => a.id === soldBy)?.username || soldBy) : (
                            <span className="text-slate-400">Select associate...</span>
                          )}
                        </span>
                        <ChevronDown className="text-slate-400" size={14} />
                      </div>
                      {soldByDropdownOpen && (
                        <div className="absolute top-full left-0 z-[100] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 flex flex-col animate-in fade-in zoom-in-95 duration-150 origin-top">
                          <div className="px-3 pb-2 border-b border-slate-50 relative">
                            <Search className="absolute left-6 top-2.5 text-slate-400" size={12} />
                            <input type="text" placeholder="Search associate..." value={soldBySearch}
                              onChange={(e) => setSoldBySearch(e.target.value)}
                              className="w-full bg-slate-50 border-none rounded-lg pl-8 pr-4 py-2 text-[11px] font-medium outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto px-1 pt-1 scrollbar-thin">
                            <div className="px-4 py-2 text-xs font-bold hover:bg-slate-50 cursor-pointer flex items-center justify-between rounded-lg"
                              onClick={() => { setSoldBy(""); setSoldByDropdownOpen(false); }}>
                              <span className={soldBy === "" ? "text-slate-900" : "text-slate-600"}>All Associates</span>
                            </div>
                            {associatesLoading ? <div className="text-center py-4"><div className="w-4 h-4 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin inline-block" /></div>
                            : associatesList.map((a) => (
                              <div key={a.id} className="px-4 py-2 text-xs font-bold hover:bg-slate-50 cursor-pointer flex items-center justify-between rounded-lg"
                                onClick={() => { setSoldBy(a.id); setSoldByDropdownOpen(false); }}>
                                <span className={soldBy === a.id ? "text-slate-900 truncate" : "text-slate-600 truncate"}>{a.username}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                   </div>
                   {hasFilters && (
                     <button onClick={clearAll} className="px-6 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                       <X size={16} /> Clear All Filters
                     </button>
                   )}
               </div>
            </div>
          )}

          {/* Content area */}
          {isLoading ? (
            <div className="flex justify-center py-32">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1e1e62] rounded-full animate-spin" />
            </div>
          ) : plots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-200">
              <LandPlot size={48} className="text-slate-200 mb-4" />
              <p className="font-bold text-slate-900">No plots found</p>
            </div>
          ) : viewMode === "table" ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plot No</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phase</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Facing</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plots.map((item) => {
                      const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.HOLD;
                      const Icon = cfg.icon;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 text-sm">
                            {item.plotNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                            {item.projectName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                            {item.phases ? `Phase ${item.phases}` : "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                            {item.sqrYards} sq yds
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
                            {toTitleCase(item.facing)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                            {toTitleCase(item.plotCategory)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cfg.light} ${cfg.text}`}>
                              <Icon size={12} />
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!isAdmin && item.status === "AVAILABLE" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBookingRequestPlot(item);
                                  }}
                                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                                >
                                  Request
                                </button>
                              )}

                              {isAdmin && (
                                <div className="relative inline-block text-left">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(openMenuId === item.id ? null : item.id);
                                    }}
                                    className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  {openMenuId === item.id && (
                                    <div className="absolute right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-44 z-[100] py-2 px-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); openView(item.id); }}
                                        className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 text-slate-700 flex items-center gap-3 font-bold rounded-xl transition-all">
                                        <Eye size={14} className="text-slate-400" /> View Details
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); openEdit(item.id); }}
                                        className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all">
                                        <Pencil size={14} /> Edit Details
                                      </button>
                                      
                                      {item.status === "AVAILABLE" && (
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setBookingId(item.id); }}
                                          className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all border-t border-slate-100 pt-2">
                                          <Settings size={14} /> Book Plot
                                        </button>
                                      )}

                                      {item.status === "BOOKED" && (
                                        <>
                                          <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setBookingPlanId(item.id); }}
                                            className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all border-t border-slate-100 pt-2">
                                            <Settings size={14} /> Update Plan
                                          </button>
                                          <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setRegistrationId(item.id); }}
                                            className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all">
                                            <Settings size={14} /> Register Plot
                                          </button>
                                        </>
                                      )}

                                      {item.status !== "AVAILABLE" && (
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setStatusPlotId(item.id); setStatusDialogOpen(true); }}
                                          className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all border-t border-slate-100 pt-2">
                                          <Settings size={14} /> Change Status
                                        </button>
                                      )}

                                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setDeleteConfirm(item.id); }}
                                        className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-red-50 text-red-600 flex items-center gap-3 font-bold rounded-xl transition-all mt-1 border-t border-slate-100 pt-2">
                                        <Trash2 size={14} /> Delete Asset
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plots.map((item) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.HOLD;
                const Icon = cfg.icon;
                return (
                  <div key={item.id}
                    className="group bg-white rounded-xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary-200/50 transition-all duration-300 cursor-pointer relative flex flex-col justify-between h-full"
                    onClick={() => openView(item.id)}>

                    <div className="p-4 flex flex-col justify-between flex-1 h-full min-h-[170px]">
                      <div className="space-y-3 flex-1">
                        {/* Top row: plot number + status */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{item.plotNumber}</p>
                            <p className="text-xs text-slate-400 mt-1 truncate max-w-[160px]" title={item.projectName}>{item.projectName}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {isAdmin && (
                              <div className="relative">
                                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }}
                                  className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center">
                                  <MoreVertical size={20} />
                                </button>
                                {openMenuId === item.id && (
                                  <div className="absolute top-10 right-0 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-44 z-[100] py-2 px-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); openView(item.id); }}
                                      className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 text-slate-700 flex items-center gap-3 font-bold rounded-xl transition-all">
                                      <Eye size={14} className="text-slate-400" /> View Details
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); openEdit(item.id); }}
                                      className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all">
                                      <Pencil size={14} /> Edit Details
                                    </button>
                                    
                                    {item.status === "AVAILABLE" && (
                                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setBookingId(item.id); }}
                                        className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all border-t border-slate-100 pt-2">
                                        <Settings size={14} /> Book Plot
                                      </button>
                                    )}

                                    {item.status === "BOOKED" && (
                                      <>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setBookingPlanId(item.id); }}
                                          className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all border-t border-slate-100 pt-2">
                                          <Settings size={14} /> Update Plan
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setRegistrationId(item.id); }}
                                          className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all">
                                          <Settings size={14} /> Register Plot
                                        </button>
                                      </>
                                    )}

                                    {item.status !== "AVAILABLE" && (
                                      <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setStatusPlotId(item.id); setStatusDialogOpen(true); }}
                                        className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-primary-500/10 text-primary-600 flex items-center gap-3 font-bold rounded-xl transition-all border-t border-slate-100 pt-2">
                                        <Settings size={14} /> Change Status
                                      </button>
                                    )}

                                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setDeleteConfirm(item.id); }}
                                      className="w-full text-left px-3 py-2.5 text-[11px] hover:bg-red-50 text-red-600 flex items-center gap-3 font-bold rounded-xl transition-all mt-1 border-t border-slate-100 pt-2">
                                      <Trash2 size={14} /> Delete Asset
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cfg.light} ${cfg.text}`}>
                              <Icon size={12} />
                              {item.status}
                            </span>
                          </div>
                        </div>

                        {/* Info chips */}
                        <div className="flex flex-wrap gap-1">
                          {item.phases && (
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              Phase {item.phases}
                            </span>
                          )}
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                            {item.sqrYards} sq yds
                          </span>
                          {item.facing && (
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {toTitleCase(item.facing)}
                            </span>
                          )}
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                            {toTitleCase(item.plotCategory)}
                          </span>
                        </div>
                      </div>

                      {/* Request Booking Button or spacer */}
                      <div className="mt-3 shrink-0 flex items-center justify-center min-h-[32px]">
                        {!isAdmin && item.status === "AVAILABLE" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent opening the view modal
                              setBookingRequestPlot(item);
                            }}
                            className="w-fit mx-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            Request Booking
                          </button>
                        ) : (
                          <div className="h-[28px]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ PAGINATION ════ */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="px-5 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all">
                ← Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i;
                  else if (page < 3) p = i;
                  else if (page > totalPages - 4) p = totalPages - 5 + i;
                  else p = page - 2 + i;
                  return (
                    <button key={p} onClick={() => setPage(p + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                        ${page === p + 1 ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}>
                      {p + 1}
                    </button>
                  );
                })}
              </div>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                className="px-5 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all">
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* DIALOGS */}
      {showForm && (
        <PlotFormDialog isOpen={showForm} onClose={() => { setShowForm(false); setEditId(null); refetch(); }}
          action={formAction} plotData={formAction !== "Create" ? plotDetail?.plot : null} projects={projectsList} />
      )}
      {statusDialogOpen && (
        <PlotStatusDialog isOpen={statusDialogOpen} onClose={() => { setStatusDialogOpen(false); setStatusPlotId(null); }}
          onStatusChange={handleStatusChange} />
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[2000] animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl space-y-6 text-center border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto">
               <Trash2 size={28} className="text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Delete Record?</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">This plot will be permanently removed from the database.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 text-slate-600 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
      {bookingId && (<PlotBookingDialog isOpen={!!bookingId} onClose={() => { setBookingId(null); refetch(); }} plotId={bookingId} />)}
      {registrationId && (<PlotRegistrationDialog isOpen={!!registrationId} onClose={() => { setRegistrationId(null); refetch(); }} id={registrationId} />)}
      {showBulkForm && (<PlotBulkDialog isOpen={showBulkForm} onClose={() => setShowBulkForm(false)} projects={projectsList} />)}
      {bookingPlanId && (<PlotBookingPlanDialog isOpen={!!bookingPlanId} onClose={() => { setBookingPlanId(null); refetch(); }} plotId={bookingPlanId} />)}
      {bookingRequestPlot && (
        <PlotBookingRequestDialog
          isOpen={!!bookingRequestPlot}
          onClose={() => { setBookingRequestPlot(null); refetch(); }}
          plot={bookingRequestPlot}
        />
      )}
    </div>
  );
}
