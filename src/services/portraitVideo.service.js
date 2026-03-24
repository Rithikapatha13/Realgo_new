import apiClient from "@/config/apiClient";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getPortraitVideos = (params) => {
    return apiClient.get("/portrait-videos", {
        params,
        headers: getAuthHeader(),
    });
};

export const createPortraitVideo = (data) => {
    return apiClient.post("/portrait-videos", data, {
        headers: getAuthHeader(),
    });
};

export const deletePortraitVideo = (id) => {
    return apiClient.delete(`/portrait-videos/${id}`, {
        headers: getAuthHeader(),
    });
};
