import { useState, useEffect, useRef } from "react";
import { MoreVertical, Search, Trash2, UserCog, CheckCircle, Clock, XCircle, Loader2, UserPlus } from "lucide-react";
import { useGetAdmins, useDeleteAdminUser, useUpdateAdminStatus } from "@/hooks/useAdmin";
import ModalWrapper from "@/components/Common/ModalWrapper";
import AdminForm from "./AdminForm";
import { resolveImageUrl } from "@/utils/common";
import { getUserType } from "@/services/auth.service";
import { toast } from "react-hot-toast";

export default function Admin() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const userType = getUserType();
  const isSuperAdmin = userType?.toLowerCase() === "superadmin";

  const PAGE_SIZE = 12;
  const lastElementRef = useRef(null);

  // Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetAdmins(PAGE_SIZE, debouncedSearch);

  const deleteAdminMutation = useDeleteAdminUser();
  const updateStatusMutation = useUpdateAdminStatus();

  const admins = data?.pages?.flatMap((page) => page.items) || [];

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsFormOpen(true);
    setOpenMenuId(null);
  };

  const handleAdd = () => {
    setSelectedAdmin(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteAdminMutation.mutateAsync(selectedAdmin.id);
      toast.success("Admin deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  };

  const toggleStatus = async (admin) => {
    const newStatus = admin.status === "VERIFIED" ? "PENDING" : "VERIFIED";
    try {
      await updateStatusMutation.mutateAsync({ id: admin.id, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setOpenMenuId(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      VERIFIED: { color: "text-green-600 bg-green-50", icon: CheckCircle, label: "VERIFIED" },
      PENDING: { color: "text-amber-600 bg-amber-50", icon: Clock, label: "PENDING" },
      NONE: { color: "text-slate-500 bg-slate-50", icon: XCircle, label: "NONE" },
    };
    const config = configs[status] || configs.NONE;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50/50">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrators</h1>
          <p className="text-slate-500 text-sm mt-1">Manage platform administrators and their permissions</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium w-full sm:w-auto"
          >
            <UserPlus size={18} />
            Add Admin
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        <button
          onClick={() => setSearch("")}
          className="text-slate-500 hover:text-red-500 text-sm font-medium transition-colors"
        >
          ✕ Clear Filters
        </button>
      </div>

      {/* ADMIN GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-medium">Loading administrators...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-medium">Error loading administrators. Please try again.</p>
          <button onClick={() => refetch()} className="mt-4 text-indigo-600 underline">Retry</button>
        </div>
      ) : admins.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCog className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No admins found</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-1">We couldn't find any administrators matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {admins.map((admin, index) => (
            <div
              key={admin.id}
              ref={index === admins.length - 1 ? lastElementRef : null}
              className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative"
            >
              {/* MENU TOGGLE */}
              <button
                onClick={() => setOpenMenuId(openMenuId === admin.id ? null : admin.id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <MoreVertical size={18} />
              </button>

              {/* DROPDOWN MENU */}
              {openMenuId === admin.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute top-12 right-4 bg-white border border-slate-100 rounded-xl shadow-xl w-48 z-20 py-1.5 animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <UserCog size={16} className="text-indigo-500" />
                      Edit Details
                    </button>
                    <button
                      onClick={() => toggleStatus(admin)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle size={16} className="text-emerald-500" />
                      Toggle Status
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete Admin
                    </button>
                  </div>
                </>
              )}

              {/* CARD CONTENT */}
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-inner">
                    {admin.image ? (
                      <img
                        src={resolveImageUrl(admin.image)}
                        alt={admin.username}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-slate-300 italic">
                        {admin.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full p-0.5 shadow-sm">
                    <div className={`w-full h-full rounded-full ${admin.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {admin.firstName} {admin.lastName}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      @{admin.username}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-[13px] text-slate-600 flex items-center gap-2">
                      <span className="text-slate-400">📞</span> {admin.phone}
                    </p>
                    <p className="text-[13px] text-slate-600 flex items-center gap-2 truncate">
                      <span className="text-slate-400">✉️</span> {admin.email || "N/A"}
                    </p>
                    <div className="pt-2">
                      <StatusBadge status={admin.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold tracking-tight text-slate-400 uppercase">
                <span>{admin.role?.roleName || "ADMIN"}</span>
                <span>Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INFINITE SCROLL LOADER */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      )}

      {/* FORM MODAL */}
      <ModalWrapper
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedAdmin ? "Update Administrator" : "Add Administrator"}
        width="max-w-2xl"
      >
        <AdminForm
          action={selectedAdmin ? "Update" : "Add"}
          item={selectedAdmin}
          onClose={() => setIsFormOpen(false)}
          onRefetch={refetch}
        />
      </ModalWrapper>

      {/* DELETE CONFIRMATION */}
      <ModalWrapper
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Administrator"
        width="max-w-md"
      >
        <div className="text-center py-4">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
          <p className="text-slate-500 mt-2">
            You are about to delete <span className="font-bold text-slate-800">@{selectedAdmin?.username}</span>.
            This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-100"
            >
              Delete Admin
            </button>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}
