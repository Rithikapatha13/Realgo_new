import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getRequests = async ({ page = 1, size = 20, status = "", type = "" } = {}) => {
  const { data } = await axios.get(`${API_URL}/requests`, {
    headers: getAuthHeader(),
    params: { page, size, status, type },
  });
  console.log("response :",data);
  return data;
};

export const updateRequestStatus = async (id, status) => {
  const { data } = await axios.put(
    `${API_URL}/requests/${id}/status`,
    { status },
    { headers: getAuthHeader() }
  );
  return data;
};

export const deleteRequest = async (id) => {
  const { data } = await axios.delete(`${API_URL}/requests/${id}`, {
    headers: getAuthHeader(),
  });
  return data;
};
