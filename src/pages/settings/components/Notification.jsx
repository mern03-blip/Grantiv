import React from "react";

const Notification = () => {
  const Toggle = ({ label, description, checked, onChange }) => (
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
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-primary" : "bg-mercury dark:bg-dark-border"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">
        Notification Settings
      </h3>
      <div className="max-w-2xl">
        <Toggle
          label="New Grant Matches"
          description="Get notified when our AI finds a grant that fits your profile."
          checked={true}
          onChange={() => {}}
        />
        <Toggle
          label="Deadline Reminders"
          description="Receive alerts for applications that are nearing their deadline."
          checked={true}
          onChange={() => {}}
        />
        <Toggle
          label="Product Updates"
          description="Stay in the loop with new features and announcements."
          checked={false}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default Notification;
