import React, { useState, useEffect } from "react";
import { 
  Save, 
  X, 
  Upload, 
  ImageIcon, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { 
  useCreateProjectStatus, 
  useUpdateProjectStatus 
} from "../../hooks/useProjectStatus";
import apiClient from "../../config/apiClient";
import { resolveImageUrl } from "../../utils/common";

export default function ProjectStatusForm({ status, onClose }) {
  const [formData, setFormData] = useState({
    statusName: "",
    statusIcon: "",
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const createMutation = useCreateProjectStatus();
  const updateMutation = useUpdateProjectStatus();

  useEffect(() => {
    if (status) {
      setFormData({
        statusName: status.statusName,
        statusIcon: status.statusIcon,
      });
      if (status.statusIcon) {
        setPreview(status.statusIcon);
      }
    }
  }, [status]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "icons");

    try {
      const response = await apiClient.post("/common/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setFormData({ ...formData, statusIcon: response.data.filePath });
        setPreview(response.data.filePath);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status) {
      updateMutation.mutate({ id: status.id, data: formData }, {
        onSuccess: () => onClose(),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => onClose(),
      });
    }
  };

  const labelClasses = "block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1";
  const inputClasses = "w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all placeholder-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-2">
      <div className="space-y-6">
        {/* Status Name */}
        <div className="space-y-1">
          <label className={labelClasses}>
            Display Name
          </label>
          <input
            type="text"
            required
            value={formData.statusName}
            onChange={(e) => setFormData({ ...formData, statusName: e.target.value })}
            placeholder="e.g. Under Construction, Completed"
            className={inputClasses}
          />
        </div>

        {/* Status Icon Upload */}
        <div className="space-y-1">
          <label className={labelClasses}>
            Visual Identity
          </label>
          
          <div className="flex items-center gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm transition-all group-hover:border-primary-200">
                {preview ? (
                  <img 
                    src={resolveImageUrl(preview)} 
                    className="w-full h-full object-cover p-2.5" 
                    alt="Preview" 
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-200" />
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-5 h-5 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-[11px] font-medium text-slate-400 leading-tight">
                Select an icon or badge to represent this status stage in the project pipeline.
              </p>
              
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="status-icon-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="status-icon-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 hover:border-primary-500 hover:text-primary-600 cursor-pointer transition-all shadow-sm uppercase tracking-wider"
                >
                  <Upload size={14} />
                  {uploading ? "Uploading..." : "Replace Icon"}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending || uploading}
          className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-500/10 hover:bg-primary-700 transition-all uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none"
        >
          <Save size={16} />
          <span>{status ? "Save Changes" : "Create Stage"}</span>
        </button>
      </div>
    </form>
  );
}
