import React, { useState, useEffect, useMemo, useRef } from "react";
import { Download, Share2, Trash2, Plus, Search, Image as ImageIcon, Send, X, Clock, ChevronRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { useGetGreetingsData, useAddGreetings, useDeleteGreetings } from "@/hooks/useGreetings";
import { resolveImageUrl } from "@/utils/common";
import { getUser, getUserType } from "@/services/auth.service";
import ModalWrapper from "@/components/Common/ModalWrapper";
import FileUpload from "@/components/Common/FileUpload";
import Button from "@/components/Common/Button";
import { toast } from "react-hot-toast";
import GreetingFormDialog from "@/components/media/GreetingFormDialog";

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

const Greetings = () => {
  const user = getUser();
  const userType = getUserType()?.toLowerCase();
  const isAdmin = userType === "admin" || userType === "superadmin";

  const PAGE_SIZE = 25;
  const [selectedCategory, setSelectedCategory] = useState("greetings_quotes");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedGreeting, setSelectedGreeting] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);

  const scrollNav = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const deleteGreetingMutation = useDeleteGreetings();

  const {
    data: greetingsResponse,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetGreetingsData(PAGE_SIZE, selectedCategory);

  const greetingsData =
    greetingsResponse?.pages?.flatMap((page) => page.items) || [];

  // Local filtering for search consistency with News style
  const filteredGreetings = useMemo(() => {
    if (!searchQuery) return greetingsData;
    return greetingsData.filter(item =>
      item.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileCategory?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [greetingsData, searchQuery]);

  useEffect(() => {
    refetch();
  }, [selectedCategory, PAGE_SIZE, refetch]);

  const fetchImageAsBlob = async (imageUrl) => {
    const proxyUrl = `${import.meta.env.VITE_API_URL}/common/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Failed to fetch image via proxy");
    return await response.blob();
  };

  const handleDownload = async (imageUrl, fileName) => {
    try {
      setIsProcessing(true);
      const blob = await fetchImageAsBlob(imageUrl);
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName || "greeting.jpg";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this greeting?")) {
      try {
        await deleteGreetingMutation.mutateAsync(id);
        toast.success("Greeting deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete greeting");
      }
    }
  };

  const handleShare = async (imageUrl, fileName) => {
    try {
      setIsProcessing(true);
      const blob = await fetchImageAsBlob(imageUrl);
      const file = new File([blob], fileName || "greeting.jpg", { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Greetings",
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Greetings",
          url: imageUrl,
        });
      } else {
        toast.error("Sharing is not supported on this browser");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      if (error.name !== 'AbortError') {
        toast.error("Failed to share greeting");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreview = (greeting) => {
    setSelectedGreeting(greeting);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full mx-auto space-y-2">

        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Media & <span className="text-primary-500">Greetings</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Daily visual assets, project designs, and corporate greetings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-500/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95 text-sm"
              >
                <Plus size={18} />
                Add Greeting
              </button>
            )}
          </div>
        </div>

        {/* Navigation & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-full overflow-hidden group/nav">
            <div
              ref={scrollRef}
              className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-xl overflow-x-auto max-w-full hide-scrollbar scroll-smooth"
            >
              {greetingCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-5 py-2 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat.category
                    ? "bg-white text-primary-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {selectedCategory === cat.category && (
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 animate-pulse" />
                  )}
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Scroll Buttons */}
            <button
              onClick={() => scrollNav("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary-500 shadow-md rounded-full flex items-center justify-center text-white opacity-0 group-hover/nav:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollNav("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary-500 shadow-md rounded-full flex items-center justify-center text-white opacity-0 group-hover/nav:opacity-100 transition-opacity z-10"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Filter by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all text-sm outline-none"
            />
          </div>
        </div>

        {/* Assets Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center py-32 text-red-500 font-semibold">
            Failed to load library. Please try again.
          </div>
        ) : filteredGreetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-4">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No images found</h3>
            <p className="text-gray-400 text-xs mt-1">Try another category or clear your filter.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-4 2xl:columns-5 gap-6">
            {filteredGreetings.map((greeting) => {
              const imageUrl = resolveImageUrl(greeting.fileName);
              return (
                <div
                  key={greeting.id}
                  className="break-inside-avoid mb-6 relative group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 cursor-pointer"
                  onClick={() => handlePreview(greeting)}
                >
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Greeting"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(imageUrl, greeting.fileName);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-900 hover:bg-primary-500 hover:text-white h-8 rounded-lg text-[10px] font-semibold transition-all"
                          disabled={isProcessing}
                        >
                          <Share2 size={12} />
                          Share
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(imageUrl, greeting.fileName);
                          }}
                          className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-lg border border-white/20 transition-all"
                          disabled={isProcessing}
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                    {/* Top Status Indicators */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[9px] font-bold text-gray-900 shadow-sm border border-gray-100 flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 size={10} className="text-primary-500" />
                      PREVIEW
                    </div>
                  </div>

                  {/* Footer Info */}
                  {/* <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-primary-500 uppercase tracking-widest">
                        {greeting.fileCategory?.replace("_", " ") || selectedCategory.replace("_", " ")}
                      </p>
                      <h4 className="text-xs font-bold text-gray-900 truncate max-w-[140px]">
                        {greeting.fileName || "Official Asset"}
                      </h4>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(greeting.id); }}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div> */}
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="pt-8 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-10 py-3 w-full bg-gray-50 border border-gray-100 text-gray-600 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              {isFetchingNextPage ? "Analyzing library..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <ModalWrapper
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Greeting Preview"
        size="lg"
      >
        <div className="space-y-8 py-2">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-4">
            {selectedGreeting && (
              <img
                src={resolveImageUrl(selectedGreeting.fileName)}
                alt="Preview"
                className="max-h-[60vh] rounded-lg shadow-sm"
              />
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                {selectedGreeting?.fileCategory?.replace("_", " ") || selectedCategory.replace("_", " ")}
              </p>
              <h4 className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                {selectedGreeting?.fileName || "Official Asset"}
              </h4>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleShare(resolveImageUrl(selectedGreeting.fileName), selectedGreeting.fileName)}
                className="flex items-center gap-2 bg-white text-gray-900 hover:bg-primary-500 hover:text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase border border-gray-100 transition-all shadow-sm"
                disabled={isProcessing}
              >
                <Share2 size={14} />
                Share
              </button>
              <button
                onClick={() => handleDownload(resolveImageUrl(selectedGreeting.fileName), selectedGreeting.fileName)}
                className="flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-500/90 px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm"
                disabled={isProcessing}
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
        </div>
      </ModalWrapper>

      {/* Upload Dialog */}
      <GreetingFormDialog
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onRefetch={refetch}
        initialCategory={selectedCategory}
      />
    </div >
  );
};

export default Greetings;
