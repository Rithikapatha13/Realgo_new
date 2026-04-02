import React, { useEffect, useState } from "react";
import Button from "@/components/Common/Button";
import { Upload, X, Palette } from "lucide-react";
import { useCreateCompany, useUpdateCompany } from "@/hooks/useCompany";
import apiClient from "@/config/apiClient";
import { toast } from "react-hot-toast";
import { resolveImageUrl } from "@/utils/common";

const AVAILABLE_MODULES = [
  { id: "ADMIN", label: "ADMIN" },
  { id: "USER", label: "USER" },
  { id: "ROLES", label: "ROLES" },
  { id: "PROFILE", label: "PROFILE" },
  { id: "GREETINGS", label: "GREETINGS" },
  { id: "PROJECT STATUS", label: "PROJECT STATUS" },
  { id: "PROJECTS", label: "PROJECTS" },
  { id: "PHASES", label: "PHASES" },
  { id: "PLOTS", label: "PLOTS" },
  { id: "FOLLOWUP", label: "FOLLOWUP" },
  { id: "LEADS", label: "LEADS" },
  { id: "NEWS", label: "NEWS" },
  { id: "NOTES", label: "NOTES" },
  { id: "REMINDERS", label: "REMINDERS" },
  { id: "SITEVISITS", label: "SITEVISITS" },
  { id: "CUSTOMER SITEVISITS", label: "CUSTOMER SITEVISITS" },
  { id: "VIDEOS", label: "VIDEOS" },
  { id: "REQUESTS", label: "REQUESTS" },
  { id: "ACCOUNTS", label: "ACCOUNTS" },
  { id: "VEHICLE SITEVISITS", label: "VEHICLE SITEVISITS" },
  { id: "SHOWCASE", label: "SHOWCASE" },
  { id: "PROJECT INCENTIVES", label: "PROJECT INCENTIVES" },
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
    companyTerm: "",
    primaryColour: "#ffffff",
    secondaryColour: "#ffffff",
    authIdType: "MANUAL",
    authIdPrefix: "",
    transactionPrefix: "",
    openingBalance: "",
    openingBalanceDate: "",
    openingBalanceType: "DEBIT",
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
        companyTerm: company.companyTerm || "",
        primaryColour: company.primaryColour || "#ffffff",
        secondaryColour: company.secondaryColour || "#ffffff",
        authIdType: company.authIdType || "MANUAL",
        authIdPrefix: company.authIdPrefix || "",
        transactionPrefix: company.transactionPrefix || "",
        openingBalance: company.openingBalance || "",
        openingBalanceDate: company.openingBalanceDate
          ? new Date(company.openingBalanceDate).toISOString().split("T")[0]
          : "",
        openingBalanceType: company.openingBalanceType || "DEBIT",
      });
      if (company.img) {
        setSelectedImage(resolveImageUrl(company.img));
      }
    }
  }, [action, company]);

  const handleChange = (e) => {
    let { name, type, value } = e.target;

    // Optional coercion if numbers are strictly kept as Numbers
    if (name === "openingBalance" && value !== "") {
      value = parseFloat(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (moduleId) => {
    setFormData((prev) => {
      const isSelected = prev.modules.includes(moduleId);
      let newModules = isSelected
        ? prev.modules.filter((m) => m !== moduleId)
        : [...prev.modules, moduleId];

      // Auto-selection groups
      const adminGroup = ["ADMIN", "USER", "ROLES"];
      if (adminGroup.includes(moduleId) && !isSelected) {
        adminGroup.forEach((m) => {
          if (!newModules.includes(m)) newModules.push(m);
        });
      }

      const projectsGroup = ["PROJECTS", "PLOTS", "PROJECT STATUS", "PHASES"];
      if (projectsGroup.includes(moduleId) && !isSelected) {
        projectsGroup.forEach((m) => {
          if (!newModules.includes(m)) newModules.push(m);
        });
      }

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
      // Create a clean payload mapping fields required by API
      const payload = {
        ...formData,
        openingBalance: formData.openingBalance ? parseFloat(formData.openingBalance) : null,
        openingBalanceDate: formData.openingBalanceDate
          ? new Date(formData.openingBalanceDate).toISOString()
          : null,
      };

      if (action === "Create") {
        await createCompanyMutation.mutateAsync(payload);
      } else {
        await updateCompanyMutation.mutateAsync({ id: company.id, ...payload });
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
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto px-1 hide-scrollbar">
      {/* 1. Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Company Name<span className="text-red-500">*</span></label>
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

      {/* 2. Address */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isView}
          rows="3"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
        ></textarea>
      </div>

      {/* 3. Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Phone<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>

      {/* 4. Email */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Email<span className="text-red-500">*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>

      {/* 5. Domain */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Domain<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          disabled={isView}
          placeholder="For example, www.companyname.com"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>

      {/* 6. Company Term */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Company Term<span className="text-red-500">*</span></label>
        <p className="text-xs text-gray-500 mb-2">Please enter a term that describes your affiliation with the company (e.g., 'Appleian' for Apple, 'Teslaian' for Tesla).</p>
        <input
          type="text"
          name="companyTerm"
          value={formData.companyTerm}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>

      {/* 7. Primary Colour */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Primary Colour<span className="text-red-500">*</span></label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            name="primaryColour"
            value={formData.primaryColour || "#ffffff"}
            onChange={handleChange}
            disabled={isView}
            className="h-10 w-14 cursor-pointer rounded-md border border-gray-300 p-0 overflow-hidden shrink-0 disabled:opacity-50"
          />
          <input
            type="text"
            name="primaryColour"
            value={formData.primaryColour}
            onChange={handleChange}
            disabled={isView}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
            required
          />
        </div>
      </div>

      {/* 8. Secondary Colour */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Secondary Colour<span className="text-red-500">*</span></label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            name="secondaryColour"
            value={formData.secondaryColour || "#ffffff"}
            onChange={handleChange}
            disabled={isView}
            className="h-10 w-14 cursor-pointer rounded-md border border-gray-300 p-0 overflow-hidden shrink-0 disabled:opacity-50"
          />
          <input
            type="text"
            name="secondaryColour"
            value={formData.secondaryColour}
            onChange={handleChange}
            disabled={isView}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
            required
          />
        </div>
      </div>

      {/* 9. Auth ID Type */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Auth ID Type<span className="text-red-500">*</span></label>
        <select
          name="authIdType"
          value={formData.authIdType}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        >
          <option value="MANUAL">Manual</option>
          <option value="AUTO">Auto</option>
        </select>
      </div>

      {/* 10. Auth ID Prefix */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Auth ID Prefix<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="authIdPrefix"
          value={formData.authIdPrefix}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>

      {/* 11. Transaction Prefix */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Transaction Prefix<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="transactionPrefix"
          value={formData.transactionPrefix}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        />
      </div>

      {/* 12. Opening Balance */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Opening Balance</label>
        <input
          type="number"
          name="openingBalance"
          value={formData.openingBalance}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>

      {/* 13. Balance Type */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Balance Type</label>
        <select
          name="openingBalanceType"
          value={formData.openingBalanceType}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="DEBIT">Debit</option>
          <option value="CREDIT">Credit</option>
        </select>
      </div>

      {/* 14. Opening Balance Date */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Opening Balance Date</label>
        <input
          type="date"
          name="openingBalanceDate"
          value={formData.openingBalanceDate}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>

      {/* 15. Status */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Status<span className="text-red-500">*</span></label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={isView}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          required
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* 16. Modules */}
      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Modules<span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-4">Select modules for the company.</p>
        
        {isView ? (
          <div className="flex flex-wrap gap-2">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4">
            {AVAILABLE_MODULES.map((module) => (
              <label key={module.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.modules.includes(module.id)}
                  onChange={() => handleModuleChange(module.id)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 transition-all cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-700 group-hover:text-indigo-600 uppercase font-medium leading-tight">
                  {module.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 17. Add Logo */}
      <div className="pt-4 border-t border-gray-200">
         <label className="block text-sm font-medium text-gray-800 mb-2">Add Logo<span className="text-red-500">*</span></label>
         <label className="relative cursor-pointer block border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-100 transition-all">
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
                  className="max-h-40 object-contain rounded-md p-1"
                />
                {!isView && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                    <span className="text-white text-xs font-medium uppercase tracking-wider">Change Logo</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-4">
                   {/* Mock SVG Image upload icon matching screenshot */}
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                     <circle cx="8.5" cy="8.5" r="1.5"></circle>
                     <polyline points="21 15 16 10 5 21"></polyline>
                   </svg>
                </div>
                <span className="text-xs font-medium text-gray-500 mb-4 tracking-wide">SVG, PNG, JPG, JPEG</span>
                <div className="px-6 py-2 bg-slate-900 text-white rounded font-medium text-sm">
                   Select from Device
                </div>
              </div>
            )}
         </label>
         {uploading && <p className="text-xs text-primary-600 mt-2 font-medium animate-pulse text-center">Uploading image...</p>}
      </div>

      {!isView && (
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" className="!bg-black !text-white text-sm font-medium rounded px-6 py-2" onClick={onClose} disabled={isLoading || uploading}>
            Cancel
          </Button>
          <Button type="submit" className="!bg-[#1e1b4b] !text-white text-sm font-medium rounded px-6 py-2" disabled={isLoading || uploading}>
            {isLoading ? "Saving..." : action === "Create" ? "Create Company" : "Update Company"}
          </Button>
        </div>
      )}
      
      {isView && (
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button type="button" className="!bg-black !text-white text-sm" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </form>
  );
}
