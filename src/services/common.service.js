import apiClient from "../config/apiClient";

/**
 * Update profile
 */
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
