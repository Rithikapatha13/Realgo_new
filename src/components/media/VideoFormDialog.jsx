import { useState } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import FormInput from "@/components/Common/FormInput";
import { useCreateVideo } from "@/hooks/useVideo";
import toast from "react-hot-toast";
import { Video, Globe, Type, AlignLeft, Send, Youtube } from "lucide-react";

export default function VideoFormDialog({ isOpen, onClose, onRefetch }) {
    const [formData, setFormData] = useState({
        videoTitle: "",
        videoLink: "",
        description: "",
        status: "ACTIVE",
        videoName: "YouTube", // Default source name
    });
    const [loading, setLoading] = useState(false);

    const createMutation = useCreateVideo();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.videoTitle || !formData.videoLink) {
            toast.error("Please fill in required fields");
            return;
        }

        // Basic YouTube Link Validation
        if (!formData.videoLink.includes("youtube.com") && !formData.videoLink.includes("youtu.be")) {
            toast.error("Please enter a valid YouTube link");
            return;
        }

        setLoading(true);
        try {
            await createMutation.mutateAsync(formData);
            toast.success("Video added to gallery!");
            onRefetch();
            onClose();
            // Reset form
            setFormData({
                videoTitle: "",
                videoLink: "",
                description: "",
                status: "ACTIVE",
                videoName: "YouTube",
            });
        } catch (error) {
            toast.error("Failed to add video");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Video Highlight"
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8 py-2">
                {/* Simplified Visual Cue */}
                <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Video size={22} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">Video Details</h4>
                        <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mt-0.5">Showcase your cinematic content</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <FormInput
                        label="Video Title"
                        name="videoTitle"
                        value={formData.videoTitle}
                        onChange={handleChange}
                        placeholder="e.g. Corporate Project Showcase"
                        required
                        icon={Type}
                    />

                    <FormInput
                        label="YouTube Link"
                        name="videoLink"
                        value={formData.videoLink}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                        icon={Youtube}
                    />

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 mb-2 block ml-1">
                            Short Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell us about this video..."
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm font-medium min-h-[100px] outline-none shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <FormInput
                            label="Platform"
                            name="videoName"
                            value={formData.videoName}
                            onChange={handleChange}
                            placeholder="YouTube"
                        />

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-700 mb-2 block ml-1">
                                Visibility Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-indigo-500 transition-all text-sm font-semibold outline-none shadow-sm"
                            >
                                <option value="ACTIVE">Visible</option>
                                <option value="INACTIVE">Hidden</option>
                            </select>
                        </div>
                    </div>
                </div>

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
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md transition-all disabled:opacity-50 active:scale-95 text-sm"
                    >
                        {loading ? "Adding..." : (
                            <>
                                <Send size={18} />
                                Publish Video
                            </>
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}
