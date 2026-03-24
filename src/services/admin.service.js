import apiClient from "@/config/apiClient";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getAdmins = (params) => {
    return apiClient.get("/admins", {
        params,
        headers: getAuthHeader(),
    });
};

export const addAdminUser = (userData) => {
    return apiClient.post("/add-admin", userData, {
        headers: getAuthHeader(),
    });
};

export const getAdminById = (id) => {
    return apiClient.get(`/admin/${id}`, {
        headers: getAuthHeader(),
    });
};

export const updateAdminUser = (userData) => {
    return apiClient.put("/admin", userData, {
        headers: getAuthHeader(),
    });
};

export const updateAdminStatus = (userData) => {
    return apiClient.put("/admin-status", userData, {
        headers: getAuthHeader(),
    });
};

export const deleteAdminUser = (id) => {
    return apiClient.delete(`/admin/${id}`, {
        headers: getAuthHeader(),
    });
};
