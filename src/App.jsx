import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { ConfigRoutes } from "./components/routing/RoutesConfig";
import { publicRoutes, routeConfig } from "./constants/routeConfig";
import { Toaster } from "react-hot-toast";
import { getUser, getUserType } from "./services/auth.service";
// import { getUser } from "./services/auth.service";
// import Snowfall from "react-snowfall";

function App() {
  const user = getUser();
  const userType = getUserType();
  const userRole = user?.role?.toLowerCase() || null;

  // Add this check - if no valid user, don't pass userRole at all
  const isAuthenticated = user && user.role;

  return (
    <BrowserRouter>
      <Toaster />
      {/* <Snowfall /> */}
      <Routes>
        {/* Public routes - no Layout */}
        <Route
          path="/auth/*"
          element={<ConfigRoutes config={publicRoutes} />}
        />

        {/* Protected routes - with Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <ConfigRoutes
                config={routeConfig}
                userRole={isAuthenticated ? userType.toLowerCase() : null}
              />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
