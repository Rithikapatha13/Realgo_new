import React, { useState, useEffect } from "react";
import { X, Plus, User, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { addLead } from "@/services/crm.service";

export default function LeadModal({ lead, onClose, onSaved }) {
  const [form, setForm] = useState({
    leadName: "",
    leadContact: "",
    leadEmail: "",
    leadCity: "",
    leadSource: "OTHER",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        leadName: lead.leadName || "",
        leadContact: lead.leadContact || "",
        leadEmail: lead.leadEmail || "",
        leadCity: lead.leadCity || "",
        leadSource: lead.leadSource || "OTHER",
        description: lead.notes || "",
      });
    }
  }, [lead]);

  async function submit() {
    if (!form.leadName || !form.leadContact) {
      toast.error("Name and Phone are required");
      return;
    }

    setLoading(true);

    try {
      await addLead(form);
      toast.success(lead ? "Lead updated" : "Lead created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2 text-slate-900">
            {lead ? "Edit Lead" : "Add Lead"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name *</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                    placeholder="Enter full name"
                    value={form.leadName}
                    onChange={(e) => setForm({ ...form, leadName: e.target.value })}
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone *</label>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                    placeholder="Enter phone number"
                    value={form.leadContact}
                    onChange={(e) => setForm({ ...form, leadContact: e.target.value })}
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                    placeholder="example@email.com"
                    value={form.leadEmail}
                    onChange={(e) => setForm({ ...form, leadEmail: e.target.value })}
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City/Location</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
                    placeholder="Enter city or area"
                    value={form.leadCity}
                    onChange={(e) => setForm({ ...form, leadCity: e.target.value })}
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Traffic Source</label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block"
              value={form.leadSource}
              onChange={(e) => setForm({ ...form, leadSource: e.target.value })}
            >
                <option value="SELF">Self Generated</option>
                <option value="WEBSITE">Website</option>
                <option value="SOCIAL_MEDIA">Social Media</option>
                <option value="REFERRAL">Referral</option>
                <option value="WALK_IN">Walk In</option>
                <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={submit} 
            disabled={loading} 
            className="flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={18} /> {lead ? "Update Lead" : "Add Lead"}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
