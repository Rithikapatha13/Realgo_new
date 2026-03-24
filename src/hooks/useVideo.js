import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVideos, createVideo, deleteVideo } from "@/services/video.service";

export const useGetVideosData = (params) => {
    return useQuery({
        queryKey: ["videos", params],
        queryFn: () => getVideos(params),
    });
};

export const useCreateVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createVideo,
        onSuccess: () => {
            queryClient.invalidateQueries(["videos"]);
        },
    });
};

export const useDeleteVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteVideo,
        onSuccess: () => {
            queryClient.invalidateQueries(["videos"]);
        },
    });
};
