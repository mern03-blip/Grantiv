// import { Navigate, useLocation } from "react-router-dom";
// import React from "react";

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const orgId = localStorage.getItem("orgId");
//   const orgName = localStorage.getItem("orgName");

//   const isAuthenticated =
//     token && token !== "undefined" && token !== "null" &&
//     orgId && orgId !== "undefined" && orgId !== "null" &&
//     orgName && orgName !== "undefined" && orgName !== "null";

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
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionStatus } from "../api/endpoints/payment";
import Loader from "../components/loading/Loader";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const orgName = localStorage.getItem("orgName");

  const isAuthenticated =
    token &&
    token !== "undefined" &&
    token !== "null" &&
    orgId &&
    orgId !== "undefined" &&
    orgId !== "null" &&
    orgName &&
    orgName !== "undefined" &&
    orgName !== "null";

  const location = useLocation();

  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ["subscription-plan", orgId],
    queryFn: getSubscriptionStatus,
    enabled: !!isAuthenticated,
  });

  if (isLoading) {
    return <Loader />;
  }

  // ❌ Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // ❌ Subscription inactive
  if (
    subscriptionData?.status !== "active" &&
    subscriptionData?.status !== "trialing"
  ) {
    return <Navigate to="/payment" replace />;
  }

  // ✅ All good
  return children;
};

export default PrivateRoute;
