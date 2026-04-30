import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShowcases, createShowcase, deleteShowcase, updateShowcaseStatus } from "@/services/showcase.service";

export const useGetShowcasesData = (params) => {
    return useQuery({
        queryKey: ["showcases", params],
        queryFn: () => getShowcases(params),
    });
};

export const useCreateShowcase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createShowcase,
        onSuccess: () => {
            queryClient.invalidateQueries(["showcases"]);
        },
    });
};

export const useDeleteShowcase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteShowcase,
        onSuccess: () => {
            queryClient.invalidateQueries(["showcases"]);
        },
    });
};

export const useUpdateShowcaseStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => updateShowcaseStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["showcases"]);
        },
    });
};
