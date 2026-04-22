import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getSiteVisits = async (userId = null) => {
    const params = {};
    if (userId) {
        params.userId = userId;
    }
    const { data } = await axios.get(`${API_URL}/site-visit`, {
        headers: getAuthHeader(),
        params
    });
    return data;
};
