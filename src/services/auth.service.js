import apiClient from "../config/apiClient";

export const checkUser = async (phone) => {
  const res = await apiClient.get("/auth/identify/" + phone);

  return res.data;

};

export const login = async (phone, companyId, password) => {

  const res = await apiClient.post("/auth/login", {
    phone,
    companyId,
    password,
  });

  return res.data;

};
