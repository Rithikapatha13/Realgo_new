import apiClient from "../config/apiClient";

export const getFollowups = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
      params.append(key, filters[key]);
    }
  });
  const { data } = await apiClient.get(`/followups?${params.toString()}`);
  return data;
};

export const getTodaysFollowups = async () => {
  const { data } = await apiClient.get("/followups/today");
  return data;
};

export const getFollowupById = async (id) => {
  const { data } = await apiClient.get(`/followups/${id}`);
  return data;
};

export const addFollowup = async (payload) => {
  const { data } = await apiClient.post("/followups", payload);
  return data;
};

export const updateFollowup = async (payload) => {
  const { data } = await apiClient.put("/followups", payload);
  return data;
};

export const updateFollowupStatus = async (id, status) => {
  const { data } = await apiClient.put("/followups/status", { id, followup_status: status });
  return data;
};

export const deleteFollowup = async (id) => {
  const { data } = await apiClient.delete(`/followups/${id}`);
  return data;
};
