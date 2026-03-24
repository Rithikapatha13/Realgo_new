import axios from "axios";

// Using the same base URL as other services
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

/**
 * Fetch the list of team members
 */
export const getMyTeam = async (params) => {
    const { data } = await axios.get(`${API_URL}/my-team`, {
        headers: getAuthHeader(),
        params
    });
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

        const { data } = await axios.get(`${API_URL}/associates-tree`, {
            headers: getAuthHeader(),
            params: params
        });

        console.log("Tree API Response:", data);
        return data; // Return full data so component can check success/items
    } catch (error) {
        console.error('Error fetching team tree:', error);
        throw error;
    }
};
