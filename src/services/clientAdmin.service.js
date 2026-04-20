import apiClient from "../config/apiClient";
const API_URL = "/client-admin";

export const getClientAdminDashboardStats = async () => {
  const res = await apiClient.get(`${API_URL}/dashboard-stats`);
  return res.data;
};
