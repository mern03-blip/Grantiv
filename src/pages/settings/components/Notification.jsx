// import React from "react";
// import { getSubscriptionStatus } from "../../../api/endpoints/payment";
// import { updateNotificationSetting } from "../../../api/endpoints/notifications";
// import { useMutation } from "@tanstack/react-query";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../../components/loading/Loader";

// const Notification = () => {
//   const navigate = useNavigate();

//     // --- 1. Fetch Subscription Status (MOVED TO TOP) ---
//   const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery(
//     {
//       queryKey: ["subscription-plan"],
//       queryFn: getSubscriptionStatus,
//     }
//   );

//   const Toggle = ({ label, description, checked, onChange, disabled }) => (
//     <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4 py-3 sm:py-4 border-b border-mercury/30 dark:border-dark-border/50">
//       <div className="flex-1">
//         <p className="text-sm sm:text-base font-semibold text-night dark:text-dark-text">
//           {label}
//         </p>
//         <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mt-0.5 sm:mt-0">
//           {description}
//         </p>
//       </div>
//       <button
//         role="switch"
//         aria-checked={checked}
//         onClick={onChange}
//         disabled={disabled}
//         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
//           checked ? "bg-primary" : "bg-mercury dark:bg-dark-border"
//         } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
//       >
//         <span
//           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//             checked ? "translate-x-6" : "translate-x-1"
//           }`}
//         />
//       </button>
//     </div>
//   );


//     // --- NOW WE CAN USE CONDITIONAL LOGIC (after all hooks) ---

//     const [settings, setSettings] = useState({
//       newGrantMatches: true,
//       deadlineReminders: true,
//       productUpdates: false,
//     });

//     const mutation = useMutation(({ settingKey, isEnabled }) =>
//       updateNotificationSetting(settingKey, isEnabled)
//     );

//     const plan = subscriptionData?.plan || "free";

//   // Show loader while checking subscription
//   if (isLoadingSubscription) {
//     return <Loader />;
//   }

//   // --- Helper Components ---
//   const UpgradeNotice = ({ featureName, onUpgrade }) => (
//     <div className="text-center p-4 sm:p-6 md:p-8 bg-mercury/30 dark:bg-dark-surface/50 rounded-lg border-2 border-dashed border-mercury/80 dark:border-dark-border max-w-2xl mx-auto">
//       <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-night dark:text-dark-text">
//         {featureName}
//       </h2>
//       <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mt-2 mb-3 sm:mb-4">
//         Configuring notification preferences is a premium feature. Upgrade your
//         plan to unlock powerful collaboration tools.
//       </p>
//       <button
//         onClick={onUpgrade}
//         className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors"
//       >
//         View Subscription Plans
//       </button>
//     </div>
//   );

//   if (plan !== "pro") {
//     return (
//       <div className="p-4">
//         <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
//           Notification
//         </h2>
//         <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">
//           This is where you can configure your notification preferences.
//         </p>
//         <UpgradeNotice
//           featureName="Notification"
//           onUpgrade={() => navigate("/settings")}
//         />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">
//         Notification Settings
//       </h3>
//       <div className="max-w-2xl">
//         <Toggle
//           label="New Grant Matches"
//           description="Get notified when our AI finds a grant that fits your profile."
//           checked={!!settings.newGrantMatches}
//           onChange={async () => {
//             const key = "newGrantMatches";
//             const newValue = !settings[key];
//             // optimistic update
//             setSettings((s) => ({ ...s, [key]: newValue }));
//             try {
//               await mutation.mutateAsync({ settingKey: key, isEnabled: newValue });
//             } catch (err) {
//               // revert on error
//               setSettings((s) => ({ ...s, [key]: !newValue }));
//               console.error("Failed to update setting:", err);
//             }
//           }}
//           disabled={mutation.isLoading}
//         />

//         <Toggle
//           label="Deadline Reminders"
//           description="Receive alerts for applications that are nearing their deadline."
//           checked={!!settings.deadlineReminders}
//           onChange={async () => {
//             const key = "deadlineReminders";
//             const newValue = !settings[key];
//             setSettings((s) => ({ ...s, [key]: newValue }));
//             try {
//               await mutation.mutateAsync({ settingKey: key, isEnabled: newValue });
//             } catch (err) {
//               setSettings((s) => ({ ...s, [key]: !newValue }));
//               console.error("Failed to update setting:", err);
//             }
//           }}
//           disabled={mutation.isLoading}
//         />

//         <Toggle
//           label="Product Updates"
//           description="Stay in the loop with new features and announcements."
//           checked={!!settings.productUpdates}
//           onChange={async () => {
//             const key = "productUpdates";
//             const newValue = !settings[key];
//             setSettings((s) => ({ ...s, [key]: newValue }));
//             try {
//               await mutation.mutateAsync({ settingKey: key, isEnabled: newValue });
//             } catch (err) {
//               setSettings((s) => ({ ...s, [key]: !newValue }));
//               console.error("Failed to update setting:", err);
//             }
//           }}
//           disabled={mutation.isLoading}
//         />
//       </div>
//     </div>
//   );
// };

