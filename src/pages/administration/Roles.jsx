import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, Eye, ArrowLeft } from "lucide-react";
import { useGetAllRoles, useDeleteRole } from "@/hooks/useRoles";
import ModalWrapper from "@/components/Common/ModalWrapper";
import DeleteConfirmationModal from "@/components/Common/DeleteConfirmationModal";
import RoleForm from "./RoleForm";
import Button from "@/components/Common/Button";
import { toast } from "react-hot-toast";

export default function Roles() {
  const navigate = useNavigate();
  const { data: rolesResponse, isLoading, refetch } = useGetAllRoles();
  const deleteRoleMutation = useDeleteRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("Create");
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const roles = rolesResponse?.roles || [];

  const handleAdd = () => {
    setSelectedRole(null);
    setModalAction("Create");
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setModalAction("Update");
    setIsModalOpen(true);
  };

  const handleView = (role) => {
    setSelectedRole(role);
    setModalAction("View");
    setIsModalOpen(true);
  };

  const handleDelete = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    
    try {
      await deleteRoleMutation.mutateAsync(roleToDelete.id);
      toast.success(`Role "${roleToDelete.roleName}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
      refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete role");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administration & Roles</h1>
          <p className="text-sm text-slate-500 mt-1">Manage system roles and permissions</p>
        </div>

        <Button
          variant="primary"
          onClick={handleAdd}
          className="sm:ml-auto flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Role</span>
        </Button>
      </div>

      {/* ROLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            {/* TOP INFO */}
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                  {role.roleNo}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${role.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {role.status}
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900 leading-tight">
                {role.roleName}
              </p>
              <p className="text-sm text-slate-500 mt-1 font-medium">{role.displayName}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {role.modules?.slice(0, 3).map(m => (
                  <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                    {m}
                  </span>
                ))}
                {role.modules?.length > 3 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                    +{role.modules.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
              <button
                onClick={() => handleView(role)}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="View Permissions"
              >
                <Eye size={18} />
              </button>

              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(role)}
                  className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit Role"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDelete(role)}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Role"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {roles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No roles found for this company.</p>
            <button onClick={handleAdd} className="mt-4 text-primary-600 font-bold hover:underline">
              Create your first role
            </button>
          </div>
        )}
      </div>

      <ModalWrapper
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalAction} Role`}
      >
        <RoleForm
          role={selectedRole}
          action={modalAction}
          onClose={() => setIsModalOpen(false)}
          onRefetch={refetch}
        />
      </ModalWrapper>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        itemName={roleToDelete?.roleName}
        warningText="This will permanently remove access for all users assigned to this role."
        isLoading={deleteRoleMutation.isPending}
      />
    </div>
  );
}
