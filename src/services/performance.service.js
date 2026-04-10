import apiClient from "../config/apiClient";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getPerformanceStats = async () => {
  const res = await apiClient.get("/performance/stats", {
    headers: getAuthHeader(),
  });
  return res.data;
};
