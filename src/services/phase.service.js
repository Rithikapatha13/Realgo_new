import apiClient from "../config/apiClient";

export const getPhases = async (params = {}) => {
    const response = await apiClient.get(`/phases`, { params });
    return response.data;
};

export const getPhaseById = async (id) => {
    const response = await apiClient.get(`/phases/${id}`);
    return response.data;
};

export const createPhase = async (data) => {
    const response = await apiClient.post(`/phases`, data);
    return response.data;
};

export const updatePhase = async (id, data) => {
    const response = await apiClient.put(`/phases/${id}`, data);
    return response.data;
};

export const deletePhase = async (id) => {
    const response = await apiClient.delete(`/phases/${id}`);
    return response.data;
};
