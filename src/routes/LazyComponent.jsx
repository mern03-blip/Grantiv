import React, { Suspense, lazy } from "react";
import Loading from "../components/loading/Loading";

// Map of paths to lazy-loaded components
const componentMap = {
  // login
  "/login": lazy(() => import("../pages/Auth/Login")),
  "/signup": lazy(() => import("../pages/Auth/SignUp")),
  "/forget-password": lazy(() => import("../pages/Auth/ForgetPassword")),
  "/reset-password": lazy(() => import("../pages/Auth/ResetPassword")),
  "/verify-otp": lazy(() => import("../pages/Auth/OtpScreen")),

  // dashboard (commented for now)
  "/": lazy(() => import("../pages/dashboard/Dashboard")),
  // "/dashboard/:id": lazy(() => import("../components/modals/GrantsDetail")),
  // "/editUserDetail/:id": lazy(() => import("../pages/dashboard/editUserDetail")),

  // Find-Grants
  "/find-grants": lazy(() => import("../pages/findgrants/FindGrants")),
  "/find-grants/:id": lazy(() => import("../components/modals/GrantsDetail")),
  // "/associate": lazy(() => import("../pages/associate/AssociateStack")),
  // "/associateDetail/:id": lazy(() => import("../pages/associate/associateDetail")),
  // "/editProfileAssociate/:id": lazy(() => import("../pages/associate/editProfileAssociate")),

  // MyGrants
  "/my-grants": lazy(() => import("../pages/mygrants/MyGrants")),

  // MyGrants
  "/settings": lazy(() => import("../pages/settings/Settings")),


  // MyGrants
  "/teams": lazy(() => import("../pages/teams/TeamsView")),
  // "/accept-invite": lazy(() => import("../components/invitation/InvitationPage")),


  // AiAssistant
  "/ai-assistant": lazy(() => import("../pages/ai_assistant/AIAssistant")),
};

const LazyComponent = ({ path }) => {
  const Component = componentMap[path];
  if (!Component) {
    return <div>Component not found</div>;
  }
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export default LazyComponent;