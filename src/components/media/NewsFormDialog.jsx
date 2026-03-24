import { useState } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import FormInput from "@/components/Common/FormInput";
import FileUpload from "@/components/Common/FileUpload";
import { useCreateNews } from "@/hooks/useNews";
import toast from "react-hot-toast";
import { Newspaper, Send, X, Image as ImageIcon } from "lucide-react";

export default function NewsFormDialog({ isOpen, onClose, type, onRefetch }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        newsPicture: "",
        heading: "",
        source: "",
    });
    const [loading, setLoading] = useState(false);

    const createMutation = useCreateNews();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (fileName) => {
        setFormData((prev) => ({ ...prev, newsPicture: fileName }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            toast.error("Please fill in required fields");
            return;
        }

        setLoading(true);
        try {
            await createMutation.mutateAsync({
                ...formData,
                type: type || "GENERAL",
            });
            toast.success("News published successfully!");
            onRefetch();
            onClose();
            // Reset form
            setFormData({
                title: "",
                description: "",
                date: new Date().toISOString().split("T")[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                newsPicture: "",
                heading: "",
                source: "",
            });
        } catch (error) {
            toast.error("Failed to publish news");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={`Publish ${type === "DAILY" ? "Daily Post" : "News Article"}`}
            size="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8 py-2">

                <div className="space-y-6">
                    {/* Image Section */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">
                            Feature Image
                        </label>
                        <div className="p-1 bg-gray-50 rounded-2xl border border-gray-100">
                            <FileUpload
                                onUploadSuccess={handleFileChange}
                                existingFile={formData.newsPicture}
                                folder="news"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <FormInput
                                label="Article Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter a professional title..."
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-700 mb-2 block ml-1">
                                Content Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write the article content or summary..."
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium min-h-[140px] outline-none shadow-sm"
                                required
                            />
                        </div>

                        <FormInput
                            label="Publish Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            label="Publish Time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            label="Source / Reference"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            placeholder="e.g. Corporate Blog"
                        />

                        <FormInput
                            label="Highlight / Heading"
                            name="heading"
                            value={formData.heading}
                            onChange={handleChange}
                            placeholder="e.g. Market Trends"
                        />
                    </div>
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
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md transition-all disabled:opacity-50 active:scale-95 text-sm"
                    >
                        {loading ? "Publishing..." : (
                            <>
                                <Send size={18} />
                                Publish Now
                            </>
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}
