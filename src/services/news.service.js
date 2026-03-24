import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getNews = async (params) => {
    const { data } = await axios.get(`${API_URL}/news`, {
        headers: getAuthHeader(),
        params,
    });
    return data;
};

export const getDailyNews = async (params) => {
    const { data } = await axios.get(`${API_URL}/news?type=DAILY`, {
        headers: getAuthHeader(),
        params,
    });
    return data;
};

export const getNewsById = async (id) => {
    const { data } = await axios.get(`${API_URL}/news/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const createNews = async (news) => {
    const { data } = await axios.post(`${API_URL}/news`, news, {
        headers: getAuthHeader(),
    });
    return data;
};

export const deleteNews = async (id) => {
    const { data } = await axios.delete(`${API_URL}/news/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};
