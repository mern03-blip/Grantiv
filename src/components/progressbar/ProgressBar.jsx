import React from 'react';
import { motion } from 'framer-motion';

const GrantStatus = {
  DRAFTING: 'DRAFTING',
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

const statusMap = {
  [GrantStatus.DRAFTING]: { step: 1, color: 'bg-blue-500' },
  [GrantStatus.SUBMITTED]: { step: 2, color: 'bg-indigo-500' },
  [GrantStatus.IN_REVIEW]: { step: 3, color: 'bg-purple-500' },
  [GrantStatus.APPROVED]: { step: 4, color: 'bg-primary' },
  [GrantStatus.REJECTED]: { step: 4, color: 'bg-red-500' },
};

const steps = ['Drafting', 'Submitted', 'In Review', 'Outcome'];

const ProgressBar = ({ status }) => {
  // Convert the incoming status to uppercase for lookup
  const normalizedStatus = status ? status.toUpperCase() : '';
  const currentStatusInfo = statusMap[normalizedStatus];

  if (!currentStatusInfo) {
    console.warn(`ProgressBar received an unknown status: ${status}. Using default or fallback.`);
    // Fallback to DRAFTING if status is not recognized
    const fallbackStatusInfo = statusMap[GrantStatus.DRAFTING];
    const fallbackProgressPercentage = (fallbackStatusInfo.step / steps.length) * 100;

    return (
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-night dark:text-dark-text">Application Progress</span>
          <span className={`text-sm font-medium text-blue-600 dark:text-blue-400`}>{status || 'Unknown'} (Invalid Status Provided)</span>
        </div>
        <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2.5">
          <motion.div
            className={`h-2.5 rounded-full ${fallbackStatusInfo.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${fallbackProgressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
          </motion.div>
        </div>
        <div className="flex justify-between text-xs text-night/60 dark:text-dark-textMuted mt-1">
          {steps.map((step, index) => (
            <span key={step} className={index + 1 <= fallbackStatusInfo.step ? 'font-semibold' : ''}>{step}</span>
          ))}
        </div>
      </div>
    );
  }

  const progressPercentage = (currentStatusInfo.step / steps.length) * 100;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-night dark:text-dark-text">Application Progress</span>
        {/* Use the original status for display, but normalizedStatus for logic */}
        <span className={`text-sm font-medium ${currentStatusInfo.step === 4 && normalizedStatus === GrantStatus.REJECTED ? 'text-red-600 dark:text-red-400' : 'text-secondary dark:text-dark-secondary'}`}>{status}</span>
      </div>
      <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2.5">
        <motion.div
          className={`h-2.5 rounded-full ${currentStatusInfo.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
        </motion.div>
      </div>
      <div className="flex justify-between text-xs text-night/60 dark:text-dark-textMuted mt-1">
        {steps.map((step, index) => (
          <span key={step} className={index + 1 <= currentStatusInfo.step ? 'font-semibold' : ''}>{step}</span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;