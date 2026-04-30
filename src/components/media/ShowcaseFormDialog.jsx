import { useState } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import FormInput from "@/components/Common/FormInput";
import FileUpload from "@/components/Common/FileUpload";
import { useCreateShowcase } from "@/hooks/useShowcase";
import toast from "react-hot-toast";
import { Layers, Send, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ShowcaseFormDialog({ isOpen, onClose, onRefetch }) {
    const [formData, setFormData] = useState({
        fileName: "",
        fileCategory: "CERTIFICATE",
        platform: "",
        status: "VERIFIED",
    });
    const [loading, setLoading] = useState(false);

    const createMutation = useCreateShowcase();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const fileName = e.target.value;
        setFormData((prev) => ({ ...prev, fileName: fileName }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fileName || !formData.fileCategory) {
            toast.error("Please upload a file and select a category");
            return;
        }

        setLoading(true);
        try {
            await createMutation.mutateAsync(formData);
            toast.success("Achievement added to showcase!");
            onRefetch();
            onClose();
            // Reset form
            setFormData({
                fileName: "",
                fileCategory: "CERTIFICATE",
                platform: "",
                status: "VERIFIED",
            });
        } catch (error) {
            toast.error("Failed to add showcase item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Upload Achievement"
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8 py-2 font-sans">
                {/* Soft Visual Header */}
                <div className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Award size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">Recognition Asset</h4>
                        <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mt-0.5">Celebrate your milestones</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">
                            Asset Upload (Image)
                        </label>
                        <div className="p-1 bg-gray-50 rounded-2xl border border-gray-100">
                            <FileUpload
                                onChange={handleFileChange}
                                existingFile={formData.fileName}
                                folder="showcase"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-700 mb-2 block ml-1">
                                Asset Category
                            </label>
                            <select
                                name="fileCategory"
                                value={formData.fileCategory}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-amber-500 transition-all text-sm font-semibold outline-none shadow-sm"
                            >
                                <option value="CERTIFICATE">Certificate</option>
                                <option value="AWARD">Award</option>
                                <option value="SITE_VISIT">Site Photo</option>
                                <option value="MARKETING">Marketing Material</option>
                                <option value="POPUP_PORTRAIT">Popup Portrait</option>
                                <option value="POPUP_LANDSCAPE">Popup Landscape</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-700 mb-2 block ml-1">
                                Status Badge
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-amber-500 transition-all text-sm font-semibold outline-none shadow-sm"
                            >
                                <option value="VERIFIED">Verified</option>
                                <option value="PENDING">Review Pending</option>
                                <option value="DISABLED">Disabled (Stop Popup)</option>
                                <option value="NONE">No Badge</option>
                            </select>
                        </div>
                    </div>

                    <FormInput
                        label="Occasion or Venue"
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                        placeholder="e.g. Annual Summit 2024"
                        icon={Layers}
                    />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md transition-all disabled:opacity-50 active:scale-95 text-sm"
                    >
                        {loading ? "Uploading..." : (
                            <>
                                <CheckCircle2 size={18} />
                                Finalize Upload
                            </>
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}
