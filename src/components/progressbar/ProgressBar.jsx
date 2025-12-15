import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';


// Define the grant status types (as strings for the JSX component)
const GrantStatus = {
    DRAFTING: 'DRAFTING',
    SUBMITTED: 'SUBMITTED',
    IN_REVIEW: 'IN_REVIEW',
    APPROVED: 'APPROVED',
    AWARDED: 'AWARDED',
    REJECTED: 'REJECTED',
};

// Define the steps and their corresponding display properties
const statusMap = {
    [GrantStatus.DRAFTING]: { step: 1, color: 'bg-blue-500' },
    [GrantStatus.SUBMITTED]: { step: 2, color: 'bg-indigo-500' },
    [GrantStatus.IN_REVIEW]: { step: 3, color: 'bg-purple-500' },
    [GrantStatus.APPROVED]: { step: 4, color: 'bg-primary' },
    [GrantStatus.AWARDED]: { step: 4, color: 'bg-yellow-500' },
    [GrantStatus.REJECTED]: { step: 4, color: 'bg-red-500' },
};

const steps = ['Drafting', 'Submitted', 'In Review', 'Outcome'];

// --- Main Component ---
const ProgressBar = ({ status }) => {
    
    // Ensure the status is valid before proceeding
    const currentStatusInfo = statusMap[status];

    if (!currentStatusInfo) {
        console.error(`Invalid status passed to ProgressBar: ${status}`);
        return null; // Or render an error state
    }

    const progressPercentage = (currentStatusInfo.step / steps.length) * 100;
    
    // Determine if the current status is the final (REJECTED) state for red coloring
    const isRejected = currentStatusInfo.step === 4 && status === GrantStatus.REJECTED;

    return (
        <div>
            {/* Header: Title and Current Status */}
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-night dark:text-dark-text">Application Progress</span>
                <span 
                    className={`text-sm font-medium ${isRejected ? 'text-red-600 dark:text-red-400' : 'text-secondary dark:text-dark-secondary'}`}
                >
                    {status}
                </span>
            </div>
            
            {/* Progress Bar Track */}
            <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2.5">
                <motion.div 
                    className={`h-2.5 rounded-full ${currentStatusInfo.color}`} 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                </motion.div>
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between text-xs text-night/60 dark:text-dark-textMuted mt-1">
                {steps.map((step, index) => (
                    <span 
                        key={step} 
                        // Highlight the step if the current progress has reached or passed it
                        className={index + 1 <= currentStatusInfo.step ? 'font-semibold text-night dark:text-dark-text' : ''}
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
};

export default ProgressBar;