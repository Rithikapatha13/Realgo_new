import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical, Search, Plus, Filter, SlidersHorizontal, X,
  UserPlus, Shield, UserCheck, UserX, UserMinus, Eye, Pencil,
  Trash2, Key, TrendingUp, Phone, Contact, Network, Loader2, CheckCircle, Clock, XCircle, Mail, Upload
} from "lucide-react";
import { useGetUsersData, useDeleteUser, useResetPassword } from "@/hooks/useUser";
import { useGetAllRoles } from "@/hooks/useRoles";
import { resolveImageUrl } from "@/utils/common";
import { getUser } from "@/services/auth.service";
import toast from "react-hot-toast";

// Dialogs & Forms
import AssociateForm from "./Form/AssociateForm";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import AssociateStatusDialog from "@/components/dialogs/AssociateStatusDialog";
import AssociatePromoteDialog from "@/components/dialogs/AssociatePromoteDialog";
import { ModalWrapper } from "@/components/Common";

const STATUS_CONFIG = {
  VERIFIED: { color: "text-emerald-600 bg-emerald-50", icon: CheckCircle, label: "VERIFIED" },
  PENDING: { color: "text-amber-600 bg-amber-50", icon: Clock, label: "PENDING" },
  REJECT: { color: "text-rose-600 bg-rose-50", icon: XCircle, label: "REJECTED" },
  INACTIVE: { color: "text-slate-500 bg-slate-50", icon: UserMinus, label: "INACTIVE" },
};

export default function Users() {
  const navigate = useNavigate();
  const loggedInUser = getUser();
  const userType = (loggedInUser?.userType || "").toLowerCase();
  const rawRole = (loggedInUser?.roleName || loggedInUser?.role?.roleName || loggedInUser?.role || "").toUpperCase();
  const canManageUsers = 
    userType.includes("admin") || 
    rawRole.includes("ADMIN") || 
    rawRole === "PRO";

  // --- Search & Filters State ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const clearAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setFilterRole("");
    setFilterStatus("");
    setSortOrder("desc");
    setSortField("createdAt");
  };

  const activeFilterCount = [debouncedSearch, filterRole, filterStatus].filter(Boolean).length;

  // --- Data Fetching ---
  const { data: rolesResponse } = useGetAllRoles();
  const roles = rolesResponse?.roles || [];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useGetUsersData({
    pageSize: 12,
    name: debouncedSearch,
    role: filterRole,
    status: filterStatus,
    sortField,
    sortOrder,
  });

  const users = data?.pages.flatMap((page) => page.items) || [];

  // --- Infinite Scroll Observer ---
  const lastElementRef = useRef(null);
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

  // --- UI State ---
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- Dialog States ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formAction, setFormAction] = useState("Create");
  const [selectedUser, setSelectedUser] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: resetPassword } = useResetPassword();

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);

  // --- Handlers ---
  const handleAddAssociate = () => {
    navigate("/users/add");
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormAction("Update");
    setIsFormOpen(true);
    setOpenMenuId(null);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setFormAction("View");
    setIsFormOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      toast.success("Associate deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Failed to delete associate");
    }
  };

  const handleStatusChangeClick = (user) => {
    setSelectedUser(user);
    setIsStatusDialogOpen(true);
    setOpenMenuId(null);
  };

  const statusTabs = [
    { key: "", label: "All Team" },
    { key: "VERIFIED", label: "Verified" },
    { key: "PENDING", label: "Pending" },
    { key: "REJECT", label: "Rejected" },
  ];

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.INACTIVE;
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
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Associates</h1>
          <p className="text-slate-500 text-sm mt-1">Manage network hierarchy and profile verification</p>
        </div>

        <div className="flex items-center gap-2">
          {canManageUsers && (
            <>
              <button
                onClick={handleAddAssociate}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200 active:scale-95 text-sm"
              >
                <Plus size={20} />
                <span>Add Associate</span>
              </button>
              <button
                onClick={() => window.location.href = "/user/add-bulk-associates"}
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95 text-sm"
              >
                <Upload size={20} className="text-indigo-600" />
                <span>Bulk Upload</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full lg:w-auto">
          {statusTabs.map((tab) => (
            <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2
                ${filterStatus === tab.key
                  ? "bg-white border-indigo-600 text-indigo-600 shadow-sm"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
            ${showFilters ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
          <SlidersHorizontal size={16} />
          <span>More Filters</span>
        </button>

        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} className="text-slate-500 hover:text-red-500 text-sm font-medium transition-colors">
            ✕ Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl mb-8 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Position Role</label>
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                <option value="">All Roles</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.displayName || r.roleName}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sort By</label>
              <div className="flex gap-2">
                <select value={sortField} onChange={(e) => setSortField(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                  <option value="createdAt">Newest First</option>
                  <option value="username">By Name</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="aspect-square w-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95">
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSOCIATES GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-medium">Loading associates...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-medium">Error loading associates. Please try again.</p>
          <button onClick={() => refetch()} className="mt-4 text-indigo-600 underline">Retry</button>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserMinus className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No associates found</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-1">We couldn't find any team members matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user, index) => {
            const isLastElement = users.length === index + 1;

            return (
              <div
                key={user.id}
                ref={isLastElement ? lastElementRef : null}
                className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative"
              >
                {/* MENU TOGGLE */}
                {canManageUsers && (
                  <div className="absolute top-4 right-4">
                    <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === user.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute top-10 right-0 bg-white border border-slate-100 rounded-xl shadow-xl w-48 z-20 py-1.5 animate-in fade-in zoom-in duration-200">
                          <button onClick={() => handleView(user)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                            <Eye size={16} className="text-indigo-500" /> View Profile
                          </button>
                          <button onClick={() => handleEdit(user)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                            <Pencil size={16} className="text-indigo-500" /> Edit Details
                          </button>
                          <button onClick={() => handleStatusChangeClick(user)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                            <Shield size={16} className="text-amber-500" /> Update Status
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button onClick={() => handleDeleteClick(user)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                            <Trash2 size={16} /> Delete Associate
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* CARD CONTENT */}
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-inner">
                      {user.image ? (
                        <img src={resolveImageUrl(user.image)} alt={user.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 italic uppercase">
                          {user.username?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full p-0.5 shadow-sm">
                      <div className={`w-full h-full rounded-full ${user.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        ID: {user.userAuthId || "—"}
                      </p>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <p className="text-[13px] text-slate-600 flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" /> {user.phone || "—"}
                      </p>
                      <p className="text-[13px] text-slate-600 flex items-center gap-2 truncate">
                        <Mail size={14} className="text-slate-400" /> {user.email || "—"}
                      </p>
                      <div className="pt-2">
                        <StatusBadge status={user.status} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold tracking-tight text-slate-400 uppercase">
                  <span>{user.role?.displayName || user.role?.roleName || "NO ROLE"}</span>
                  <span>{user.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}` : ""}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      )}

      {/* DIALOGS */}
      <ModalWrapper
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={`${formAction === "Create" ? "Add New" : formAction} Associate`}
        width="max-w-4xl"
      >
        <div className="p-0">
          <AssociateForm
            item={selectedUser}
            action={formAction}
            onClose={() => setIsFormOpen(false)}
            onRefetch={refetch}
          />
        </div>
      </ModalWrapper>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-slate-500 mt-2">
              Are you sure you want to delete <span className="font-bold text-slate-800">@{selectedUser?.username}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-100">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AssociateStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        user={selectedUser}
      />

      <AssociatePromoteDialog
        isOpen={isPromoteDialogOpen}
        onClose={() => setIsPromoteDialogOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
