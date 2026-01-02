import Signup from "../pages/auth/Signup";
import Roles from "../pages/administration/Roles";
import Home from "../pages/Common/Home";
import Profile from "../pages/Common/Profile";

export const publicRoutes = {
  auth: {
    basePath: "", // Change from "/" to empty string!
    routes: [{ path: "signup", component: Signup }],
  },
};

export const routeConfig = {
  Common: {
    basePath: "/",
    allowedRoles: ["admin", "associate", "superAdmin"],
    routes: [
      { path: "", component: Home },
      { path: "/profile", component: Profile },
    ],
  },
};
