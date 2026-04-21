import { useState, useEffect } from "react";
import { Plus, Upload, Phone, User, Calendar, Megaphone, Search, Filter, Clock, ArrowLeft, MessageSquare } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Button from "@/components/Common/Button";
import { getUser, getUserType } from "@/services/auth.service";
import { getLeads, getAssignables, assignLead } from "@/services/crm.service";
import CallModal from "@/components/CRM/CallModal";
import LeadModal from "@/components/CRM/LeadModal";
import HistoryModal from "@/components/CRM/HistoryModal";

export default function Leads() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const userRole = (user?.role?.roleName || "").toUpperCase();
  const userType = (getUserType() || "").toLowerCase();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "ALL";

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedLead, setSelectedLead] = useState(null);
  const [assignables, setAssignables] = useState({ telecallers: [], associates: [] });
  const [showCallModal, setShowCallModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const isTelecallerAdmin = userRole === "TELECALLER_ADMIN" || userRole === "TELECALLER ADMIN";
  const isTelecaller = userRole === "TELECALLER";
  const isAccountant = userRole === "ACCOUNTANT" || userRole === "ACCOUNTS";
  const isAdmin = userType === "admin" || userType === "clientadmin" || userType === "superadmin";
  const isAssociate = !isAdmin && !isTelecaller && !isAccountant;

  // Determine view based on path
  const isPendingView = location.pathname.includes("pending");
  const isFollowupView = location.pathname.includes("followups");

  const pageTitle = isPendingView ? "Pending Leads" : isFollowupView ? "Follow-ups" : "All Leads";
  const pageSubtitle = isPendingView ? "Leads awaiting their first contact." : isFollowupView ? "Scheduled callbacks for today." : "Complete overview of the CRM pipeline.";

  const handleAssign = async (leadId, type, entityId) => {
    try {
      const payload = {};
      if (type === 'TC') payload.telecallerId = entityId || null;
      if (type === 'ASSOC') payload.associateId = entityId || null;
      
      await assignLead(leadId, payload);
      toast.success("Lead reassigned successfully");
      fetchLeads(); // Refresh to show new assignment
    } catch (error) {
      toast.error("Failed to assign lead");
    }
  };

  useEffect(() => {
    fetchLeads();
    if (isAdmin) fetchAssignablesList();
  }, [location.pathname, statusFilter]);

  const fetchAssignablesList = async () => {
    try {
      const res = await getAssignables();
      setAssignables(res);
    } catch (error) {
      console.error("Failed to fetch assignables", error);
    }
  };

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) setStatusFilter(status);
  }, [searchParams]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let filters = {};
      if (isPendingView) filters.status = "NEW";
      else if (isFollowupView) filters.status = "LATER";
      else if (statusFilter !== "ALL") filters.status = statusFilter;

      const response = await getLeads(filters);
      setLeads(response.leads || []);
    } catch (error) {
      console.error("Failed to load leads", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = (lead) => {
    setSelectedLead(lead);
    setShowCallModal(true);
  };

  const handleHistoryClick = (lead) => {
    setSelectedLead(lead);
    setShowHistoryModal(true);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-8 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="text-primary-600" /> {pageTitle}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {pageSubtitle}
          </p>
        </div>

        <div className="flex gap-3">
          {isAssociate && (
            <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowLeadModal(true)}>
              <Plus size={18} />
              <span>Add Manual Lead</span>
            </Button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or number..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 whitespace-nowrap">Filter Status:</span>
          {["ALL", "NEW", "HOT", "WARM", "COLD", "LATER", "SITEVISIT", "BOOKED"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setSearchParams({ status: s });
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? "bg-primary-600 text-black shadow-lg shadow-primary-500/20"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-primary-500"
              }`}
            >
              {s === "ALL" ? "All Leads" : s}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Details</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Source</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  {isAdmin && <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Telecaller</th>}
                  {isAdmin && <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Associate</th>}
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Summary</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.filter(l => l.leadName.toLowerCase().includes(search.toLowerCase()) || l.leadContact.includes(search)).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <p className="font-bold text-slate-800">{lead.leadName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <Phone size={12} /> {lead.leadContact}
                          </p>
                          <a
                            href={`https://wa.me/91${lead.leadContact.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-500 hover:text-emerald-600 transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageSquare size={14} />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {lead.leadSource}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${
                          lead.leadStatus === 'HOT' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                          lead.leadStatus === 'WARM' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          lead.leadStatus === 'LATER' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          {lead.leadStatus || 'NEW'}
                        </span>
                        {lead.assocStatus && (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest w-fit border border-emerald-500/10">
                            {lead.assocStatus}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* TELECALLER ASSIGNMENT */}
                    {isAdmin && (
                      <td className="p-4">
                        <select
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-600 focus:ring-1 focus:ring-primary-500 outline-none"
                          value={lead.dedicatedTCId || lead.adminTCId || ""}
                          onChange={(e) => handleAssign(lead.id, 'TC', e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {assignables.telecallers.map(tc => (
                            <option key={tc.id} value={tc.id}>{tc.name}</option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* ASSOCIATE ASSIGNMENT */}
                    {isAdmin && (
                      <td className="p-4">
                        <select
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-600 focus:ring-1 focus:ring-primary-500 outline-none"
                          value={lead.associateId || ""}
                          onChange={(e) => handleAssign(lead.id, 'ASSOC', e.target.value)}
                        >
                          <option value="">No Associate</option>
                          {assignables.associates.map(as => (
                            <option key={as.id} value={as.id}>{as.name}</option>
                          ))}
                        </select>
                      </td>
                    )}

                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-slate-500 italic truncate" title={lead.notes}>
                        {lead.notes || "--"}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleUpdateClick(lead)}
                          className="px-3 py-1.5 bg-primary-600 text-black text-[10px] font-bold rounded-lg hover:bg-primary-700 transition-all shadow-sm flex items-center gap-1"
                        >
                          <Phone size={12} /> Update
                        </button>
                        <button
                          onClick={() => handleHistoryClick(lead)}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-all shadow-sm flex items-center gap-1"
                        >
                          <Clock size={12} /> History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(leads.length === 0 || leads.filter(l => l.leadName.toLowerCase().includes(search.toLowerCase()) || l.leadContact.includes(search)).length === 0) && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400 bg-slate-50/30">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                          <Clock size={24} />
                        </div>
                        <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">No active leads found in this view.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showCallModal && (
        <CallModal
          lead={selectedLead}
          onClose={() => setShowCallModal(false)}
          onSaved={fetchLeads}
        />
      )}
      {showLeadModal && (
        <LeadModal
          onClose={() => setShowLeadModal(false)}
          onSaved={fetchLeads}
        />
      )}
      {showHistoryModal && (
        <HistoryModal
          leadId={selectedLead?.id}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}
