import apiClient from "../config/apiClient";

export const getPlots = async (params = {}) => {
    const { data } = await apiClient.get(`/plots-list`, {
        params
    });
    return data;
};

export const getPlotById = async (id) => {
    const { data } = await apiClient.get(`/plot/${id}`);
    return data;
};

export const createPlot = async (plotData) => {
    const { data } = await apiClient.post(`/plot`, plotData);
    return data;
};

export const updatePlot = async (id, plotData) => {
    const { data } = await apiClient.put(`/plot/${id}`, plotData);
    return data;
};

export const deletePlot = async (id) => {
    const { data } = await apiClient.delete(`/plot/${id}`);
    return data;
};

export const updatePlotStatus = async (statusData) => {
    const { data } = await apiClient.post(`/plot-status`, statusData);
    return data;
};

export const bookPlot = async (bookingData) => {
    const { data } = await apiClient.post(`/booking-plot`, bookingData);
    return data;
};

export const registerPlot = async (regData) => {
    const { data } = await apiClient.post(`/register-plot`, regData);
    return data;
};

export const updatePlotBooking = async (bookingData) => {
    const { data } = await apiClient.post(`/update-plot-booking`, bookingData);
    return data;
};

export const createBulkPlots = async (plots) => {
    const { data } = await apiClient.post(`/plots-bulk`, { plots });
    return data;
};

export const getPhasesByProject = async (projectId) => {
    const { data } = await apiClient.get(`/phases/${projectId}`);
    return data;
};

export const getPlotsMapData = async (projectId) => {
    const { data } = await apiClient.get(`/plots-map-data/${projectId}`);
    return data;
};

export const importPlotsFromExcel = async (filePath, projectName, projectId, phases) => {
    const { data } = await apiClient.post(`/plots-excel-import`, {
        file_path: filePath,
        projectName,
        projectId,
        phases,
    });
    return data;
};
