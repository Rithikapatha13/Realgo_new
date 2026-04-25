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

/**
 * Get consolidated home page stats
 * @param {string} projectId Optional project ID to filter plot stats
 */
export const getHomeStats = async (projectId = "") => {
  const res = await apiClient.get("/common/home-stats", {
    params: { projectId }
  });
  return res.data;
};
/**
 * Upload excel file for bulk imports
 */
export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
