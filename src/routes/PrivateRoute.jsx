
// import { Navigate, useLocation } from "react-router-dom";
// import React from "react";
// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const isAuthenticated = token && token !== "undefined" && token !== "null";
//   const location = useLocation();

//   return isAuthenticated ? (
//     children
//   ) : (
//     <Navigate to="/auth" state={{ from: location }} replace />
//   );
// };

// export default PrivateRoute;

import { Navigate, useLocation } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const orgName = localStorage.getItem("orgName");

  const isAuthenticated =
    token && token !== "undefined" && token !== "null" &&
    orgId && orgId !== "undefined" && orgId !== "null" &&
    orgName && orgName !== "undefined" && orgName !== "null";

  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};

export default PrivateRoute;


