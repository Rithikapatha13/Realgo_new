import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getVideos = async (params) => {
    const { data } = await axios.get(`${API_URL}/videos`, {
        headers: getAuthHeader(),
        params,
    });
    return data;
};

export const createVideo = async (video) => {
    const { data } = await axios.post(`${API_URL}/videos`, video, {
        headers: getAuthHeader(),
    });
    return data;
};

export const deleteVideo = async (id) => {
    const { data } = await axios.delete(`${API_URL}/videos/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};
