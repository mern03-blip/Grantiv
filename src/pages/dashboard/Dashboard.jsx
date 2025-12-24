import React, { useState } from "react";
import DashboardOnboarding from "./components/DashboardOnboarding";
import StatCards from "./components/StatCards";
import { AISnapshotCard } from "./components/AISnapshotCard";
import AiRecommendedGrants from "./components/AiRecommendedGrants";
import ActiveProjects from "./components/ActiveProjects";
import ActionCenter from "./components/ActionCenter";

const Dashboard = () => {
  const [profileComplete] = useState(false);
  const [grantFound] = useState(false);
  const [projectStarted] = useState(false);

  // Initialize hasSkippedOnboarding by reading from localStorage immediately
  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState(() => {
    const skippedValue = localStorage.getItem("dashboard-onboarding-skipped");
    return skippedValue === "true";
  });

  const handleSkip = () => {
    localStorage.setItem("dashboard-onboarding-skipped", "true");
    setHasSkippedOnboarding(true);
  };

  // --- Conditional Rendering Logic ---
  const allStepsComplete = profileComplete && grantFound && projectStarted;
  const shouldShowDashboard = allStepsComplete || hasSkippedOnboarding;

  if (shouldShowDashboard) {
    return (
      <div className="min-h-screen bg-alabaster dark:bg-dark-background">
        <div className="max-w-7xl mx-auto p-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-night dark:text-dark-text mb-2">
              Welcom Back!
            </h1>
            <p className="text-night/60 dark:text-dark-textMuted mt-1 tracking-wide">
              Here's your grant-seeking snapshot for{" "}
            </p>
          </div>

          {/* Stats Grid */}
          <div>
            <StatCards />
          </div>

          <div className="flex gap-8">
            <div className="w-[70%]">
              <div className="gap-8 mb-8">
                <AISnapshotCard />
              </div>

              {/* Recommended Grants */}

              <div className="">
                <AiRecommendedGrants />
              </div>

              {/* Tasks Section - Only show if there are tasks */}
              <div className="mt-6">
                <ActiveProjects />
              </div>
            </div>

            <div>
              <ActionCenter />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardOnboarding onSkip={handleSkip} />;
};

export default Dashboard;
