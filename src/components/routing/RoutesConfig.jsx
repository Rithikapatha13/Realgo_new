// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";

// export const ConfigRoutes = ({ config, userRole = null }) => {
//   return (
//     <Routes>
//       {Object.entries(config).map(([key, section]) => (
//         <Route
//           key={key}
//           path={`${section.basePath}/*`}
//           element={
//             <Routes>
//               {section.routes.map((route, idx) => (
//                 <Route
//                   key={idx}
//                   path={route.path}
//                   element={
//                     section.allowedRoles && userRole ? (
//                       <ProtectedRoute
//                         component={route.component}
//                         allowedRoles={section.allowedRoles}
//                         userRole={userRole}
//                       />
//                     ) : section.allowedRoles ? (
//                       // If allowedRoles exist but no userRole, redirect
//                       <Navigate to="/auth/login" replace />
//                     ) : (
//                       <route.component />
//                     )
//                   }
//                   index={route.path === ""}
//                 />
//               ))}
//             </Routes>
//           }
//         />
//       ))}
//     </Routes>
//   );
// };

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

export const ConfigRoutes = ({ config, userRole = null }) => {
  return (
    <Routes>
      {Object.values(config).map((section, sectionIdx) =>
        section.routes.map((route, idx) => {
          const Component = route.component;

          const fullPath = `${section.basePath}${route.path}`.replace(
            "//",
            "/"
          );

          return (
            <Route
              key={`${sectionIdx}-${idx}`}
              path={fullPath}
              element={
                section.allowedRoles ? (
                  userRole ? (
                    <ProtectedRoute
                      component={Component}
                      allowedRoles={section.allowedRoles}
                      userRole={userRole}
                    />
                  ) : (
                    <Navigate to="/auth/login" replace />
                  )
                ) : (
                  <Component />
                )
              }
            />
          );
        })
      )}
    </Routes>
  );
};
