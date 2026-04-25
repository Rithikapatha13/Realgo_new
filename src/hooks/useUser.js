import { useQuery } from "@tanstack/react-query";
import { getUsersNames, getTeamTree, getPotentialParents } from "@/services/user.service";

export const useGetUsersNames = (params = {}) => {
    return useQuery({
        queryKey: ["users-names", params],
        queryFn: () => getUsersNames(params),
    });
};

export const useGetPotentialParents = () => {
    return useQuery({
        queryKey: ["potential-parents"],
        queryFn: getPotentialParents,
    });
};

export const useGetTeamTree = (id, role) => {
    return useQuery({
        queryKey: ["team-tree", id, role],
        queryFn: () => getTeamTree(id, role),
    });
};

// ==========================================
// ASSOCIATES CRUD HOOKS
// ==========================================
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    getUsersData,
    getUserById,
    addUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    promoteUser,
    resetPassword
} from "@/services/user.service";

export const useGetUsersData = ({ pageSize, name, status, role, username, phone, userAuthId, sortField, sortOrder }) => {
    return useInfiniteQuery({
        queryKey: ["users-data", { name, status, role, username, phone, userAuthId, sortField, sortOrder, pageSize }],
        queryFn: ({ pageParam = 1 }) =>
            getUsersData({
                pageIndex: pageParam,
                pageSize,
                name,
                status,
                role,
                username,
                phone,
                userAuthId,
                sortField,
                sortOrder,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || !lastPage.items) return undefined;
            // The backend returns pageNumber as the current page. We stop when items length < pageSize.
            const nextPage = Number(lastPage.pageNumber) + 1;
            const currentTotalItemsFetched = allPages.reduce((total, page) => total + (page.items ? page.items.length : 0), 0);
            if (currentTotalItemsFetched >= lastPage.total || lastPage.items.length < pageSize) {
                return undefined;
            }
            return nextPage;
        },
        initialPageParam: 1,
    });
};

export function useGetUserById(id) {
    return useQuery({
        queryKey: ["user-id", id],
        queryFn: () => getUserById(id),
        enabled: !!id,
        refetchOnWindowFocus: false,
    });
}

export function useAddUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => addUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-data"] });
            queryClient.invalidateQueries({ queryKey: ["users-names"] });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => updateUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-data"] });
            queryClient.invalidateQueries({ queryKey: ["users-names"] });
        },
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => updateUserStatus(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-data"] });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-data"] });
            queryClient.invalidateQueries({ queryKey: ["users-names"] });
        },
    });
}

export function usePromoteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => promoteUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-data"] });
        },
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: (userData) => resetPassword(userData),
    });
}
