import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getShowcases = async (params) => {
    const { data } = await axios.get(`${API_URL}/showcases`, {
        headers: getAuthHeader(),
        params,
    });
    return data;
};

export const createShowcase = async (showcase) => {
    const { data } = await axios.post(`${API_URL}/showcases`, showcase, {
        headers: getAuthHeader(),
    });
    return data;
};

export const deleteShowcase = async (id) => {
    const { data } = await axios.delete(`${API_URL}/showcases/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};