// export default Notification;


import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getSubscriptionStatus } from "../../../api/endpoints/payment";
import { updateNotificationSetting } from "../../../api/endpoints/notifications";
import Loader from "../../../components/loading/Loader";

const Notification = () => {
  // --- ALL HOOKS MUST COME FIRST ---
  const navigate = useNavigate();

  // 1. State (MOVED TO TOP)
  const [settings, setSettings] = useState({
    newGrantMatches: true,
    deadlineReminders: true,
    productUpdates: false,
  });

  // 2. Fetch Subscription Status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription-plan"],
    queryFn: getSubscriptionStatus,
  });

  // 3. Mutation for updating settings
  const mutation = useMutation({
    mutationFn: ({ settingKey, isEnabled }) =>
      updateNotificationSetting(settingKey, isEnabled),
  });

  // --- NOW CONDITIONAL LOGIC ---

  const plan = subscriptionData?.plan || "free";

  // Show loader while checking subscription
  if (isLoadingSubscription) {
    return <Loader />;
  }

  // --- Helper Components ---
  
  const Toggle = ({ label, description, checked, onChange, disabled }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4 py-3 sm:py-4 border-b border-mercury/30 dark:border-dark-border/50">
      <div className="flex-1">
        <p className="text-sm sm:text-base font-semibold text-night dark:text-dark-text">
          {label}
        </p>
        <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mt-0.5 sm:mt-0">
          {description}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-primary" : "bg-mercury dark:bg-dark-border"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const UpgradeNotice = ({ featureName, onUpgrade }) => (
    <div className="text-center p-4 sm:p-6 md:p-8 bg-mercury/30 dark:bg-dark-surface/50 rounded-lg border-2 border-dashed border-mercury/80 dark:border-dark-border max-w-2xl mx-auto">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-night dark:text-dark-text">
        {featureName}
      </h2>
      <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mt-2 mb-3 sm:mb-4">
        Configuring notification preferences is a premium feature. Upgrade your
        plan to unlock powerful collaboration tools.
      </p>
      {/* <button
        onClick={onUpgrade}
        className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors"
      >
        View Subscription Plans
      </button> */}
    </div>
  );

  // Show upgrade notice for non-pro users
  if (plan !== "pro" && plan !== "enterprise" && plan !== "starter") {
    return (
      <div className="p-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
          Notification
        </h2>
        <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">
          This is where you can configure your notification preferences.
        </p>
        <UpgradeNotice
          featureName="Notification"
          onUpgrade={() => navigate("/settings")}
        />
      </div>
    );
  }

  // Main notification settings UI
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">
        Notification Settings
      </h3>
      <div className="max-w-2xl">
        <Toggle
          label="New Grant Matches"
          description="Get notified when our AI finds a grant that fits your profile."
          checked={!!settings.newGrantMatches}
          onChange={async () => {
            const key = "newGrantMatches";
            const newValue = !settings[key];
            // optimistic update
            setSettings((s) => ({ ...s, [key]: newValue }));
            try {
              await mutation.mutateAsync({ settingKey: key, isEnabled: newValue });
            } catch (err) {
              // revert on error
              setSettings((s) => ({ ...s, [key]: !newValue }));
              console.error("Failed to update setting:", err);
            }
          }}
          disabled={mutation.isPending}
        />

        <Toggle
          label="Deadline Reminders"
          description="Receive alerts for applications that are nearing their deadline."
          checked={!!settings.deadlineReminders}
          onChange={async () => {
            const key = "deadlineReminders";
            const newValue = !settings[key];
            setSettings((s) => ({ ...s, [key]: newValue }));
            try {
              await mutation.mutateAsync({ settingKey: key, isEnabled: newValue });
            } catch (err) {
              setSettings((s) => ({ ...s, [key]: !newValue }));
              console.error("Failed to update setting:", err);
            }
          }}
          disabled={mutation.isPending}
        />

        <Toggle
          label="Product Updates"
          description="Stay in the loop with new features and announcements."
          checked={!!settings.productUpdates}
          onChange={async () => {
            const key = "productUpdates";
            const newValue = !settings[key];
            setSettings((s) => ({ ...s, [key]: newValue }));
            try {
              await mutation.mutateAsync({ settingKey: key, isEnabled: newValue });
            } catch (err) {
              setSettings((s) => ({ ...s, [key]: !newValue }));
              console.error("Failed to update setting:", err);
            }
          }}
          disabled={mutation.isPending}
        />
      </div>
    </div>
  );
};

export default Notification;