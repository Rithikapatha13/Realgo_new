import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as phaseService from "../services/phase.service";
import { toast } from "react-hot-toast";

export const useGetPhases = (params = {}) => {
    return useQuery({
        queryKey: ["phases", params],
        queryFn: () => phaseService.getPhases(params),
    });
};

export const useGetPhasesByProject = (projectId) => {
    return useQuery({
        queryKey: ["phases", { projectId }],
        queryFn: () => phaseService.getPhases({ projectId }),
        enabled: !!projectId,
    });
};

export const useGetPhaseById = (id) => {
    return useQuery({
        queryKey: ["phase", id],
        queryFn: () => phaseService.getPhaseById(id),
        enabled: !!id,
    });
};

export const useCreatePhase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: phaseService.createPhase,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["phases"] });
            toast.success(data.message || "Phase created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error creating phase");
        },
    });
};

export const useUpdatePhase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => phaseService.updatePhase(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["phases"] });
            toast.success(data.message || "Phase updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error updating phase");
        },
    });
};

export const useDeletePhase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: phaseService.deletePhase,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["phases"] });
            toast.success(data.message || "Phase deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error deleting phase");
        },
    });
};
