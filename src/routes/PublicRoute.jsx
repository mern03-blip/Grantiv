import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;

// import React from "react";
// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const orgId = localStorage.getItem("OrgId");

//   const hasValidToken =
//     token && token !== "undefined" && token !== "null";

//   // 👉 Redirect logic
//   if (hasValidToken && orgId) {
//     // ✅ User has both token + org → go to main dashboard
//     return <Navigate to="/" replace />;
//   } else if (hasValidToken && !orgId) {
//     // ✅ User logged in but no org selected → go to organization page
//     return <Navigate to="/organization-page" replace />;
//   } else {
//     // 🚫 No token → stay on current (public) page
//     return children;
//   }
// };

// export default PublicRoute;
