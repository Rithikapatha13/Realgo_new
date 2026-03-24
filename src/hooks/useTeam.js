import { useQuery } from "@tanstack/react-query";
import { getMyTeam, getTeamTree } from "@/services/team.service";

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
