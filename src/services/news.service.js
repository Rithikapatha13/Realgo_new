import apiClient from "../config/apiClient";

export const getNews = async (params) => {
    const { data } = await apiClient.get(`/news`, { params });
    return data;
};

export const getDailyNews = async (params) => {
    const { data } = await apiClient.get(`/news?type=DAILY`, { params });
    return data;
};

export const getNewsById = async (id) => {
    const { data } = await apiClient.get(`/news/${id}`);
    return data;
};

export const createNews = async (news) => {
    const { data } = await apiClient.post(`/news`, news);
    return data;
};

export const deleteNews = async (id) => {
    const { data } = await apiClient.delete(`/news/${id}`);
    return data;
};
