
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



// Other way
// import { useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import { useEffect } from "react";

// const PrivateRoute = ({ children }) => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     }
//   }, [token, navigate]);

//   return token ? children : null;
// };

// PrivateRoute.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default PrivateRoute;

