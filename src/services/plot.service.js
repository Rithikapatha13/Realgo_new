import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getPlots = async (params = {}) => {
    const { data } = await axios.get(`${API_URL}/plots-list`, {
        params,
        headers: getAuthHeader(),
    });
    return data;
};

export const getPlotById = async (id) => {
    const { data } = await axios.get(`${API_URL}/plot/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const createPlot = async (plotData) => {
    const { data } = await axios.post(`${API_URL}/plot`, plotData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const updatePlot = async (id, plotData) => {
    const { data } = await axios.put(`${API_URL}/plot/${id}`, plotData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const deletePlot = async (id) => {
    const { data } = await axios.delete(`${API_URL}/plot/${id}`, {
        headers: getAuthHeader(),
    });
    return data;
};

export const updatePlotStatus = async (statusData) => {
    const { data } = await axios.post(`${API_URL}/plot-status`, statusData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const bookPlot = async (bookingData) => {
    const { data } = await axios.post(`${API_URL}/booking-plot`, bookingData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const registerPlot = async (regData) => {
    const { data } = await axios.post(`${API_URL}/register-plot`, regData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const updatePlotBooking = async (bookingData) => {
    const { data } = await axios.post(`${API_URL}/update-plot-booking`, bookingData, {
        headers: getAuthHeader(),
    });
    return data;
};

export const createBulkPlots = async (plots) => {
    const { data } = await axios.post(`${API_URL}/plots-bulk`, { plots }, {
        headers: getAuthHeader(),
    });
    return data;
};

export const getPhasesByProject = async (projectId) => {
    const { data } = await axios.get(`${API_URL}/phases/${projectId}`, {
        headers: getAuthHeader(),
    });
    return data;
};
