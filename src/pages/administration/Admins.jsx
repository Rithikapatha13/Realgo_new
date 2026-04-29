import React, { useState, useEffect } from "react";
import { Plus, Search, RotateCcw, MoreVertical, Eye, Pencil, Trash2, CheckCircle, Clock, XCircle, PauseCircle, Shield } from "lucide-react";
import { useGetAdmins, useDeleteAdminUser, useUpdateAdminStatus } from "@/hooks/useAdmin";
import ModalWrapper from "@/components/Common/ModalWrapper";
import DeleteConfirmationModal from "@/components/Common/DeleteConfirmationModal";
import AdminForm from "./AdminForm";
import Button from "@/components/Common/Button";
import { toast } from "react-hot-toast";
import { toTitleCase } from "@/constants/common";
import { resolveImageUrl } from "@/utils/common";

const StatusBadge = ({ status }) => {
    let styles = "bg-gray-100 text-gray-700";
    let Icon = Clock;

    switch (status?.toUpperCase()) {
        case 'VERIFIED':
        case 'ACTIVE':
            styles = "bg-green-100 text-green-700";
            Icon = CheckCircle;
            break;
        case 'HOLD':
        case 'INACTIVE':
            styles = "bg-yellow-100 text-yellow-700";
            Icon = PauseCircle;
            break;
        case 'REJECT':
            styles = "bg-red-100 text-red-700";
            Icon = XCircle;
            break;
        case 'PENDING':
            styles = "bg-blue-100 text-blue-700";
            Icon = Clock;
            break;
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${styles}`}>
            <Icon size={10} />
            {status}
        </span>
    );
};

export default function Admins() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState("Create");
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [adminToDelete, setAdminToDelete] = useState(null);

    const { 
        data, 
        isLoading, 
        refetch, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useGetAdmins(12, searchTerm);

    const deleteAdminMutation = useDeleteAdminUser();
    const updateStatusMutation = useUpdateAdminStatus();

    const admins = data?.pages.flatMap(page => page.items) || [];

    const handleAdd = () => {
        setSelectedAdmin(null);
        setModalAction("Create");
        setIsModalOpen(true);
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setModalAction("Update");
        setIsModalOpen(true);
    };

    const handleView = (admin) => {
        setSelectedAdmin(admin);
        setModalAction("View");
        setIsModalOpen(true);
    };

    const handleDelete = (admin) => {
        setAdminToDelete(admin);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteAdminMutation.mutateAsync(adminToDelete.id);
            toast.success("Admin deleted successfully");
            setIsDeleteModalOpen(false);
            refetch();
        } catch (error) {
            toast.error("Failed to delete admin");
        }
    };

    const toggleStatus = async (admin) => {
        const newStatus = admin.status === 'VERIFIED' ? 'INACTIVE' : 'VERIFIED';
        try {
            await updateStatusMutation.mutateAsync({ id: admin.id, status: newStatus });
            toast.success(`Admin marked as ${newStatus}`);
            refetch();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Administration & Staff</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage administrative personnel and module heads</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            className="h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="primary" onClick={handleAdd} className="flex items-center gap-2 h-11">
                        <Plus size={18} />
                        <span>Add Admin</span>
                    </Button>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {admins.map((admin) => (
                    <div key={admin.id} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div className="p-5 flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-full border-4 border-slate-50 p-1">
                                    <img
                                        src={resolveImageUrl(admin.image) || `https://ui-avatars.com/api/?name=${admin.username}&background=6366f1&color=fff`}
                                        className="w-full h-full rounded-full object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1">
                                    <StatusBadge status={admin.status} />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                {toTitleCase(`${admin.firstName || ""} ${admin.lastName || ""}`.trim() || admin.username)}
                            </h3>
                            <p className="text-primary-600 text-[10px] font-black uppercase tracking-widest mt-1">
                                {toTitleCase(admin.role?.displayName || admin.role?.roleName || "Admin")}
                            </p>

                            <div className="mt-4 flex flex-col gap-1 text-xs text-slate-500 font-medium">
                                <p>{admin.phone}</p>
                                <p className="truncate w-full max-w-[200px]">{admin.email || "No email provided"}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                            <button 
                                onClick={() => handleView(admin)}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-100 rounded-xl transition-colors"
                                title="View Details"
                            >
                                <Eye size={18} />
                            </button>

                            <div className="flex gap-1">
                                <button 
                                    onClick={() => handleEdit(admin)}
                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-100 rounded-xl transition-colors"
                                    title="Edit Admin"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(admin)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                                    title="Delete Admin"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {admins.length === 0 && !isLoading && (
                <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No administrators found.</p>
                </div>
            )}

            {hasNextPage && (
                <div className="mt-10 text-center">
                    <Button 
                        variant="secondary" 
                        onClick={() => fetchNextPage()} 
                        loading={isFetchingNextPage}
                    >
                        Load More Staff
                    </Button>
                </div>
            )}

            <ModalWrapper
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${modalAction} Administrator`}
                size="3xl"
            >
                <AdminForm
                    item={selectedAdmin}
                    action={modalAction}
                    onClose={() => setIsModalOpen(false)}
                    onRefetch={refetch}
                />
            </ModalWrapper>

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Remove Administrator"
                itemName={adminToDelete?.username}
                warningText="This action will permanently revoke their access to the administration panel."
                isLoading={deleteAdminMutation.isPending}
            />
        </div>
    );
}
