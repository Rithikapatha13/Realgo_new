import apiClient from "@/config/apiClient";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getGreetings = (file_category) => {
    return apiClient.get("/greetings", {
        params: { file_category },
        headers: getAuthHeader(),
    });
};

export const getGreetingsData = ({ pageIndex, pageSize, file_category }) => {
    return apiClient.get("/greetings", {
        params: {
            page: pageIndex,
            size: pageSize,
            file_category,
        },
        headers: getAuthHeader(),
    });
};

export const getInactiveGreetingsData = ({ month, year }) => {
    return apiClient.get("/inactive-greetings", {
        params: { month, year },
        headers: getAuthHeader(),
    });
};

export const addGreetings = (data) => {
    return apiClient.post("/upload-greetings", data, {
        headers: getAuthHeader(),
    });
};

export const deleteGreetings = (data) => {
    return apiClient.post("/gallery-delete", data, {
        headers: getAuthHeader(),
    });
};
