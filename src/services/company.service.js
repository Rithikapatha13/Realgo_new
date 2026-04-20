import apiClient from "@/config/apiClient";

export const getCompanies = (params) => {
    return apiClient.get("/superadmin/companies", { params });
};

export const getCompanyDashboard = () => {
    return apiClient.get("/superadmin/companies/dashboard");
};

export const createCompany = (companyData) => {
    return apiClient.post("/superadmin/companies", companyData);
};

export const getCompanyById = (id) => {
    return apiClient.get(`/superadmin/companies/${id}`);
};

export const updateCompany = (id, companyData) => {
    return apiClient.put(`/superadmin/companies/${id}`, companyData);
};

export const deleteCompany = (id) => {
    return apiClient.delete(`/superadmin/companies/${id}`);
};
