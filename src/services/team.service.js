import apiClient from "../config/apiClient";

/**
 * Fetch the list of team members
 */
export const getMyTeam = async (params) => {
    const { data } = await apiClient.get(`/my-team`, { params });
    return data;
};

/**
 * Fetch the hierarchical team tree
 */
export const getTeamTree = async (id, status, roleId) => {
    try {
        const params = {};
        if (id) params.id = id;
        if (status) params.status = status;
        if (roleId) params.roleId = roleId;

        const { data } = await apiClient.get(`/associates-tree`, { params });

        console.log("Tree API Response:", data);
        return data; 
    } catch (error) {
        console.error('Error fetching team tree:', error);
        throw error;
    }
};

export const deleteRequestToAdmin = async (userData) => {
    const { data } = await apiClient.post(`/user/delete-request`, userData);
    return data;
};

export const inactiveRequestToAdmin = async (userData) => {
    const { data } = await apiClient.post(`/user/inactive-request`, userData);
    return data;
};
