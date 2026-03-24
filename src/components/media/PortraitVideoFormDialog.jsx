import { useState } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import FormInput from "@/components/Common/FormInput";
import { useCreatePortraitVideo } from "@/hooks/usePortraitVideo";
import toast from "react-hot-toast";
import { Video, Globe, Type, AlignLeft, Send, Youtube } from "lucide-react";

export default function PortraitVideoFormDialog({ isOpen, onClose, onRefetch }) {
    const [formData, setFormData] = useState({
        videoTitle: "",
        videoName: "",
        videoLink: "",
        description: "",
        status: "ACTIVE",
    });

    const createMutation = useCreatePortraitVideo();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync(formData);
            toast.success("Portrait Video added successfully!");
            onRefetch();
            onClose();
            setFormData({
                videoTitle: "",
                videoName: "",
                videoLink: "",
                description: "",
                status: "ACTIVE",
            });
        } catch (error) {
            toast.error("Failed to add portrait video");
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Add Portrait Video"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-8 py-2 font-sans">
                {/* Visual Header */}
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Video size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">Portrait Content</h4>
                        <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mt-0.5">Optimized for mobile viewing (9:16)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">
                                Basic Information
                            </label>
                            <FormInput
                                label="Video Title"
                                name="videoTitle"
                                value={formData.videoTitle}
                                onChange={handleChange}
                                placeholder="e.g., Summer Collection Launch"
                                icon={Type}
                                required
                            />
                            <FormInput
                                label="Display Name"
                                name="videoName"
                                value={formData.videoName}
                                onChange={handleChange}
                                placeholder="e.g., Launch Video"
                                icon={AlignLeft}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">
                                Media Source
                            </label>
                            <FormInput
                                label="Video Link (S3/YouTube URL)"
                                name="videoLink"
                                value={formData.videoLink}
                                onChange={handleChange}
                                placeholder="e.g., https://..."
                                icon={Youtube}
                                required
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 mb-2 block ml-1">
                                    Privacy Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 transition-all text-sm font-semibold outline-none shadow-sm"
                                >
                                    <option value="ACTIVE">Public (Active)</option>
                                    <option value="INACTIVE">Draft (Hidden)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">
                        Story Context
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide a brief context for this portrait video..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 transition-all text-sm font-semibold outline-none shadow-sm min-h-[100px] resize-none"
                    ></textarea>
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
                        disabled={createMutation.isLoading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md transition-all disabled:opacity-50 active:scale-95 text-sm"
                    >
                        {createMutation.isLoading ? "Adding to Library..." : (
                            <>
                                <Send size={18} />
                                Add Portrait Video
                            </>
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}
