import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LazyComponent from "./LazyComponent";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AuthLayout from "../pages/Auth/AuthLayout/AuthLayout";
import AdminLayout from '../layout/Layout';
import InvitationPage from '../components/invitation/InvitationPage';

const AnimatedRoutes = () => {

  return (
    <Routes>

      {/* Auth Routes */}
      <Route
        path="/auth"
        element={<PublicRoute><AuthLayout /></PublicRoute>}
      >
        <Route index element={<LazyComponent path="/login" />} />
        <Route path="login" element={<LazyComponent path="/login" />} />
        <Route path="signup" element={<LazyComponent path="/signup" />} />
        <Route path="forget-password" element={<LazyComponent path="/forget-password" />} />
        <Route path="reset-password" element={<LazyComponent path="/reset-password" />} />
        <Route path="verify-otp" element={<LazyComponent path="/verify-otp" />} />
      </Route>

      {/* Private Routes */}
      <Route
        path="/"
        element={<PrivateRoute><AdminLayout /></PrivateRoute>}
      >
        <Route index element={<LazyComponent path="/" />} />
        <Route path="find-grants" element={<LazyComponent path="/find-grants" />} />
        <Route path="find-grants/:id" element={<LazyComponent path="/find-grants/:id" />} />
        <Route path="my-grants" element={<LazyComponent path="/my-grants" />} />
        <Route path="grant-application" element={<LazyComponent path="/grant-application" />} />
        <Route path="settings" element={<LazyComponent path="/settings" />} />
        <Route path="teams" element={<LazyComponent path="/teams" />} />
        <Route path="ai-assistant" element={<LazyComponent path="/ai-assistant" />} />
        <Route path="*" element={<LazyComponent path="/" />} />
      </Route>

      {/* Others Routes */}
      <Route path="accept-invite/:token" element={<InvitationPage />} />
      <Route path="organization-page" element={<LazyComponent path="/organization-page"></LazyComponent>} />
      <Route path="payment" element={<LazyComponent path="/payment"></LazyComponent>} />

    </Routes>
  );
};

export const AppLayout = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};