import apiClient from "../config/apiClient";

export const getShowcases = async (params) => {
    const { data } = await apiClient.get(`/showcases`, { params });
    return data;
};

export const createShowcase = async (showcase) => {
    const { data } = await apiClient.post(`/showcases`, showcase);
    return data;
};

export const deleteShowcase = async (id) => {
    const { data } = await apiClient.delete(`/showcases/${id}`);
    return data;
};
