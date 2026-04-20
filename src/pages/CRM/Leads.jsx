import { useState, useEffect } from "react";
import { Plus, Upload, Phone, User, Calendar, Megaphone, Search, Filter, Clock, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/Common/Button";
import { getUser, getUserType } from "@/services/auth.service";
import { getLeads } from "@/services/crm.service";
import CallModal from "@/components/CRM/CallModal";
import LeadModal from "@/components/CRM/LeadModal";
import HistoryModal from "@/components/CRM/HistoryModal";

export default function Leads() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const userRole = (user?.role?.roleName || "").toUpperCase();
  const userType = (getUserType() || "").toLowerCase();

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Determine view based on path
  const isPendingView = location.pathname.includes("pending");
  const isFollowupView = location.pathname.includes("followups");

  const pageTitle = isPendingView ? "Pending Leads" : isFollowupView ? "Follow-ups" : "All Leads";
  const pageSubtitle = isPendingView ? "Leads awaiting their first contact." : isFollowupView ? "Scheduled callbacks for today." : "Complete overview of the CRM pipeline.";

  useEffect(() => {
    fetchLeads();
  }, [location.pathname]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let filters = {};
      if (isPendingView) filters.status = "NEW";
      if (isFollowupView) filters.status = "LATER";

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

  const isTelecallerAdmin = userRole === "TELECALLER_ADMIN" || userRole === "TELECALLER ADMIN";
  const isTelecaller = userRole === "TELECALLER";
  const isAccountant = userRole === "ACCOUNTANT" || userRole === "ACCOUNTS";
  const isAdmin = userType === "admin" || userType === "clientadmin" || userType === "superadmin";
  const isAssociate = !isAdmin && !isTelecaller && !isAccountant;

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
          {/* Add Manual Lead is kept for quick entry if needed, but Import is removed to avoid redundancy */}

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
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Filter size={14} /> Filters:
          </span>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50">All Leads</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50">Hot Only</span>
          </div>
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
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Lead Status</th>
                  <th className="p-4">Assoc Status</th>
                  <th className="p-4">Assignments</th>
                  <th className="p-4">Summary</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.filter(l => l.leadName.toLowerCase().includes(search.toLowerCase()) || l.leadContact.includes(search)).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{lead.leadName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <Phone size={12} /> {lead.leadContact}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {lead.leadSource}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${lead.leadStatus === 'HOT' ? 'bg-orange-100 text-orange-700' :
                        lead.leadStatus === 'WARM' ? 'bg-yellow-100 text-yellow-700' :
                          lead.leadStatus === 'COLD' ? 'bg-blue-100 text-blue-700' :
                            lead.leadStatus === 'LATER' ? 'bg-purple-100 text-purple-700' :
                              'bg-slate-100 text-slate-600'
                        }`}>
                        {lead.leadStatus || "NEW"}
                      </span>
                    </td>
                    <td className="p-4">
                      {lead.assocStatus ? (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest">
                          {lead.assocStatus}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Site Visit</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-[11px] font-bold flex items-center gap-1 text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                          {lead.dedicatedTC ? `${lead.dedicatedTC.firstName}` : 
                           lead.adminTC ? `${lead.adminTC.firstName}` :
                           lead.telecaller ? `${lead.telecaller.firstName}` : 
                           "Unassigned"}
                        </div>
                        <div className="text-[11px] font-bold flex items-center gap-1 text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          {lead.associate ? `${lead.associate.firstName}` : "Unassigned"}
                        </div>
                      </div>
                    </td>
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
