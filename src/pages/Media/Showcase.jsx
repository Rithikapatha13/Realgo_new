import { useState } from "react";
import {
  Plus,
  Search,
  Award,
  Image as ImageIcon,
  Trash2,
  Download,
  Maximize2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useGetShowcasesData, useDeleteShowcase } from "@/hooks/useShowcase";
import { LoadingIndicator } from "@/components";
import { getUser } from "@/services/auth.service";
import toast from "react-hot-toast";
import ShowcaseFormDialog from "@/components/media/ShowcaseFormDialog";

export default function Showcase() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const user = getUser();
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.userType?.toLowerCase() === "admin";

  const { data: showcaseResponse, isLoading, refetch } = useGetShowcasesData({
    category: activeCategory === "ALL" ? undefined : activeCategory
  });

  const deleteMutation = useDeleteShowcase();
  const items = showcaseResponse?.items || [];

  const categories = ["ALL", "CERTIFICATE", "AWARD", "SITE_VISIT", "MARKETING"];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this showcase item?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Item removed from showcase");
        refetch();
      } catch (error) {
        toast.error("Failed to remove item");
      }
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
              Visual <span className="text-primary-500">Showcase</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Our professional milestones, official certifications, and prestigious recognition.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-500/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95 text-sm"
            >
              <Plus size={18} />
              Upload Achievement
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all border ${activeCategory === cat
                ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600"
                }`}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-4">
              <Layers size={32} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Vault is empty</h3>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-bold text-[9px]">Awaiting your success stories</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid mb-6 relative group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
              >
                {/* Visual Content */}
                <div className="relative">
                  {item.fileName ? (
                    <img
                      src={`${import.meta.env.VITE_S3_URL}${item.fileName}`}
                      alt={item.fileCategory}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-50 text-gray-200">
                      <ImageIcon size={48} />
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white hover:bg-primary-500 hover:text-white text-gray-900 h-10 px-3 rounded-xl transition-all font-bold text-[10px] uppercase shadow-lg flex items-center justify-center gap-2">
                        <Download size={14} />
                        Download
                      </button>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-xl flex items-center justify-center transition-all border border-white/20">
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Top Status Indicators */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-secondary-500/10 backdrop-blur-md text-[9px] font-bold text-secondary-500 shadow-sm border border-secondary-500/20 flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 size={10} className="text-secondary-500" />
                    {item.status || "VERIFIED"}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-secondary-500 uppercase tracking-widest">
                      {item.fileCategory.replace("_", " ")}
                    </p>
                    <h4 className="text-xs font-bold text-gray-900 truncate max-w-[140px]">
                      {item.platform || "Official Asset"}
                    </h4>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ShowcaseFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onRefetch={refetch}
      />
    </div>
  );
}
