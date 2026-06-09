import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  X, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  MessageSquare,
  Building,
  HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  getFollowups, 
  getTodaysFollowups, 
  addFollowup, 
  updateFollowup, 
  updateFollowupStatus, 
  deleteFollowup 
} from "../../services/followup.service";
import { getProjects } from "../../services/project.service";
import { format, parseISO } from "date-fns";
import Button from "@/components/Common/Button";
import ModalWrapper from "@/components/Common/ModalWrapper";

export default function Followup() {
  const [followups, setFollowups] = useState([]);
  const [todaysFollowups, setTodaysFollowups] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: "",
    lead_name: "",
    phone: "",
    email: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    followup_type: "Call",
    project: "",
    priority: "MEDIUM",
    comments: ""
  });

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const filters = {
        name: searchQuery,
        status: statusFilter,
        followup_type: typeFilter,
        priority: priorityFilter
      };
      const [res, todayRes, projectsRes] = await Promise.all([
        getFollowups(filters),
        getTodaysFollowups(),
        getProjects()
      ]);
      setFollowups(res.items || []);
      setTodaysFollowups(todayRes.followupToday || []);
      setProjects(projectsRes.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load follow-up schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, [searchQuery, statusFilter, priorityFilter, typeFilter]);

  const handleOpenCreate = () => {
    setSelectedFollowup(null);
    setFormData({
      id: "",
      lead_name: "",
      phone: "",
      email: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "10:00",
      followup_type: "Call",
      project: "",
      priority: "MEDIUM",
      comments: ""
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (f) => {
    setSelectedFollowup(f);
    setFormData({
      id: f.id,
      lead_name: f.lead_name,
      phone: f.phone || "",
      email: f.email || "",
      date: f.date ? format(new Date(f.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      time: f.time || "10:00",
      followup_type: f.followup_type || "Call",
      project: f.projectId || "",
      priority: f.priority || "MEDIUM",
      comments: f.comments || ""
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateFollowup(formData);
        toast.success("Follow-up updated successfully");
      } else {
        await addFollowup(formData);
        toast.success("Follow-up scheduled successfully");
      }
      setShowFormModal(false);
      fetchFollowups();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving follow-up");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this follow-up schedule?")) {
      try {
        await deleteFollowup(id);
        toast.success("Follow-up deleted successfully");
        fetchFollowups();
      } catch (err) {
        toast.error("Failed to delete follow-up");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateFollowupStatus(id, status);
      toast.success(`Follow-up marked as ${status.toLowerCase()}`);
      setShowStatusModal(false);
      fetchFollowups();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const timeInAMPM = (timeString) => {
    if (!timeString) return "";
    try {
      const parts = timeString.split(":");
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return timeString;
    }
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: followups.length,
      today: todaysFollowups.length,
      pending: followups.filter(f => f.followup_status === "PENDING" || f.followup_status === "OPEN").length,
      completed: followups.filter(f => f.followup_status === "COMPLETED").length,
    };
  }, [followups, todaysFollowups]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Schedule <span className="text-primary-600">Follow-ups</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Build closer client relationships through timely touchpoints
          </p>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
        >
          <Plus size={16} /> Schedule Call / Meet
        </button>
      </div>

      {/* ═══════════ DYNAMIC CAROUSEL STATS ═══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200 group-hover:bg-slate-800 transition-colors" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Scheduled</p>
          <h3 className="text-2xl font-black text-slate-700">{stats.total}</h3>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-400" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Callbacks Today</p>
          <h3 className="text-2xl font-black text-orange-500">{stats.today}</h3>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Pending Actions</p>
          <h3 className="text-2xl font-black text-blue-600">{stats.pending}</h3>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Completed</p>
          <h3 className="text-2xl font-black text-emerald-600">{stats.completed}</h3>
        </div>
      </div>

      {/* ═══════════ FILTERS ═══════════ */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col xl:flex-row gap-4 items-stretch xl:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search customer by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-primary-500 outline-none transition-all font-bold text-slate-600"
          >
            <option value="all">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="PENDING">In Progress</option>
            <option value="COMPLETED">Closed / Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-primary-500 outline-none transition-all font-bold text-slate-600"
          >
            <option value="all">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-primary-500 outline-none transition-all font-bold text-slate-600"
          >
            <option value="all">All Types</option>
            <option value="Call">Call</option>
            <option value="Meet">Meet</option>
            <option value="Follow-up">Followup</option>
            <option value="Site visit">Site visit</option>
            <option value="Team Meeting">Team Meeting</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || typeFilter !== "all") && (
          <button 
            onClick={() => { setSearchQuery(""); setStatusFilter("all"); setPriorityFilter("all"); setTypeFilter("all"); }}
            className="text-xs text-rose-600 hover:bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* ═══════════ TIMELINE & LIST CONTENT ═══════════ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-white border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : followups.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3">
          <Calendar className="mx-auto text-slate-200 w-12 h-12" />
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">No follow-ups found</h4>
          <p className="text-slate-400 text-xs">Try adapting your status filters or schedule a new callback trigger.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {followups.map((f) => {
            const isCompleted = f.followup_status === "COMPLETED" || f.followup_status === "CLOSED";
            const isInProgress = f.followup_status === "PENDING" || f.followup_status === "IN_PROGRESS";
            
            return (
              <div 
                key={f.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Clean Status Left Border Indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  isCompleted ? "bg-emerald-500" : 
                  isInProgress ? "bg-amber-500" : 
                  "bg-blue-500"
                }`} />

                <div>
                  <div className="flex justify-between items-start mb-3 pl-1">
                    <div>
                      <h4 className="font-bold text-slate-800 line-clamp-1">{f.lead_name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-500/10 uppercase tracking-wide">
                          {f.followup_type}
                        </span>
                        {f.project && (
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                            <Building size={9} /> {f.project}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Priority Badge */}
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      f.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                      f.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {f.priority}
                    </span>
                  </div>

                  {/* Scheduled Date/Time */}
                  <div className="flex items-center gap-3 mt-4 py-2 border-y border-slate-50 text-slate-500 pl-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <Calendar size={13} className="text-slate-400" /> 
                      {f.date ? format(new Date(f.date), "dd MMM, yyyy") : "N/A"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <Clock size={13} className="text-slate-400" /> 
                      {timeInAMPM(f.time)}
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-1.5 mt-3 text-slate-600 pl-1">
                    {f.phone && (
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Phone size={12} className="text-slate-400" /> {f.phone}
                      </div>
                    )}
                    {f.email && (
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Mail size={12} className="text-slate-400" /> {f.email}
                      </div>
                    )}
                  </div>

                  {f.comments && (
                    <p className="text-slate-500 text-xs italic mt-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 line-clamp-2">
                      "{f.comments}"
                    </p>
                  )}
                </div>

                {/* Glassy Slide-Up Actions Overlay */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      isCompleted ? "bg-emerald-500 animate-pulse" : 
                      isInProgress ? "bg-amber-500 animate-pulse" : 
                      "bg-blue-500 animate-pulse"
                    }`} />
                    {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Open"}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedFollowup(f); setShowStatusModal(true); }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors border border-slate-100"
                      title="Update Status"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(f)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-100"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(f.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-100"
                      title="Cancel Trip"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════ FORM DIALOG (CREATE / UPDATE) ═══════════ */}
      {showFormModal && (
        <ModalWrapper
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title={formData.id ? "Edit Follow-up Trigger" : "Schedule Client Follow-up"}
          size="lg"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Name</label>
                <input 
                  required
                  value={formData.lead_name}
                  onChange={(e) => setFormData({ ...formData, lead_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Interest</label>
                <select 
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                >
                  <option value="">None / General</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.projectName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <input 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Callback Date</label>
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Slot</label>
                <input 
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                >
                  <option value="LOW">Low priority</option>
                  <option value="MEDIUM">Medium priority</option>
                  <option value="HIGH">High priority</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Action Type</label>
                <select 
                  value={formData.followup_type}
                  onChange={(e) => setFormData({ ...formData, followup_type: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all"
                >
                  <option value="Call">Call callback</option>
                  <option value="Meet">Client Meet</option>
                  <option value="Follow-up">Regular Follow-up</option>
                  <option value="Site visit">Venture Site visit</option>
                  <option value="Team Meeting">Internal Team Meeting</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes / Instructions</label>
              <textarea 
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Details of followup task..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm font-medium outline-none transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                onClick={() => setShowFormModal(false)}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary"
                className="flex-[2]"
              >
                {formData.id ? "Update Follow-up" : "Schedule Follow-up"}
              </Button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ═══════════ QUICK STATUS CHANGE MODAL ═══════════ */}
      {showStatusModal && selectedFollowup && (
        <ModalWrapper
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title="Update Follow-up Status"
          size="sm"
        >
          <div className="space-y-4 py-2">
            <p className="text-xs font-semibold text-slate-500">
              Select status update for <strong className="text-slate-800">{selectedFollowup.lead_name}</strong> callback:
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleStatusChange(selectedFollowup.id, "OPEN")}
                className="w-full px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-black uppercase tracking-wider text-center"
              >
                Open (Pending Callback)
              </button>
              <button 
                onClick={() => handleStatusChange(selectedFollowup.id, "PENDING")}
                className="w-full px-4 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-black uppercase tracking-wider text-center"
              >
                In Progress (Ongoing conversation)
              </button>
              <button 
                onClick={() => handleStatusChange(selectedFollowup.id, "COMPLETED")}
                className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-black uppercase tracking-wider text-center"
              >
                Closed (Action Completed)
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
