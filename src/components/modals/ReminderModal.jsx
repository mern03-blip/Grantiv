import React from "react";
import { motion } from "framer-motion";
import { XIcon, CheckCircleIcon, BellIcon } from "../icons/Icons";
import {
  clearReminder,
  getReminders,
  setReminders,
} from "../../api/endpoints/reminder";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const ReminderModal = ({ modalRef, grant, onClose, onSetReminder }) => {
  const queryClient = useQueryClient();

  const { data: reminderInfo } = useQuery({
    queryKey: ["reminders", grant?._id],
    queryFn: () => getReminders(grant?._id),
    enabled: !!grant?._id,
  });

  // 1. Calculate the days remaining until the deadline
  const deadline = new Date(grant?.closeDateTime);
  const now = new Date();

  // Difference in milliseconds converted to days
  const diffInMs = deadline - now;
  const daysRemaining = diffInMs / (1000 * 60 * 60 * 24);

  const getReminderDate = (daysBefore) => {
    const date = new Date(grant?.closeDateTime);
    date.setDate(date.getDate() - daysBefore);
    return date;
  };

  // 2. Filter options: Only show options where 'days' is less than 'daysRemaining'
  const reminderOptions = [
    { days: 7, label: "1 Week Before" },
    { days: 3, label: "3 Days Before" },
    { days: 1, label: "1 Day Before" },
  ].filter((option) => option.days < daysRemaining);

  const handleSet = async (days) => {
    try {
      await setReminders(grant?._id, days);
      queryClient.invalidateQueries(["reminders", grant?._id]);
      const reminderDate = getReminderDate(days).toISOString().split("T")[0];
      onSetReminder(grant, reminderDate);
      onClose();
    } catch (err) {
      console.error("Failed to set reminder:", err);
    }
  };

  const handleClear = async () => {
    try {
      await clearReminder(grant?._id);
      queryClient.invalidateQueries(["reminders", grant?._id]);
      onSetReminder(grant, null);
      onClose();
    } catch (err) {
      console.error("Failed to clear:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-4 sm:p-6 md:p-8 max-w-md w-full border border-mercury dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg md:text-xl font-bold font-heading flex items-center gap-1.5 sm:gap-2 text-night dark:text-dark-text">
            <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            Set Deadline Reminder
          </h3>
          <button
            onClick={onClose}
            className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
          >
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-4 sm:mb-6">
          Choose when you'd like to be notified about the deadline on{" "}
          {grant?.closeDateTime}.
        </p>

        <div className="space-y-2 sm:space-y-3">
          {/* 3. Handle case where no options are available */}
          {reminderOptions.length > 0 ? (
            reminderOptions.map(({ days, label }) => {
              const date = getReminderDate(days);
              const isSelected =
                reminderInfo?.hasReminder && reminderInfo?.daysBefore === days;

              return (
                <button
                  key={days}
                  onClick={() => handleSet(days)}
                  disabled={isSelected}
                  className={`w-full flex justify-between items-center p-3 sm:p-4 border rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 dark:bg-primary/20 ring-1 ring-primary"
                      : "border-mercury dark:border-dark-border hover:border-secondary"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm sm:text-base font-semibold ${
                        isSelected
                          ? "text-primary"
                          : "text-night dark:text-dark-text"
                      }`}
                    >
                      {label}
                    </p>
                    <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted">
                      {date.toLocaleDateString("en-AU", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center border border-dashed border-mercury rounded-lg">
              <p className="text-sm text-night/60 dark:text-dark-textMuted">
                The deadline is too close to set these reminders.
              </p>
            </div>
          )}
        </div>

        {reminderInfo?.hasReminder && (
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={handleClear}
              className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Clear Reminder
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
