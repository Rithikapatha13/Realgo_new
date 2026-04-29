import apiClient from "../config/apiClient";

// --- Contributions ---
export const getContributions = async (params) => {
    const response = await apiClient.get("/associate-finance/contributions", { params });
    return response.data;
};

export const createContribution = async (data) => {
    const response = await apiClient.post("/associate-finance/contributions", data);
    return response.data;
};

export const updateContribution = async (id, data) => {
    const response = await apiClient.put(`/associate-finance/contributions/${id}`, data);
    return response.data;
};

export const deleteContribution = async (id) => {
    const response = await apiClient.delete(`/associate-finance/contributions/${id}`);
    return response.data;
};

// --- Expenses ---
export const getExpenses = async (params) => {
    const response = await apiClient.get("/associate-finance/expenses", { params });
    return response.data;
};

export const createExpense = async (data) => {
    const response = await apiClient.post("/associate-finance/expenses", data);
    return response.data;
};

// --- Payouts ---
export const getPayouts = async (params) => {
    const response = await apiClient.get("/associate-finance/payouts", { params });
    return response.data;
};

export const createPayout = async (data) => {
    const response = await apiClient.post("/associate-finance/payouts", data);
    return response.data;
};
