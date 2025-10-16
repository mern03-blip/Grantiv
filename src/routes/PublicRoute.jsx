// import React from "react";
// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const isAuthenticated = token && token !== "undefined" && token !== "null";

//   return isAuthenticated ? <Navigate to="/" replace /> : children;
// };

// export default PublicRoute;


import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const orgName = localStorage.getItem("orgName");

  const isAuthenticated =
    token && token !== "undefined" && token !== "null" &&
    orgId && orgId !== "undefined" && orgId !== "null" &&
    orgName && orgName !== "undefined" && orgName !== "null";

  // If authenticated, redirect to "/" otherwise show the public route content
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;


