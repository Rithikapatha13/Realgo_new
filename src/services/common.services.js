import apiClient from "../config/apiClient";

export const updateProfile = async (id, username, image, email, isAdmin) => {
  const res = await apiClient.post("/common/update-profile", {
    username,
    image,
    email,
    id,
    isAdmin,
  });
  return res.data;
};
