import apiClient from "../config/apiClient";

export const getAllProjectStatuses = async () => {
    const { data } = await apiClient.get(`/project-statuses`);
    return data;
};

export const getProjects = async (params = {}) => {
    const { data } = await apiClient.get(`/projects`, {
        params
    });
    return data;
};

export const getProjectById = async (id) => {
    const { data } = await apiClient.get(`/projects/${id}`);
    return data;
};

export const updateProject = async (id, projectData) => {
    const { data } = await apiClient.put(`/projects/${id}`, projectData);
    return data;
};
