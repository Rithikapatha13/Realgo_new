import apiClient from "../config/apiClient";
const API_URL = "/crm";

export const getLeads = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const { data } = await apiClient.get(`${API_URL}/leads?${params}`);
    return data;
};

export const addLead = async (leadData) => {
    const { data } = await apiClient.post(`${API_URL}/leads`, leadData);
    return data;
};

export const updateLeadCall = async (id, payload) => {
    const { data } = await apiClient.patch(`${API_URL}/leads/${id}/call`, payload);
    return data;
};

export const assignLead = async (id, payload) => {
    const { data } = await apiClient.patch(`${API_URL}/leads/${id}/assign`, payload);
    return data;
};

export const getStats = async () => {
    const { data } = await apiClient.get(`${API_URL}/stats`);
    return data;
};

export const getActivities = async () => {
    const { data } = await apiClient.get(`${API_URL}/activities`);
    return data;
};

export const getLeadHistory = async (id) => {
    const { data } = await apiClient.get(`${API_URL}/leads/${id}/history`);
    return data;
};

export const getAssignables = async () => {
    const { data } = await apiClient.get(`${API_URL}/assignables`);
    return data;
};

export const getRecentLeads = async () => {
    const { data } = await apiClient.get(`${API_URL}/leads/recent`);
    return data;
};

export const logMeeting = async (id, payload) => {
    const { data } = await apiClient.post(`${API_URL}/leads/${id}/meeting`, payload);
    return data;
};
export const getRecentMeetings = async () => {
    const { data } = await apiClient.get(`${API_URL}/meetings/recent`);
    return data;
};
