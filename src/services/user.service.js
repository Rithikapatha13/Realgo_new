import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getUsersNames = async (params = {}) => {
    const { data } = await axios.get(`${API_URL}/user/names`, {
        headers: getAuthHeader(),
        params: params
    });
    return data;
};

export const getPotentialParents = async () => {
    const { data } = await axios.get(`${API_URL}/user/potential-parents`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const getTeamTree = async (id, role) => {
    try {
        const params = {};
        if (id) params.id = id;
        if (role) params.role = role;

        const { data } = await axios.get(`${API_URL}/tree/associates-tree`, {
            headers: getAuthHeader(),
            params: params
        });

        return data;
    } catch (error) {
        console.error('Error fetching team tree:', error);
        throw error;
    }
};

// ==========================================
// ASSOCIATES CRUD ENDPOINTS (For Admin/Pro)
// ==========================================

export const getUsersData = async ({ pageIndex, pageSize, name, status, role, username, phone, userAuthId, sortField, sortOrder }) => {
    const { data } = await axios.get(`${API_URL}/user/associates`, {
        headers: getAuthHeader(),
        params: { page: pageIndex, size: pageSize, name, status, role, username, phone, userAuthId, sortField, sortOrder }
    });
    return data;
};

export const getUserById = async (id) => {
    const { data } = await axios.get(`${API_URL}/user/associate/${id}`, { headers: getAuthHeader() });
    return data;
};

export const addUser = async (userData) => {
    const { data } = await axios.post(`${API_URL}/user/add-associate`, userData, { headers: getAuthHeader() });
    return data;
};

export const updateUser = async (userData) => {
    const { data } = await axios.post(`${API_URL}/user/add-associate`, userData, { headers: getAuthHeader() });
    return data;
};

export const updateUserStatus = async (userData) => {
    const { data } = await axios.put(`${API_URL}/user/associate-status`, userData, { headers: getAuthHeader() });
    return data;
};

export const promoteUser = async (userData) => {
    const { data } = await axios.put(`${API_URL}/user/associate-promote`, userData, { headers: getAuthHeader() });
    return data;
};

export const deleteUser = async (id) => {
    const { data } = await axios.delete(`${API_URL}/user/associate-delete/${id}`, { headers: getAuthHeader() });
    return data;
};

export const resetPassword = async (userData) => {
    const { data } = await axios.post(`${API_URL}/user/reset-password`, userData, { headers: getAuthHeader() });
    return data;
};
