import apiClient from "../config/apiClient";

export const checkUser = async (phone) => {
  try {
    const res = await apiClient.get("/auth/identify/" + phone);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const login = async (phone, companyId, password) => {
  try {
    const res = await apiClient.post("/auth/login", {
      phone,
      companyId,
      password,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
