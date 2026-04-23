import apiClient from "../config/apiClient";

export const getRemindersData = async (params) => {
  const { data } = await apiClient.get("/api/reminders", { params });
  return data;
};

export const getTodaysReminders = async () => {
  const { data } = await apiClient.get("/api/reminders/today");
  return data;
};

export const getReminderById = async (id) => {
  const { data } = await apiClient.get(`/api/reminders/${id}`);
  return data;
};

export const createReminder = async (payload) => {
  const { data } = await apiClient.post("/api/reminders", payload);
  return data;
};

export const updateReminder = async (payload) => {
  const { data } = await apiClient.put(`/api/reminders`, payload);
  return data;
};

export const updateReminderTime = async (payload) => {
  const { data } = await apiClient.put(`/api/reminders/time`, payload);
  return data;
};

export const deleteReminder = async (id) => {
  const { data } = await apiClient.delete(`/api/reminders/${id}`);
  return data;
};
