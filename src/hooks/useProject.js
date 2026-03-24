import { useQuery } from "@tanstack/react-query";
import { getProjectById, getProjects } from "../services/project.service";

export const useGetAllProjects = (params = {}) => {
    return useQuery({
        queryKey: ["projects", params],
        queryFn: () => getProjects(params),
    });
};

export const useGetProjectById = (id) => {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: () => getProjectById(id),
        enabled: !!id,
    });
};
