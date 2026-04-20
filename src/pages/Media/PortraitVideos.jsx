import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    Video,
    Image as ImageIcon,
    Trash2,
    Download,
    Share2,
    Calendar,
    Layers,
    ChevronRight,
    ShieldCheck,
    CheckCircle2,
    Play,
    MonitorPlay,
    ArrowLeft
} from "lucide-react";
import { useGetPortraitVideosData, useDeletePortraitVideo } from "@/hooks/usePortraitVideo";
import { LoadingIndicator } from "@/components";
import { getUser } from "@/services/auth.service";
import toast from "react-hot-toast";
import PortraitVideoFormDialog from "@/components/media/PortraitVideoFormDialog";

export default function PortraitVideos() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const user = getUser();
    const isAdmin = user?.role?.toLowerCase() === "admin" || user?.userType?.toLowerCase() === "admin";

    const { data: portraitResponse, isLoading, refetch } = useGetPortraitVideosData({
        search: searchQuery
    });

    const deleteMutation = useDeletePortraitVideo();
    const items = portraitResponse?.items || [];

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this portrait video?")) {
            try {
                await deleteMutation.mutateAsync(id);
                toast.success("Portrait Video removed");
                refetch();
            } catch (error) {
                toast.error("Failed to remove video");
            }
        }
    };

    const handleShare = async (videoLink) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Portrait Video',
                    url: videoLink,
                });
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(videoLink);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (isLoading) return <LoadingIndicator />;

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-10 font-sans">
            
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Portrait <span className="text-indigo-600">Videos</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Vertical cinematic content optimized for mobile devices and social sharing.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/videos")}
                            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-xs border border-gray-100"
                        >
                            <MonitorPlay size={16} className="text-indigo-600" />
                            Landscape Mode
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95 text-sm"
                            >
                                <Plus size={18} />
                                Add Portrait Video
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-sm outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <div className="px-4 py-1.5 bg-white rounded-lg shadow-sm text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {items.length} Assets
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 rounded-3xl">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-4">
                            <Video size={32} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Gallery is empty</h3>
                        <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-bold text-[9px]">Awaiting your cinematic stories</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="break-inside-avoid mb-6 relative group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                            >
                                {/* Visual Content - Aspect Ratio 9:16 */}
                                <div className="relative overflow-hidden bg-black aspect-[9/16]">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                        src={item.videoLink}
                                        allowFullScreen
                                        title={item.videoTitle}
                                    ></iframe>

                                    {/* Interaction Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                        <div className="mb-4">
                                            <h4 className="text-sm font-bold text-white leading-tight mb-1">{item.videoTitle}</h4>
                                            <p className="text-[10px] text-gray-300 line-clamp-2">{item.description}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleShare(item.videoLink)}
                                                className="flex-1 bg-white hover:bg-blue-600 hover:text-white text-gray-900 h-10 px-3 rounded-xl transition-all font-bold text-[10px] uppercase shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <Share2 size={14} />
                                                Share
                                            </button>
                                            <a
                                                href={item.videoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-xl flex items-center justify-center transition-all border border-white/20"
                                            >
                                                <Play size={16} fill="white" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Top Status Indicators */}
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[9px] font-bold text-white shadow-sm border border-white/10 flex items-center gap-1.5 opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 size={10} className="text-blue-400" />
                                        PORTRAIT
                                    </div>

                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md text-gray-300 hover:text-red-400 rounded-lg shadow-sm opacity-0 sm:group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Footer Info (Visible on mobile or when not hovered) */}
                                <div className="p-4 bg-white border-t border-gray-50 block sm:hidden sm:group-hover:hidden">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                                            Cinematic Content
                                        </p>
                                        <h4 className="text-xs font-bold text-gray-900 truncate">
                                            {item.videoTitle}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <PortraitVideoFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onRefetch={refetch}
            />
        </div>
    );
}
