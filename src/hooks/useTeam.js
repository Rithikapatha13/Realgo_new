import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyTeam, getTeamTree, deleteRequestToAdmin, inactiveRequestToAdmin } from "@/services/team.service";

/**
 * Hook to fetch members of the current user's team
 */
export const useGetMyTeam = (params) => {
    return useQuery({
        queryKey: ["my-team", params],
        queryFn: () => getMyTeam(params),
        select: (data) => (data?.items || []),
    });
};

/**
 * Hook to fetch the hierarchical team tree
 */
export const useGetTeamTree = (id, status, roleId) => {
    return useQuery({
        queryKey: ["team-tree", id, status, roleId],
        queryFn: () => getTeamTree(id, status, roleId),
    });
};

export const useDeleteRequestToAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => deleteRequestToAdmin(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-team"] });
        },
    });
};

export const useInactiveRequestToAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => inactiveRequestToAdmin(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-team"] });
        },
    });
};
