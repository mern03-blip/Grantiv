// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LazyComponent from "./LazyComponent";
// import PrivateRoute from "./PrivateRoute";
// import PublicRoute from "./PublicRoute";
// import AuthLayout from "../pages/Auth/AuthLayout/AuthLayout";
// import AdminLayout from '../layout/Layout';

// export const AppLayout = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/auth"
//           element={
//             <PublicRoute>
//               <AuthLayout />
//             </PublicRoute>
//           }
//         >
//           <Route index element={<LazyComponent path="/login" />} />
//           <Route path="login" element={<LazyComponent path="/login" />} />
//           <Route path="signup" element={<LazyComponent path="/signup" />} />
//           <Route path="forget-password" element={<LazyComponent path="/forget-password" />} />
//           <Route path="reset-password" element={<LazyComponent path="/reset-password" />} />
//           <Route path="verify-otp" element={<LazyComponent path="/verify-otp" />} />
//         </Route>

//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <AdminLayout />
//             </PrivateRoute>
//           }>
//           <Route index element={<LazyComponent path="/" />} />
//           {/* <Route path="dashboard" element={<LazyComponent path="/" />} /> */}
//           <Route path="dashboard/:id" element={<LazyComponent path="/dashboard/:id" />} />
//           <Route path="find-grants" element={<LazyComponent path="/find-grants" />} />
//           <Route path="my-grants" element={<LazyComponent path="/my-grants" />} />
//           <Route path="settings" element={<LazyComponent path="/settings" />} />
//           <Route path="teams" element={<LazyComponent path="/teams" />} />
//           <Route path="*" element={<LazyComponent path="/" />} />
//           {/* <Route path="ai-assistant" element={<LazyComponent path="/ai-assistant" />} /> */}
//         </Route>
//         {/* <Route path="ai-assistant" element={<LazyComponent path="/ai-assistant" />} /> */}

//         <Route
//           path="/ai-assistant"
//           element={<PrivateRoute><LazyComponent path="/ai-assistant" /></PrivateRoute>}
//         />

//       </Routes>
//     </Router>
//   );
// };




import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LazyComponent from "./LazyComponent";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AuthLayout from "../pages/Auth/AuthLayout/AuthLayout";
import AdminLayout from '../layout/Layout';
import InvitationPage from '../components/invitation/InvitationPage';
import OrganizationPage from '../components/organization/OrganizationPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  const isAiAssistant = location.pathname.startsWith('/ai-assistant');

  const animationKey = isAiAssistant ? location.pathname : 'admin-layout';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="w-full h-full"
      >
        <Routes location={location}>

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

          <Route
            path="/"
            element={<PrivateRoute><AdminLayout /></PrivateRoute>}
          >
            <Route index element={<LazyComponent path="/" />} />
            <Route path="find-grants" element={<LazyComponent path="/find-grants" />} />
            <Route path="find-grants/:id" element={<LazyComponent path="/find-grants/:id" />} />
            <Route path="my-grants" element={<LazyComponent path="/my-grants" />} />
            <Route path="settings" element={<LazyComponent path="/settings" />} />
            <Route path="teams" element={<LazyComponent path="/teams" />} />
            <Route path="*" element={<LazyComponent path="/" />} />
          </Route>

          <Route
            path="/ai-assistant"
            element={<PrivateRoute><LazyComponent path="/ai-assistant" /></PrivateRoute>}
          />
            <Route path="accept-invite/:token" element={<InvitationPage/>} />
            <Route path="organization-page" element={<OrganizationPage/>} />

        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export const AppLayout = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};
