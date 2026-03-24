import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    getAdmins,
    addAdminUser,
    getAdminById,
    updateAdminUser,
    updateAdminStatus,
    deleteAdminUser,
} from "@/services/admin.service";

export const useGetAdmins = (pageSize, name) => {
    return useInfiniteQuery({
        queryKey: ["GET_ADMIN_DATA", { name }],
        queryFn: ({ pageParam = 0 }) =>
            getAdmins({
                page: pageParam,
                size: pageSize,
                name,
            }).then(res => res.data),
        getNextPageParam: (lastPage) => {
            const next = lastPage.pageNumber + 1;
            return next * pageSize >= lastPage.total ? null : next;
        },
    });
};

export const useGetAdminById = (id) => {
    return useQuery({
        queryKey: ["GET_ADMIN_BY_ID", id],
        queryFn: () => getAdminById(id).then(res => res.data),
        enabled: !!id,
    });
};

export const useAddAdminUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => addAdminUser(data).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["GET_ADMIN_DATA"] });
        },
    });
};

export const useUpdateAdminUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateAdminUser(data).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["GET_ADMIN_DATA"] });
        },
    });
};

export const useUpdateAdminStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateAdminStatus(data).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["GET_ADMIN_DATA"] });
        },
    });
};

export const useDeleteAdminUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteAdminUser(id).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["GET_ADMIN_DATA"] });
        },
    });
};
