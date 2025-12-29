import React from "react";
import PropTypes from "prop-types";
import {
  TargetIcon,
  ClockIcon,
  ListBulletIcon,
  SparklesIcon,
} from "../../../components/icons/Icons";
import { getAitext } from "../../../api/endpoints/aisnapshoot";
import { getMyGrants } from "../../../api/endpoints/customGrant";
import { useQuery } from "@tanstack/react-query";
import { gettasks } from "../../../api/endpoints/personaltask";

export const AISnapshotCard = () => {
  const { data: myGrants = [] } = useQuery({
    queryKey: ["myGrants"],
    queryFn: getMyGrants,
  });

  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => gettasks(),
  });

  const tasks = data?.data || [];

  // Use useQuery to fetch AI text on mount
 const { data: aiSnapshot } = useQuery({
  queryKey: ["aiSnapshot", myGrants, tasks],
  queryFn: () =>
    getAitext({
      myGrants,
      tasks,
    }),
  enabled: myGrants.length > 0 && tasks.length > 0,
});

//   console.log("AI Snapshot response:", myGrants);

  const insightItems = [
    // Note: 'outlook' is handled separately for the main paragraph
    {
      icon: TargetIcon,
      label: "Key Opportunities",
      value: aiSnapshot?.data?.opportunities || "",
    },
    {
      icon: ClockIcon,
      label: "Current Progress",
      value: aiSnapshot?.data?.progress || "",
    },
    {
      icon: ListBulletIcon,
      label: "Next Steps",
      value: aiSnapshot?.data?.nextSteps || "",
    },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-mercury/50 dark:border-dark-border/50 shadow-sm">
      {/* Header and Outlook */}
      <h3 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-purple-600" /> Your Snapshot
      </h3>
      <p className="text-night/80 dark:text-dark-text/80 mb-6 pb-6 border-b border-mercury/50 dark:border-dark-border/50">
        {aiSnapshot?.data?.outlook || "No insights available at the moment."}
      </p>

      {/* Detailed Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insightItems.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-night dark:text-dark-text whitespace-nowrap">
                {label}
              </h4>
            </div>
            <p className="text-sm text-night/70 dark:text-dark-textMuted">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// PropTypes for AISnapshotCard
AISnapshotCard.propTypes = {
  insights: PropTypes.shape({
    outlook: PropTypes.string.isRequired,
    opportunities: PropTypes.string.isRequired,
    progress: PropTypes.string.isRequired,
    nextSteps: PropTypes.string.isRequired,
  }).isRequired,
};

/**
 * AISnapshotSkeleton component provides a loading state UI.
 */
export const AISnapshotSkeleton = () => (
  <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-mercury/50 dark:border-dark-border/50 shadow-sm animate-pulse">
    <div className="h-7 w-1/2 bg-mercury/50 dark:bg-dark-border rounded-md mb-4"></div>
    <div className="space-y-2 mb-6 pb-6 border-b border-mercury/50 dark:border-dark-border/50">
      <div className="h-4 w-full bg-mercury/50 dark:bg-dark-border rounded-md"></div>
      <div className="h-4 w-3/4 bg-mercury/50 dark:bg-dark-border rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="h-5 w-2/3 bg-mercury/50 dark:bg-dark-border rounded-md mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-mercury/50 dark:bg-dark-border rounded-md"></div>
            <div className="h-3 w-5/6 bg-mercury/50 dark:bg-dark-border rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
