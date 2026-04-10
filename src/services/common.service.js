import apiClient from "../config/apiClient";

/**
 * Update profile
 */
export const updateProfile = async (data) => {
  const res = await apiClient.post("/common/update-profile", {
    ...data,
    userType: data.userType || (data.isAdmin ? "admin" : "user"),
  });
  return res.data;
};

/**
 * Upload file (used by Greetings page)
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/common/upload-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
