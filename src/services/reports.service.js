import apiClient from "../config/apiClient";

export const fetchReportUsers = async (active, userId, designation, startDate, endDate) => {
    try {
        const response = await apiClient.get(`/report-users`, {
            params: { active, userId, designation, startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report users:", error);
        throw error;
    }
};

export const fetchReportCompanyLinkedUsers = async (active, designation, startDate, endDate) => {
    try {
        const response = await apiClient.get(`/report-company-linked-users`, {
            params: { active, designation, startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching company users:", error);
        throw error;
    }
};

export const fetchReportPlots = async (status, project, startDate, endDate) => {
    try {
        const response = await apiClient.get(`/report-available-plots`, {
            params: { project, status, startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report plots:", error);
        throw error;
    }
};

export const fetchReportSales = async (id, status, project, startDate, endDate, teamHeadId) => {
    try {
        const response = await apiClient.get(`/report-sales`, {
            params: { id, project, status, startDate, endDate, teamHeadId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report sales:", error);
        throw error;
    }
};
