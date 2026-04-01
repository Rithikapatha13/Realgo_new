import React, { useEffect, useState } from "react";
import Button from "@/components/Common/Button";
import { Upload, X } from "lucide-react";
import { useCreateCompany, useUpdateCompany } from "@/hooks/useCompany";
import apiClient from "@/config/apiClient";
import { toast } from "react-hot-toast";
import { resolveImageUrl } from "@/utils/common";

const AVAILABLE_MODULES = [
  { id: "VENTURES", label: "Ventures" },
  { id: "ADMINISTRATION", label: "Administration" },
  { id: "MEDIA", label: "Media" },
  { id: "SITE_VISITS", label: "Site Visits" },
  { id: "FINANCE", label: "Finance" },
];

export default function CompanyForm({ company, action, onClose, onRefetch }) {
  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();

  const [formData, setFormData] = useState({
    company: "",
    address: "",
    phone: "",
    email: "",
    domain: "",
    status: "ACTIVE",
    modules: [],
    img: "",
  });

  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if ((action === "Update" || action === "View") && company) {
      setFormData({
        company: company.company || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        domain: company.domain || "",
        status: company.status || "ACTIVE",
        modules: company.modules || [],
        img: company.img || "",
      });
      if (company.img) {
        setSelectedImage(resolveImageUrl(company.img));
      }
    }
  }, [action, company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (moduleId) => {
    setFormData((prev) => {
      const isSelected = prev.modules.includes(moduleId);
      const newModules = isSelected
        ? prev.modules.filter((m) => m !== moduleId)
        : [...prev.modules, moduleId];
      return { ...prev, modules: newModules };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Temporary preview
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    setUploading(true);
    try {
      // Get presigned URL
      const { data } = await apiClient.post("/common/presigned-url", {
        fileType: file.type,
      });

      if (!data.success) throw new Error("Failed to get presigned URL");

      // Upload to S3
      await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // Extract path for saving
      const fileUrl = new URL(data.fileUrl);
      const filePath = fileUrl.pathname.substring(1); 
      setFormData((prev) => ({ ...prev, img: filePath }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
      setSelectedImage(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (action === "Create") {
        await createCompanyMutation.mutateAsync(formData);
      } else {
        await updateCompanyMutation.mutateAsync({ id: company.id, ...formData });
      }
      onRefetch();
      onClose();
    } catch (error) {
      // Errors handled by hook
      console.error("Form submit error", error);
    }
  };

  const isView = action === "View";
  const isLoading = createCompanyMutation.isPending || updateCompanyMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <label className="relative cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-primary-500 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isView || uploading}
          />
          {selectedImage ? (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-32 h-32 object-contain bg-white rounded-md p-1 border border-slate-100"
              />
              {!isView && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                  <span className="text-white text-xs font-medium uppercase tracking-wider">Change Logo</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-32 h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-md border border-slate-100">
              <Upload size={24} className="mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">Upload Logo</span>
            </div>
          )}
        </label>
        {uploading && <p className="text-xs text-primary-600 mt-2 font-medium animate-pulse">Uploading image...</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={isView}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            disabled={isView}
            placeholder="e.g. realgo.in"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isView}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isView}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isView}
          rows="2"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isView}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
            Platform Modules
          </label>
          
          {isView ? (
            <div className="flex flex-wrap gap-2 px-1">
              {formData.modules.length > 0 ? (
                formData.modules.map(modId => {
                  const mod = AVAILABLE_MODULES.find(m => m.id === modId);
                  return (
                    <span key={modId} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm">
                      {mod?.label || modId}
                    </span>
                  );
                })
              ) : (
                <span className="text-xs text-slate-400 italic">No modules enabled</span>
              )}
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 px-1">
              {AVAILABLE_MODULES.map((module) => (
                <label key={module.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(module.id)}
                    onChange={() => handleModuleChange(module.id)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 transition-all cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-600 group-hover:text-indigo-600 transition-colors leading-tight">
                    {module.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isView && (
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading || uploading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading || uploading}>
            {isLoading ? "Saving..." : action === "Create" ? "Create Company" : "Update Company"}
          </Button>
        </div>
      )}
      
      {isView && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </form>
  );
}
