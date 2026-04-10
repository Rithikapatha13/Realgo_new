import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/crm";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getLeads = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const { data } = await axios.get(`${API_URL}/leads?${params}`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const addLead = async (leadData) => {
    const { data } = await axios.post(`${API_URL}/leads`, leadData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const updateLeadCall = async (id, payload) => {
    // payload: { status, notes, callbackAt, isAssociateUpdate }
    const { data } = await axios.patch(`${API_URL}/leads/${id}/call`, payload, {
        headers: getAuthHeader(),
    });
    return data;
};

export const assignLead = async (id, payload) => {
    // payload: { telecallerId, associateId }
    const { data } = await axios.patch(`${API_URL}/leads/${id}/assign`, payload, {
        headers: getAuthHeader(),
    });
    return data;
};

export const getStats = async () => {
    const { data } = await axios.get(`${API_URL}/stats`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const getActivities = async () => {
    const { data } = await axios.get(`${API_URL}/activities`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const getLeadHistory = async (id) => {
    const { data } = await axios.get(`${API_URL}/leads/${id}/history`, {
        headers: getAuthHeader(),
    });
    return data;
};
