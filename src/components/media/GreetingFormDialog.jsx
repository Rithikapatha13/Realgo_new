import { useState } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import FileUpload from "@/components/Common/FileUpload";
import { useAddGreetings } from "@/hooks/useGreetings";
import toast from "react-hot-toast";
import { Image as ImageIcon, CheckCircle2, Send, Award } from "lucide-react";

const greetingCategories = [
    { title: "Project Designs", category: "project_designs" },
    { title: "WhatsApp", category: "whatsapp" },
    { title: "Greetings/Quotes", category: "greetings_quotes" },
    { title: "Festival Greetings", category: "festival_greetings" },
    { title: "Marriage Greetings", category: "marriage_greetings" },
    { title: "Birthday Greetings", category: "birthday_greetings" },
    { title: "Social Media Templates", category: "social_media_templates" },
    { title: "Flyers", category: "flyers" },
    { title: "Offers & Announcements", category: "offers_and_announcements" },
    { title: "Foxconn Estates", category: "foxconn_estates" },
];

export default function GreetingFormDialog({ isOpen, onClose, onRefetch, initialCategory }) {
    const [formData, setFormData] = useState({
        category: initialCategory || "greetings_quotes",
        image: "",
    });
    const [loading, setLoading] = useState(false);

    const addGreetingMutation = useAddGreetings();

    const handleFileChange = (fileName) => {
        setFormData((prev) => ({ ...prev, image: fileName }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            toast.error("Please upload an image");
            return;
        }

        setLoading(true);
        try {
            await addGreetingMutation.mutateAsync({
                file_name: formData.image,
                file_category: formData.category,
            });
            toast.success("Greeting added successfully!");
            onRefetch();
            onClose();
            // Reset form
            setFormData({
                category: initialCategory || "greetings_quotes",
                image: ""
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add greeting");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Greeting"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-8 py-2 font-sans">
                {/* Visual Header */}
                <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">Visual Greeting</h4>
                        <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mt-0.5">Share positivity and visuals</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">
                            Greeting Image
                        </label>
                        <div className="p-1 bg-gray-50 rounded-2xl border border-gray-100">
                            <FileUpload
                                onUploadSuccess={handleFileChange}
                                existingFile={formData.image}
                                folder="greetings"
                                accept="image/*,.jpeg"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 ml-1">Upload a high-quality (JPG, JPEG, PNG, SVG)</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 mb-2 block ml-1">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-indigo-500 transition-all text-sm font-semibold outline-none shadow-sm"
                            required
                        >
                            {greetingCategories.map((cat) => (
                                <option key={cat.category} value={cat.category}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
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
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md transition-all disabled:opacity-50 active:scale-95 text-sm"
                    >
                        {loading ? "Uploading..." : (
                            <>
                                <CheckCircle2 size={18} />
                                Add Greeting
                            </>
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
}
