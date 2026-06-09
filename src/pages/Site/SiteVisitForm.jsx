import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2,
  X,
  Plus,
  MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getUser, getUserType } from '@/services/auth.service';
import { createSiteVisit, updateSiteVisit } from '@/services/siteVisit.service';
import { getProjects } from '@/services/project.service';
import Button from '@/components/Common/Button';
import FormInput from '@/components/Common/FormInput';
import FileInput from '@/components/Common/FileUpload';

export default function SiteVisitForm({ item, onSuccess, onCancel }) {
  const user = getUser();
  const userType = (getUserType() || '').toLowerCase();
  const userRole = (user?.role_name || '').toLowerCase();
  
  const isOpsRole = 
    userType === "admin" || 
    userType === "superadmin" || 
    userRole.includes("admin") || 
    userRole.includes("account") || 
    userRole.includes("finance");

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    leadName: item?.leadName || '',
    phone: item?.phone || '',
    date: item?.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: item?.time || '',
    siteVisitPicture: item?.siteVisitPicture || '',
    projectId: item?.projectId || '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.items || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.leadName || !formData.phone || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        userId: user.id
      };

      if (item) {
        await updateSiteVisit(item.id, payload);
        toast.success("Site visit updated successfully");
      } else {
        await createSiteVisit(payload);
        toast.success("Site visit scheduled successfully");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Show picture field if:
  // 1. User is Admin/Ops role.
  // 2. We are editing an existing item that is already APPROVED, VISITED, or COMPLETED.
  const showPictureField = isOpsRole || (item && ['APPROVED', 'VISITED', 'COMPLETED'].includes(item.status));

  return (
    <form onSubmit={handleSubmit} className="p-1 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormInput
          label="Customer Name"
          name="leadName"
          value={formData.leadName}
          onChange={handleChange}
          placeholder="Enter customer name"
          icon={User}
          required
        />
        <FormInput
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          icon={Phone}
          required
        />
        <FormInput
          label="Visit Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          icon={Calendar}
          required
        />
        <FormInput
          label="Visit Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          icon={Clock}
          required
        />
        
        {/* Project Interest Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            Project Interest
          </label>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          >
            <option value="">Select a Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showPictureField && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            Verification Picture
            <span className="text-[10px] font-normal text-slate-400 italic">
              {isOpsRole ? "(Optional)" : "(Required to complete visit)"}
            </span>
          </label>
          <FileInput
            name="siteVisitPicture"
            existingFile={formData.siteVisitPicture}
            onChange={handleChange}
            accept="image/*"
            maxSizeMB={2}
            helperText="Upload a photo from the site to verify the visit."
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          loading={loading}
          icon={item ? <CheckCircle2 size={18} /> : <Plus size={18} />}
        >
          {item ? "Update Site Visit" : "Schedule Visit"}
        </Button>
      </div>
    </form>
  );
}
