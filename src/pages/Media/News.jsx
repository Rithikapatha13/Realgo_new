import { useState } from "react";
import {
  Image as ImageIcon,
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  Clock,
  Share2,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetNewsData, useDeleteNews } from "@/hooks/useNews";
import { LoadingIndicator } from "@/components";
import { getUser } from "@/services/auth.service";
import toast from "react-hot-toast";
import NewsFormDialog from "@/components/media/NewsFormDialog";

export default function News() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("DAILY");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const user = getUser();
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.userType?.toLowerCase() === "admin";

  const { data: newsResponse, isLoading, refetch } = useGetNewsData({
    type: activeTab,
    search: searchQuery
  });

  const deleteMutation = useDeleteNews();

  const newsItems = newsResponse?.items || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("News deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete news");
      }
    }
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-10 font-sans">
      
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              News & <span className="text-primary-500">Flash</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Daily updates and industry insights for the modern real estate professional.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-500/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95 text-sm"
              >
                <Plus size={18} />
                Create Post
              </button>
            )}
          </div>
        </div>

        {/* Navigation & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-xl self-start">
            {["DAILY", "GENERAL", "INDUSTRY"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab
                  ? "bg-white text-primary-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                {tab === "DAILY" ? "Daily" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all text-sm outline-none"
            />
          </div>
        </div>

        {/* News Grid */}
        {newsItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-4">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No news articles yet</h3>
            <p className="text-gray-400 text-xs mt-1">Check back later for fresh updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {newsItems.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:border-primary-500/20 hover:shadow-lg hover:shadow-gray-100/50"
              >
                {/* Visual */}
                <div className="aspect-[16/10] relative overflow-hidden rounded-t-2xl bg-gray-50">
                  {item.newsPicture ? (
                    <img
                      src={`${import.meta.env.VITE_S3_URL}${item.newsPicture}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <ImageIcon size={40} />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-bold text-gray-900 shadow-sm border border-gray-100">
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest">
                        {item.type}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium">
                      <Clock size={12} />
                      {item.time || "Recently"}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors">
                        <Share2 size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <NewsFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        type={activeTab}
        onRefetch={refetch}
      />
    </div>
  );
}
