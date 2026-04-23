import apiClient from "../config/apiClient";

export const getNotesData = async (params) => {
  const { data } = await apiClient.get("/api/notes", { params });
  return data;
};

export const getNoteById = async (id) => {
  const { data } = await apiClient.get(`/api/notes/${id}`);
  return data;
};

export const createNote = async (payload) => {
  const { data } = await apiClient.post("/api/notes", payload);
  return data;
};

export const updateNote = async (id, payload) => {
  const { data } = await apiClient.put(`/api/notes/${id}`, payload);
  return data;
};

export const deleteNote = async (id) => {
  const { data } = await apiClient.delete(`/api/notes/${id}`);
  return data;
};
