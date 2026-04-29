import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as projectStatusService from "../services/projectStatus.service";
import { toast } from "react-hot-toast";

export const useGetProjectStatuses = () => {
    return useQuery({
        queryKey: ["projectStatuses"],
        queryFn: projectStatusService.getProjectStatuses,
    });
};

export const useGetProjectStatusById = (id) => {
    return useQuery({
        queryKey: ["projectStatus", id],
        queryFn: () => projectStatusService.getProjectStatusById(id),
        enabled: !!id,
    });
};

export const useCreateProjectStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: projectStatusService.createProjectStatus,
        onSuccess: (data) => {
            queryClient.invalidateQueries(["projectStatuses"]);
            toast.success(data.message || "Project status created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error creating project status");
        },
    });
};

export const useUpdateProjectStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => projectStatusService.updateProjectStatus(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["projectStatuses"]);
            toast.success(data.message || "Project status updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error updating project status");
        },
    });
};

export const useDeleteProjectStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: projectStatusService.deleteProjectStatus,
        onSuccess: (data) => {
            queryClient.invalidateQueries(["projectStatuses"]);
            toast.success(data.message || "Project status deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error deleting project status");
        },
    });
};
