import apiClient from "@/config/apiClient";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getCompanies = (params) => {
    return apiClient.get("/superadmin/companies", {
        params,
        headers: getAuthHeader(),
    });
};

export const getCompanyDashboard = () => {
    return apiClient.get("/superadmin/companies/dashboard", {
        headers: getAuthHeader(),
    });
};

export const createCompany = (companyData) => {
    return apiClient.post("/superadmin/companies", companyData, {
        headers: getAuthHeader(),
    });
};

export const getCompanyById = (id) => {
    return apiClient.get(`/superadmin/companies/${id}`, {
        headers: getAuthHeader(),
    });
};

export const updateCompany = (id, companyData) => {
    return apiClient.put(`/superadmin/companies/${id}`, companyData, {
        headers: getAuthHeader(),
    });
};

export const deleteCompany = (id) => {
    return apiClient.delete(`/superadmin/companies/${id}`, {
        headers: getAuthHeader(),
    });
};
