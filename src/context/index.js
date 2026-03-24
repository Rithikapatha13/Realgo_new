import React, { createContext, useContext } from "react";

/**
 * This context only stores logged-in user data
 * Fixed by using React.createElement to support .js extension in Vite
 */
const UserContext = createContext({
    user: null,
});

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children, value }) => {
    return React.createElement(UserContext.Provider, { value: value }, children);
};
