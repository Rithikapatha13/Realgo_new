import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Video as VideoIcon,
  Play,
  Trash2,
  Youtube,
  MonitorPlay,
  Clock,
  ChevronRight,
  Smartphone,
  ArrowLeft
} from "lucide-react";
import { useGetVideosData, useDeleteVideo } from "@/hooks/useVideo";
import { LoadingIndicator } from "@/components";
import { getUser } from "@/services/auth.service";
import toast from "react-hot-toast";
import VideoFormDialog from "@/components/media/VideoFormDialog";

export default function Videos() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const user = getUser();
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.userType?.toLowerCase() === "admin";

  const { data: videoResponse, isLoading, refetch } = useGetVideosData({
    search: searchQuery
  });

  const deleteMutation = useDeleteVideo();
  const videos = videoResponse?.items || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Video deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete video");
      }
    }
  };

  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-10 font-sans">
      
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Video <span className="text-primary-500">Gallery</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              A curated collection of project walkthroughs and corporate highlights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/portrait-videos")}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-xs border border-gray-100"
            >
              <Smartphone size={16} className="text-primary-500" />
              Portrait Mode
            </button>
            {isAdmin && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-500/90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95 text-sm"
              >
                <Plus size={18} />
                Add Video
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-end">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all text-sm outline-none"
            />
          </div>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-4">
              <MonitorPlay size={32} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Gallery is empty</h3>
            <p className="text-gray-400 text-xs mt-1">Ready to showcase your visual content here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => {
              const ytId = getYouTubeID(video.videoLink);
              const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null;

              return (
                <div
                  key={video.id}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-900">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={video.videoTitle}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492691523567-61723c275df4?q=80&w=2670&auto=format&fit=crop'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                        <VideoIcon size={40} />
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={video.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-primary-500 hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Play size={24} fill="currentColor" className="ml-0.5" />
                      </a>
                    </div>

                    <div className="absolute top-4 left-4">
                      <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                        {video.status || "HD"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest flex items-center gap-1">
                          <Youtube size={14} className="text-red-500" />
                          Youtube
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(video.id)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-primary-500 transition-colors line-clamp-2">
                        {video.videoTitle}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-semibold">
                        <Clock size={12} />
                        {new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <a
                        href={video.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-gray-900 hover:text-primary-500 transition-colors uppercase tracking-tight flex items-center gap-1"
                      >
                        Watch Now
                        <ChevronRight size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <VideoFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onRefetch={refetch}
      />
    </div>
  );
}
