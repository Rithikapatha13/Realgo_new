import apiClient from "../config/apiClient";

export const getAllRoles = async () => {
    const { data } = await apiClient.get(`/roles`);
    return data;
};

export const getRoleById = async (id) => {
    const { data } = await apiClient.get(`/roles/${id}`);
    return data;
};

export const addRole = async (roleData) => {
    const { data } = await apiClient.post(`/roles`, roleData);
    return data;
};

export const updateRole = async (id, roleData) => {
    const { data } = await apiClient.put(`/roles/${id}`, roleData);
    return data;
};

export const deleteRole = async (id) => {
    const { data } = await apiClient.delete(`/roles/${id}`);
    return data;
};
