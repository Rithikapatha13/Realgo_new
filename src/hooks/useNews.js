import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNews, getNewsById, createNews, deleteNews } from "@/services/news.service";

export const useGetNewsData = (params) => {
    return useQuery({
        queryKey: ["news", params],
        queryFn: () => getNews(params),
    });
};

export const useGetNewsById = (id) => {
    return useQuery({
        queryKey: ["news", id],
        queryFn: () => getNewsById(id),
        enabled: !!id,
    });
};

export const useCreateNews = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createNews,
        onSuccess: () => {
            queryClient.invalidateQueries(["news"]);
        },
    });
};

export const useDeleteNews = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteNews,
        onSuccess: () => {
            queryClient.invalidateQueries(["news"]);
        },
    });
};
