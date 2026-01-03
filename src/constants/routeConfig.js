import Signup from "../pages/auth/Signup";
import Roles from "../pages/administration/Roles";
import Home from "../pages/General/Home";
import Profile from "../pages/General/Profile";
import MyTeam from "../pages/General/MyTeam";
import Users from "./../pages/administration/Users";
import Admin from "./../pages/administration/Admin";
import Reports from "./../pages/General/Reports";
import Greetings from "./../pages/Media/Greetings";
import News from "./../pages/Media/News";
import Showcase from "./../pages/Media/Showcase";
import Videos from "./../pages/Media/Videos";
import Requests from "./../pages/administration/Requests";
import SiteVisits from "../pages/Site/Sitevisits";
import Plots from "./../pages/Ventures/Plots";
import Projects from "./../pages/Ventures/Projects";
import Notifications from "../pages/Notifications/Notifications";


export const publicRoutes = {
  auth: {
    basePath: "", // Change from "/" to empty string!
    routes: [{ path: "signup", component: Signup }],
  },
};

export const routeConfig = {
  General: {
    basePath: "/",
    allowedRoles: ["admin", "associate", "superAdmin"],
    routes: [
      { path: "", component: Home },
      { path: "/profile", component: Profile },
      { path: "/users", component: Users },
      { path: "/myteam", component: MyTeam },
      { path: "/reports", component: Reports },
    ],
  },
  Administration: {
    basePath: "/administration",
    allowedRoles: ["admin", "superAdmin"],
    routes: [
      { path: "/users", component: Users },
      { path: "/admin", component: Admin },
      { path: "/roles", component: Roles },
      { path: "requests", component: Requests },
    ],
  },
  Media: {
    basePath: "/media",
    allowedRoles: ["admin", "associate", "superAdmin"],
    routes: [
      { path: "/greetings", component: Greetings },
      { path: "/news", component: News },
      { path: "/videos", component: Videos },
      { path: "/showcases", component: Showcase },
    ],
  },
  Site: {
    basePath: "/site",
    allowedRoles: ["admin", "associate", "superAdmin"],
    routes: [{ path: "sitevisits", component: SiteVisits }],
  },
  Ventures: {
    basePath: "/ventures",
    allowedRoles: ["admin", "associate", "superAdmin"],
    routes: [
      { path: "plots", component: Plots },
      { path: "Projects", component: Projects },
    ],
  },
  Notifications: {
    basePath: "",
    allowedRoles: ["admin", "associate", "superAdmin"],
    routes: [{ path: "/notifications", component: Notifications }],
  },
};
