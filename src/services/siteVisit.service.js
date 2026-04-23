import API from "@/config/apiClient";

export const getSiteVisits = async (params = {}) => {
  const response = await API.get("/site-visits", { params });
  return response.data;
};

export const getTodaySiteVisits = async (userId) => {
  const response = await API.get("/site-visits/today", { params: { userId } });
  return response.data;
};

export const getSiteVisitById = async (id) => {
  const response = await API.get(`/site-visits/${id}`);
  return response.data;
};

export const createSiteVisit = async (data) => {
  const response = await API.post("/site-visits", data);
  return response.data;
};

export const updateSiteVisit = async (id, data) => {
  const response = await API.put(`/site-visits/${id}`, data);
  return response.data;
};

export const deleteSiteVisit = async (id) => {
  const response = await API.delete(`/site-visits/${id}`);
  return response.data;
};
