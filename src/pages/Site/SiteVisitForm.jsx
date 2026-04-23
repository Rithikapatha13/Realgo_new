import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2,
  X,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getUser } from '@/services/auth.service';
import { createSiteVisit, updateSiteVisit } from '@/services/siteVisit.service';
import Button from '@/components/Common/Button';
import FormInput from '@/components/Common/FormInput';

export default function SiteVisitForm({ item, onSuccess, onCancel }) {
  const user = getUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leadName: item?.leadName || '',
    phone: item?.phone || '',
    date: item?.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: item?.time || '',
    siteVisitPicture: item?.siteVisitPicture || '',
  });

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
      </div>

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
