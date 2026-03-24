import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getAllRoles = async () => {
    const { data } = await axios.get(`${API_URL}/roles`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const getRoleById = async (id) => {
    const { data } = await axios.get(`${API_URL}/roles/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const addRole = async (roleData) => {
    const { data } = await axios.post(`${API_URL}/roles`, roleData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const updateRole = async (id, roleData) => {
    const { data } = await axios.put(`${API_URL}/roles/${id}`, roleData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const deleteRole = async (id) => {
    const { data } = await axios.delete(`${API_URL}/roles/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};
