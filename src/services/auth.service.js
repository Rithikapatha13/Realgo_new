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

export const changepassword = async (phone, companyId, newPassword) => {
  const res = await apiClient.post("/auth/change-password", {
    phone,
    companyId,
    newPassword,
  });

  return res.data;
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return JSON.parse(user);
};

export const getUserType = () => {
  const userType = localStorage.getItem("usertype");
  return userType;
};

export const updateLocalUser = (username, email, image) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...user,
      userName: username ?? user.userName,
      email: email ?? user.email,
      image: image ?? user.image,
    }),
  );
};
