import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, CheckCircleIcon, BellIcon } from '../icons/Icons';


export const ReminderModal = ({ modalRef, grant, existingReminder, onClose, onSetReminder }) => {
    const getReminderDate = (daysBefore) => {
        const deadline = new Date(grant?.deadline);
        deadline.setDate(deadline.getDate() - daysBefore);
        return deadline;
    };

    const reminderOptions = [
        { days: 7, label: '1 Week Before' },
        { days: 3, label: '3 Days Before' },
        { days: 1, label: '1 Day Before' },
    ];

    const handleSet = (days) => {
        const reminderDate = getReminderDate(days).toISOString().split('T')[0];
        onSetReminder(grant, reminderDate);
        onClose();
    };

    const handleClear = () => {
        onSetReminder(grant, null);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={onClose}>
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
                    <button onClick={onClose} className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text" aria-label="Close reminder modal">
                        <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
                <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-4 sm:mb-6">Choose when you'd like to be notified about the deadline on {new Date(grant?.deadline).toLocaleDateString('en-AU')}.</p>
                <div className="space-y-2 sm:space-y-3">
                    {reminderOptions?.map(({ days, label }) => {
                        const date = getReminderDate(days);
                        // const dateString = date?.toISOString()?.split('T')[0];
                        const dateString=date
                        const isSelected = existingReminder === dateString;
                        return (
                            <button key={days} onClick={() => handleSet(days)} className={`w-full flex justify-between items-center p-3 sm:p-4 border rounded-lg text-left transition-all ${isSelected ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-mercury dark:border-dark-border hover:border-secondary dark:hover:border-dark-secondary'}`}>
                                <div>
                                    <p className="text-sm sm:text-base font-semibold text-night dark:text-dark-text">{label}</p>
                                    <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted">{date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                </div>
                                {isSelected && <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                            </button>
                        )
                    })}
                </div>
                {existingReminder && (
                    <div className="mt-4 sm:mt-6 text-center">
                        <button onClick={handleClear} className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:underline">Clear Reminder</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};