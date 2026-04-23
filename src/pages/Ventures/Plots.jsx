import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2, BookOpen, FileCheck, PauseCircle, Filter, SlidersHorizontal, MoreVertical, ArrowLeft,
  Search, Plus, Eye, Pencil, Settings, Trash2, LandPlot, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetPlots, useGetPlotById, useDeletePlot, useUpdatePlotStatus, useGetPhases } from "../../hooks/usePlot";
import { useGetAllProjects } from "../../hooks/useProject";
import { useGetUsersNames } from "../../hooks/useUser";
import PlotFormDialog from "../../components/plots/PlotFormDialog";
import PlotStatusDialog from "../../components/plots/PlotStatusDialog";
import PlotBookingDialog from "../../components/plots/PlotBookingDialog";
import PlotRegistrationDialog from "../../components/plots/PlotRegistrationDialog";
import PlotBookingPlanDialog from "../../components/plots/PlotBookingPlanDialog";

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

  /* ── filters ── */
  const [project, setProject] = useState("");
  const [phase, setPhase] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sqrSize, setSqrSize] = useState("");
  const [facing, setFacing] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [associate, setAssociate] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("PROJECTS"); // "PROJECTS" or "PLOTS"
  const pageSize = 40;

  /* ── dialogs ── */
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState("Create");
  const [editId, setEditId] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusPlotId, setStatusPlotId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  const [bookingPlanId, setBookingPlanId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  /* ── data ── */
  const queryParams = {
    page, size: pageSize,
    ...(project && { project }), ...(status && { status }),
    ...(category && { category }), ...(sqrSize && { sqrSize }),
    ...(facing && { facing }), ...(phase && { phases: phase }),
    ...(plotNumber && { plotNumber }),
    ...(associate && { associateId: associate }),
  };
  const { data: plotsData, isLoading, refetch } = useGetPlots(queryParams);
  const { data: projectsData } = useGetAllProjects();
  const { data: phasesData } = useGetPhases(project);
  const { data: usersData } = useGetUsersNames();
  const { data: plotDetail } = useGetPlotById(editId);
  const deleteMutation = useDeletePlot();
  const statusMutation = useUpdatePlotStatus();

  const plots = plotsData?.items || [];
  const totalPlots = plotsData?.total || 0;
  const totalPages = Math.ceil(totalPlots / pageSize);
  const projectsList = projectsData?.items || [];
  const phasesList = phasesData?.phase || [];

  useEffect(() => { setPage(0); }, [project, status, category, sqrSize, facing, phase, plotNumber, associate]);

  const hasFilters = project || phase || status || category || sqrSize || facing || plotNumber || associate;
  const activeFilterCount = [project, phase, status, category, sqrSize, facing, plotNumber, associate].filter(Boolean).length;

  /* ── handlers ── */
  const clearAll = () => {
    setProject(""); setPhase(""); setStatus(""); setCategory("");
    setSqrSize(""); setFacing(""); setPlotNumber(""); setAssociate(""); setPage(0);
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

  /* ── status pill tabs ── */
  const statusTabs = [
    { key: "", label: "All" },
    { key: "AVAILABLE", label: "Available" },
    { key: "BOOKED", label: "Booked" },
    { key: "REGISTERED", label: "Registered" },
    { key: "HOLD", label: "Hold" },
  ];

  return (
    <div className="p-6 space-y-6">
      
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex items-center justify-between">
        <div>
          {viewMode === "PLOTS" && (
            <p className="text-sm font-bold text-slate-500 mt-0.5">{totalPlots} plot{totalPlots !== 1 ? "s" : ""} total</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)}
            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border transition-all
              ${showFilters ? "bg-primary-500/10 border-primary-200 text-primary-700" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {viewMode === "PROJECTS" ? (
            <button onClick={() => setViewMode("PLOTS")}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
              Show All Plots Data
            </button>
          ) : (
            <button onClick={() => setViewMode("PROJECTS")}
              className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Projects
            </button>
          )}

          {isAdmin && viewMode === "PLOTS" && (
            <button onClick={openCreate}
              className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-primary-600/25 transition-all active:scale-[0.98]">
              <Plus size={16} /> Add Plot
            </button>
          )}
        </div>
      </div>

      {viewMode === "PROJECTS" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h2 className="text-lg font-bold text-slate-800">Select Project to View Map</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projectsList.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setProject(p.id);
                  setViewMode("PLOTS");
                }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <LandPlot size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary-600 transition-colors">
                      {p.projectName}
                    </h3>
                    <p className="text-sm text-primary-500 font-medium mt-1 group-hover:underline">Click to explore</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ═══════════ STATUS TABS ═══════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statusTabs.map((tab) => (
          <button key={tab.key} onClick={() => setStatus(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${status === tab.key
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700"}`}>
            {tab.key && STATUS_CONFIG[tab.key] && (
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${STATUS_CONFIG[tab.key].dot}`} />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════ FILTER PANEL (Parity with Realgo Old) ═══════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Project</label>
            <select value={project} onChange={(e) => setProject(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50">
              <option value="">Select Project</option>
              {projectsList.map((p) => <option key={p.id} value={p.id}>{p.projectName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Phase</label>
            <select value={phase} onChange={(e) => setPhase(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50">
              <option value="">Select Phase</option>
              {phasesList.map((ph) => <option key={ph.id} value={ph.phaseName}>{ph.phaseName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50">
              <option value="">Select Status</option>
              {statusTabs.filter(t => t.key).map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50">
              <option value="">Select Category</option>
              <option value="premium">Premium</option>
              <option value="executive">Executive</option>
              <option value="commercial">Commercial</option>
              <option value="semicommercial">Semi Commercial</option>
              <option value="vip">VIP</option>
              <option value="villaplots">Villa Plots</option>
              <option value="residential">Residential</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Facing</label>
            <select value={facing} onChange={(e) => setFacing(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50">
              <option value="">Select Facing</option>
              <option value="east">East</option><option value="west">West</option>
              <option value="north">North</option><option value="south">South</option>
              <option value="corner">Corner</option><option value="northeast">NE</option>
              <option value="northwest">NW</option><option value="southeast">SE</option>
              <option value="southwest">SW</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Plot Sizes</label>
            <select value={sqrSize} onChange={(e) => setSqrSize(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50">
              <option value="">Select Size</option>
              <option value="0-150">0 – 150</option><option value="150-200">150 – 200</option>
              <option value="200-300">200 – 300</option><option value="300-500">300 – 500</option>
              <option value="500-1000">500 – 1000</option><option value="1000-">1000+</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Search</label>
            <div className="relative">
              <input placeholder="Search plot number" value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50" />
              <Search className="absolute right-3 top-3 text-slate-300" size={16} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
           <div className="w-64">
             <select value={associate} onChange={(e) => setAssociate(e.target.value)}
               className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50/50">
               <option value="">Select Sold By Name</option>
               {usersData?.data?.items?.map((u) => (
                 <option key={u.id} value={u.id}>{u.username}</option>
               ))}
             </select>
           </div>
           {hasFilters && (
             <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-red-50 transition-all">
               <X size={16} /> Clear All
             </button>
           )}
        </div>
      </div>

      {/* ═══════════ LOADING ═══════════ */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}

      {/* ═══════════ EMPTY ═══════════ */}
      {!isLoading && plots.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <LandPlot size={28} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-600">No plots found</p>
          <p className="text-sm text-slate-400 mt-1">Try changing your filters or add a new plot</p>
        </div>
      )}

      {/* ═══════════ PLOT CARDS GRID ═══════════ */}
      {!isLoading && plots.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {plots.map((item) => {
              const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.HOLD;
              const Icon = cfg.icon;
              return (
                <div key={item.id}
                  className="group bg-white rounded-xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary-200/50 transition-all duration-300 cursor-pointer relative"
                  onClick={() => openView(item.id)}>



                  <div className="p-0 flex flex-col h-full">
                    <div className="p-6 text-center space-y-2 flex-grow">
                      <p className="text-4xl font-black text-slate-800 tracking-tighter">{item.plotNumber}</p>
                      <p className="text-sm font-bold text-slate-500">{item.projectName}</p>
                      <p className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Phase: {item.phases || 1}</p>
                    </div>

                    {/* Card Footer Info */}
                    <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/30">
                      <div className="p-3 text-center border-r border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Facing</p>
                        <p className="text-[11px] font-black text-slate-700 truncate">{toTitleCase(item.facing) || "N/A"}</p>
                      </div>
                      <div className="p-3 text-center border-r border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Size</p>
                        <p className="text-[11px] font-black text-slate-700 truncate">{item.sqrYards} sq yds</p>
                      </div>
                      <div className="p-3 text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Type</p>
                        <p className="text-[11px] font-black text-slate-700 truncate">{toTitleCase(item.plotCategory)}</p>
                      </div>
                    </div>

                    {/* Status Badge at bottom */}
                    <div className={`p-2.5 text-center font-black text-[10px] uppercase tracking-[0.2em] rounded-b-xl flex items-center justify-center gap-2 ${cfg.light} ${cfg.text} border-t border-slate-100`}>
                       <Icon size={14} />
                       {item.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ════ PAGINATION ════ */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}
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
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                        ${page === p ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}>
                      {p + 1}
                    </button>
                  );
                })}
              </div>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
                className="px-5 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all">
                Next →
              </button>
            </div>
          )}
        </>
      )}
        </>
      )}

      {/* ═══════════ DIALOGS ═══════════ */}
      {showForm && (
        <PlotFormDialog isOpen={showForm}
          onClose={() => { setShowForm(false); setEditId(null); refetch(); }}
          action={formAction} plotData={formAction !== "Create" ? plotDetail?.plot : null} projects={projectsList} />
      )}

      {statusDialogOpen && (
        <PlotStatusDialog isOpen={statusDialogOpen}
          onClose={() => { setStatusDialogOpen(false); setStatusPlotId(null); }}
          onStatusChange={handleStatusChange} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Delete Plot?</h3>
              <p className="text-sm text-slate-500 mt-1">This action is permanent and cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingId && (<PlotBookingDialog isOpen={!!bookingId} onClose={() => { setBookingId(null); refetch(); }} plotId={bookingId} />)}
      {registrationId && (<PlotRegistrationDialog isOpen={!!registrationId} onClose={() => { setRegistrationId(null); refetch(); }} plotId={registrationId} />)}
      {bookingPlanId && (<PlotBookingPlanDialog isOpen={!!bookingPlanId} onClose={() => { setBookingPlanId(null); refetch(); }} plotId={bookingPlanId} />)}
    </div>
  );
}
