import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

// Define the grant status types
const GrantStatus = {
  DRAFTING: "DRAFTING",
  SUBMITTED: "SUBMITTED",
  IN_REVIEW: "IN_REVIEW",
  APPROVED: "APPROVED",
  AWARDED: "AWARDED",
  REJECTED: "REJECTED",
};

// Define the steps and their corresponding display properties
const statusMap = {
  [GrantStatus.DRAFTING]: { step: 1, color: "bg-blue-500" },
  [GrantStatus.SUBMITTED]: { step: 2, color: "bg-indigo-500" },
  [GrantStatus.IN_REVIEW]: { step: 3, color: "bg-purple-500" },
  [GrantStatus.APPROVED]: { step: 4, color: "bg-primary" },
  [GrantStatus.AWARDED]: { step: 4, color: "bg-yellow-500" },
  [GrantStatus.REJECTED]: { step: 4, color: "bg-red-500" },
};

const steps = ["Drafting", "Submitted", "In Review", "Outcome"];

// Map step names to status values
const stepToStatus = {
  Drafting: GrantStatus.DRAFTING,
  Submitted: GrantStatus.SUBMITTED,
  "In Review": GrantStatus.IN_REVIEW,
  Outcome: GrantStatus.AWARDED,
};


const ProgressBar = ({
  status,
  grantId,
  onStatusUpdate,
  isClickable = false,
  disableOptimisticStatuses = [],
  showTitle = true,
  showCurrentStatus = true,
}) => {
  // Local state for optimistic UI updates
  const [localStatus, setLocalStatus] = useState(status);

  // Keep local status in sync when parent prop changes
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  // Ensure the status is valid before proceeding
  const currentStatusInfo = statusMap[localStatus] || statusMap[status];

  if (!currentStatusInfo) {
    console.error(`Invalid status passed to ProgressBar: ${status}`);
    return null;
  }

  const progressPercentage = (currentStatusInfo.step / steps.length) * 100;

  // Determine if the current status is rejected for red coloring
  const isRejected = currentStatusInfo.step === 4 && localStatus === GrantStatus.REJECTED;

  // Handle step click (only if clickable and onStatusUpdate is provided)
  const handleStepClick = (stepName) => {
    // Return early if not clickable or no update handler
    if (!isClickable || !onStatusUpdate) return;

    const newStatus = stepToStatus[stepName];
    if (!newStatus) return;

    // If this status is configured to NOT do optimistic updates, just notify parent
    if (Array.isArray(disableOptimisticStatuses) && disableOptimisticStatuses.includes(newStatus)) {
      onStatusUpdate(grantId, newStatus);
      return;
    }

    // Optimistically update the UI immediately
    setLocalStatus(newStatus);

    // Then invoke the parent updater (which performs the mutation)
    try {
      onStatusUpdate(grantId, newStatus);
    } catch (err) {
      // If parent throws, revert to prop
      setLocalStatus(status);
      console.error("Error updating status:", err);
    }
  };

  // Determine cursor style based on clickability
  const getCursorClass = () => {
    if (!isClickable || !onStatusUpdate) return "";
    return "cursor-pointer hover:text-primary dark:hover:text-dark-primary transition-colors";
  };

  return (
    <div>
      {/* Header: Title and Current Status */}
      {(showTitle || showCurrentStatus) && (
        <div className="flex justify-between mb-1">
          {showTitle && (
            <span className="text-sm font-medium text-night dark:text-dark-text">
              Application Progress
            </span>
          )}
          {showCurrentStatus && (
            <span
              className={`text-sm font-medium ${
                isRejected
                  ? "text-red-600 dark:text-red-400"
                  : "text-secondary dark:text-dark-secondary"
              }`}
            >
              {localStatus}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Track */}
      <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2.5">
        <motion.div
          className={`h-2.5 rounded-full ${currentStatusInfo.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between text-xs text-night/60 dark:text-dark-textMuted mt-1">
        {steps.map((step, index) => (
          <span
            key={step}
            onClick={() => handleStepClick(step)}
            className={`${
              index + 1 <= currentStatusInfo.step
                ? "font-semibold text-night dark:text-dark-text"
                : ""
            } ${getCursorClass()}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  status: PropTypes.oneOf(Object.values(GrantStatus)).isRequired,
  grantId: PropTypes.string,
  onStatusUpdate: PropTypes.func,
  isClickable: PropTypes.bool,
  disableOptimisticStatuses: PropTypes.arrayOf(PropTypes.string),
  showTitle: PropTypes.bool,
  showCurrentStatus: PropTypes.bool,
};

export default ProgressBar;