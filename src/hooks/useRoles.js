import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllRoles, getRoleById, addRole, updateRole, deleteRole } from "@/services/role.service";

export const useGetAllRoles = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: getAllRoles,
    });
};

export const useGetRoleById = (id) => {
    return useQuery({
        queryKey: ["roles", id],
        queryFn: () => getRoleById(id),
        enabled: !!id,
    });
};

export const useAddRole = () => {
    return useMutation({
        mutationFn: addRole,
    });
};

export const useUpdateRole = () => {
    return useMutation({
        mutationFn: ({ id, ...data }) => updateRole(id, data),
    });
};

export const useDeleteRole = () => {
    return useMutation({
        mutationFn: deleteRole,
    });
};
