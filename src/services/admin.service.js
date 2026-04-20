import apiClient from "@/config/apiClient";

export const getAdmins = (params) => {
    return apiClient.get("/admins", { params });
};

export const addAdminUser = (userData) => {
    return apiClient.post("/add-admin", userData);
};

export const getAdminById = (id) => {
    return apiClient.get(`/admin/${id}`);
};

export const updateAdminUser = (userData) => {
    return apiClient.put("/admin", userData);
};

export const updateAdminStatus = (userData) => {
    return apiClient.put("/admin-status", userData);
};

export const deleteAdminUser = (id) => {
    return apiClient.delete(`/admin/${id}`);
};
