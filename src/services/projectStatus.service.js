import apiClient from "../config/apiClient";

export const getProjectStatuses = async () => {
    const response = await apiClient.get(`/project-statuses`);
    return response.data;
};

export const getProjectStatusById = async (id) => {
    const response = await apiClient.get(`/project-statuses/${id}`);
    return response.data;
};

export const createProjectStatus = async (data) => {
    const response = await apiClient.post(`/project-statuses`, data);
    return response.data;
};

export const updateProjectStatus = async (id, data) => {
    const response = await apiClient.put(`/project-statuses/${id}`, data);
    return response.data;
};

export const deleteProjectStatus = async (id) => {
    const response = await apiClient.delete(`/project-statuses/${id}`);
    return response.data;
};
