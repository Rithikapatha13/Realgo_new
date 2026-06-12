import { useState, useEffect } from "react";
import { X, MapPin, Layout, Loader2, Activity, Plus, Building2, Save } from "lucide-react";
import { Link } from "react-router-dom";
import ModalWrapper from "../../components/Common/ModalWrapper";
import ProjectDetails from "./ProjectDetails";
import { getAllProjectStatuses, getProjects, createProject } from "../../services/project.service";
import toast from "react-hot-toast";

export default function Projects() {
  const [projectStatuses, setProjectStatuses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // View modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    projectAddress: "",
    projectDescription: "",
    projectStatusId: "",
    latitude: "",
    longitude: "",
  });

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => { fetchProjectStatuses(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProjects(), 400);
    return () => clearTimeout(timer);
  }, [selectedStatusId, searchQuery]);

  const fetchProjectStatuses = async () => {
    try {
      const res = await getAllProjectStatuses();
      if (res.success) setProjectStatuses(res.items);
    } catch (e) { console.error(e); }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects({ projectStatusId: selectedStatusId, name: searchQuery });
      if (res.success) setProjects(res.items);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleExplore = (id) => { setSelectedProjectId(id); setIsModalOpen(true); };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.projectName.trim() || !form.projectAddress.trim() || !form.projectStatusId) {
      toast.error("Project name, address and status are required");
      return;
    }
    setCreating(true);
    try {
      const res = await createProject(form);
      if (res.success) {
        toast.success("Project created successfully!");
        setIsCreateOpen(false);
        setForm({ projectName: "", projectAddress: "", projectDescription: "", projectStatusId: "", latitude: "", longitude: "" });
        fetchProjects();
      } else {
        toast.error(res.message || "Failed to create project");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Venture Projects</h1>
            <Link
              to="/project-status"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100/50"
            >
              <Activity className="w-4 h-4" />
              Manage Status
            </Link>
          </div>
          <p className="text-gray-500 font-medium">Explore premium real estate ventures across various project stages.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Layout className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search ventures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>

          {/* NEW PROJECT BUTTON */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all duration-300 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-start gap-5 overflow-x-auto pb-4 hide-scrollbar w-full max-w-full min-w-0">
        <div onClick={() => setSelectedStatusId("")} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[90px]">
          <div className={`w-15 h-15 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${!selectedStatusId ? 'border-primary-600 bg-primary-500/10 scale-105' : 'border-gray-100 bg-white group-hover:border-primary-300'}`}>
            <X className={`w-8 h-8 ${!selectedStatusId ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-400'}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${!selectedStatusId ? 'text-primary-600' : 'text-gray-400'}`}>All</span>
        </div>
        {projectStatuses.map((status) => (
          <div key={status.id} onClick={() => setSelectedStatusId(status.id)} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[90px]">
            <div className={`w-15 h-15 rounded-full overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${selectedStatusId === status.id ? 'border-primary-600 ring-4 ring-primary-500/10 scale-105' : 'border-gray-100 group-hover:border-primary-300'}`}>
              {status.statusIcon
                ? <img src={`${IMAGE_BASE_URL}/${status.statusIcon}`} alt={status.statusName} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300"><Layout className="w-8 h-8" /></div>
              }
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider text-center truncate w-24 ${selectedStatusId === status.id ? 'text-primary-600' : 'text-gray-400'}`}>
              {status.statusName}
            </span>
          </div>
        ))}
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Fetching ventures...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map((project) => (
            <div key={project.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 border border-gray-100 flex flex-col cursor-pointer"
              onClick={() => handleExplore(project.id)}
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={project.projectImage ? `${IMAGE_BASE_URL}/${project.projectImage}` : "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={project.projectName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-black text-gray-800">
                    {project.availablePlots} <span className="font-bold text-gray-400 uppercase text-[10px] ml-1">Plots</span>
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                    {project.projectStatus?.statusName || "Special Project"}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 leading-tight">{project.projectName}</h3>
                <div className="flex items-start gap-2 text-gray-500 mb-6 flex-grow">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary-500" />
                  <p className="text-sm font-medium leading-relaxed line-clamp-2">{project.projectAddress}</p>
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-bold text-green-600">Active Listing</span>
                  <button
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-primary-700 transition-all active:scale-95"
                    onClick={(e) => { e.stopPropagation(); handleExplore(project.id); }}
                  >Explore</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-[40px] border-4 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
            <Layout className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Ventures Found</h3>
          <p className="text-gray-500 font-medium mb-8">No projects yet. Create your first one!</p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all"
          >
            <Plus className="w-4 h-4" /> Create First Project
          </button>
        </div>
      )}

      {/* View Project Modal */}
      <ModalWrapper open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Project Preview" width="max-w-6xl">
        <ProjectDetails projectId={selectedProjectId} onClose={() => setIsModalOpen(false)} />
      </ModalWrapper>

      {/* CREATE PROJECT MODAL */}
      <ModalWrapper isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Project" width="max-w-2xl">
        <form onSubmit={handleCreate} className="p-6 space-y-5">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
            <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">New Venture</p>
              <p className="text-xs text-slate-400">Fill basics now — add images & phases after creation.</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Project Name *</label>
            <input required value={form.projectName}
              onChange={(e) => setForm(p => ({ ...p, projectName: e.target.value }))}
              placeholder="e.g. Realgo Heights Phase 2"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Project Status *</label>
            <select required value={form.projectStatusId}
              onChange={(e) => setForm(p => ({ ...p, projectStatusId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium text-sm bg-white"
            >
              <option value="">Select a status...</option>
              {projectStatuses.map(s => <option key={s.id} value={s.id}>{s.statusName}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Site Address *</label>
            <textarea required rows={2} value={form.projectAddress}
              onChange={(e) => setForm(p => ({ ...p, projectAddress: e.target.value }))}
              placeholder="Full site address..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
            <textarea rows={2} value={form.projectDescription}
              onChange={(e) => setForm(p => ({ ...p, projectDescription: e.target.value }))}
              placeholder="Brief project description..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Latitude</label>
              <input value={form.latitude} onChange={(e) => setForm(p => ({ ...p, latitude: e.target.value }))}
                placeholder="e.g. 17.3850"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Longitude</label>
              <input value={form.longitude} onChange={(e) => setForm(p => ({ ...p, longitude: e.target.value }))}
                placeholder="e.g. 78.4867"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsCreateOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
            >Cancel</button>
            <button type="submit" disabled={creating}
              className="flex items-center gap-2 bg-primary-600 text-white px-8 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-primary-700 transition-all disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
}
