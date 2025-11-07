import React, { Suspense, lazy } from "react";
import Loader from "../components/loading/Loader";

const componentMap = {
  // login
  "/login": lazy(() => import("../pages/Auth/Login")),
  "/signup": lazy(() => import("../pages/Auth/SignUp")),
  "/forget-password": lazy(() => import("../pages/Auth/ForgetPassword")),
  "/reset-password": lazy(() => import("../pages/Auth/ResetPassword")),
  "/verify-otp": lazy(() => import("../pages/Auth/OtpScreen")),

  // dashboard (commented for now)
  "/": lazy(() => import("../pages/dashboard/Dashboard")),

  // Find-Grants
  "/find-grants": lazy(() => import("../pages/findgrants/FindGrants")),
  "/find-grants/:id": lazy(() => import("../components/modals/GrantsDetail")),

  // MyGrants
  "/my-grants": lazy(() => import("../pages/mygrants/MyGrants")),

  // Settings
  "/settings": lazy(() => import("../pages/settings/Settings")),

  // Teams
  "/teams": lazy(() => import("../pages/teams/TeamsView")),

  // AiAssistant
  "/ai-assistant": lazy(() => import("../pages/ai_assistant/AIAssistant")),
  "/organization-page": lazy(() => import("../components/organization/OrganizationPage")),
};

const LazyComponent = ({ path }) => {
  const Component = componentMap[path];
  if (!Component) {
    return <div>Component not found</div>;
  }
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

export default LazyComponent;