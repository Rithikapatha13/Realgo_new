import apiClient from "../config/apiClient";

export const getUsersNames = async (params = {}) => {
    const { data } = await apiClient.get(`/user/names`, { params });
    return data;
};

export const getPotentialParents = async () => {
    const { data } = await apiClient.get(`/user/potential-parents`);
    return data;
};

export const getTeamTree = async (id, role) => {
    try {
        const params = {};
        if (id) params.id = id;
        if (role) params.role = role;

        const { data } = await apiClient.get(`/tree/associates-tree`, { params });
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
    const { data } = await apiClient.get(`/user/associates`, {
        params: { page: pageIndex, size: pageSize, name, status, role, username, phone, userAuthId, sortField, sortOrder }
    });
    return data;
};

export const getUserById = async (id) => {
    const { data } = await apiClient.get(`/user/associate/${id}`);
    return data;
};

export const addUser = async (userData) => {
    const { data } = await apiClient.post(`/user/add-associate`, userData);
    return data;
};

export const updateUser = async (userData) => {
    const { data } = await apiClient.post(`/user/add-associate`, userData);
    return data;
};

export const updateUserStatus = async (userData) => {
    const { data } = await apiClient.put(`/user/associate-status`, userData);
    return data;
};

export const promoteUser = async (userData) => {
    const { data } = await apiClient.put(`/user/associate-promote`, userData);
    return data;
};

export const deleteUser = async (id) => {
    const { data } = await apiClient.delete(`/user/associate-delete/${id}`);
    return data;
};

export const resetPassword = async (userData) => {
    const { data } = await apiClient.post(`/user/reset-password`, userData);
    return data;
};
