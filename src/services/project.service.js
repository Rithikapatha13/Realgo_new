import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getAllHighways = async () => {
    const { data } = await axios.get(`${API_URL}/highways`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const getProjects = async (params = {}) => {
    const { data } = await axios.get(`${API_URL}/projects`, {
        params,
        headers: getAuthHeader(),
    });
    return data;
};

export const getProjectById = async (id) => {
    const { data } = await axios.get(`${API_URL}/projects/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const updateProject = async (id, projectData) => {
    const { data } = await axios.put(`${API_URL}/projects/${id}`, projectData, {
        headers: getAuthHeader(),
    });
    return data;
};
