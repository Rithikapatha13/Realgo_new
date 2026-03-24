import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const fetchReportUsers = async (active, userId, designation, startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/report-users`, {
            params: { active, userId, designation, startDate, endDate },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report users:", error);
        throw error;
    }
};

export const fetchReportCompanyLinkedUsers = async (active, designation, startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/report-company-linked-users`, {
            params: { active, designation, startDate, endDate },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching company users:", error);
        throw error;
    }
};

export const fetchReportPlots = async (status, project, startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/report-available-plots`, {
            params: { project, status, startDate, endDate },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report plots:", error);
        throw error;
    }
};

export const fetchReportSales = async (id, status, project, startDate, endDate, teamHeadId) => {
    try {
        const response = await axios.get(`${API_URL}/report-sales`, {
            params: { id, project, status, startDate, endDate, teamHeadId },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report sales:", error);
        throw error;
    }
};
