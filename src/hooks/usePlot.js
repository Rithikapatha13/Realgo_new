import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getPlots,
    getPlotById,
    createPlot,
    updatePlot,
    deletePlot,
    updatePlotStatus,
    bookPlot,
    registerPlot,
    updatePlotBooking,
    createBulkPlots,
    getPhasesByProject,
} from "../services/plot.service";

export const useGetPlots = (params = {}) => {
    return useQuery({
        queryKey: ["plots", params],
        queryFn: () => getPlots(params),
    });
};

export const useGetPlotById = (id) => {
    return useQuery({
        queryKey: ["plot", id],
        queryFn: () => getPlotById(id),
        enabled: !!id,
    });
};

export const useCreatePlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPlot,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useUpdatePlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => updatePlot(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useDeletePlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePlot,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useUpdatePlotStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePlotStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useBookPlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bookPlot,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useRegisterPlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: registerPlot,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useUpdatePlotBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePlotBooking,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useCreateBulkPlots = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBulkPlots,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plots"] }),
    });
};

export const useGetPhases = (projectId) => {
    return useQuery({
        queryKey: ["phases", projectId],
        queryFn: () => getPhasesByProject(projectId),
        enabled: !!projectId,
    });
};
