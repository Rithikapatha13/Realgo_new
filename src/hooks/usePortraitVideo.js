import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPortraitVideos, createPortraitVideo, deletePortraitVideo } from "@/services/portraitVideo.service";

export const useGetPortraitVideosData = (params) => {
    return useQuery({
        queryKey: ["portrait-videos", params],
        queryFn: () => getPortraitVideos(params).then(res => res.data),
    });
};

export const useCreatePortraitVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPortraitVideo,
        onSuccess: () => {
            queryClient.invalidateQueries(["portrait-videos"]);
        },
    });
};

export const useDeletePortraitVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePortraitVideo,
        onSuccess: () => {
            queryClient.invalidateQueries(["portrait-videos"]);
        },
    });
};
