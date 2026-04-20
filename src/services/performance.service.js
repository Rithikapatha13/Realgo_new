import apiClient from "../config/apiClient";

export const getPerformanceStats = async () => {
  const res = await apiClient.get("/performance/stats");
  return res.data;
};

/**
 * Fetch telecaller-specific performance data.
 * @param {object} params
 * @param {string} [params.telecallerId]  - filter by a specific telecaller ID (optional)
 * @param {string} [params.startDate]     - ISO date string (optional)
 * @param {string} [params.endDate]       - ISO date string (optional)
 */
export const getTelecallerPerformance = async (params = {}) => {
  const res = await apiClient.get("/performance/telecaller", {
    params
  });
  return res.data;
};
