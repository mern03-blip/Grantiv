import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGrantQuickReview } from '../../services/geminiService';
import {
    SparklesIcon, HeartIcon, XIcon, BuildingOfficeIcon, BellIcon, SpinnerIcon
} from '../icons/Icons';
import useFocusTrap from '../../hooks/useFocusTrap';
import useKeydown from '../../hooks/useKeydown';
import { ReminderModal } from './ReminderModal';
import { useNavigate } from 'react-router-dom';

const GrantDetail = ({ grant, myGrants, matchPercentage, onApplyNow, onClose, savedGrants, onToggleSave, onSetReminder }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [reviewContent, setReviewContent] = useState(null);

    const reviewModalRef = useRef(null);
    const reminderModalRef = useRef(null);
    const returnFocusRef = useRef(null);
    const navigate = useNavigate();
    useFocusTrap(isReviewModalOpen ? reviewModalRef : { current: null });
    useKeydown('Escape', () => setIsReviewModalOpen(false));
    useFocusTrap(isReminderModalOpen ? reminderModalRef : { current: null });
    useKeydown('Escape', () => setIsReminderModalOpen(false));

    useEffect(() => {
        if (isReviewModalOpen || isReminderModalOpen) {
            returnFocusRef.current = document.activeElement;
        } else {
            returnFocusRef.current?.focus();
        }
    }, [isReviewModalOpen, isReminderModalOpen]);

    const currencyFormatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const getDaysRemaining = () => {
        const deadlineDate = new Date(grant?.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    const daysRemaining = getDaysRemaining();

    const tabs = ['Overview', 'Eligibility', 'Documents', 'Contacts'];

    const handleQuickReview = async () => {
        setIsReviewModalOpen(true);
        if (reviewContent) return;
        setIsReviewLoading(true);
        const review = await getGrantQuickReview(grant);
        setReviewContent(review);
        setIsReviewLoading(false);
    };

    const currentGrantData = myGrants?.find(g => g.id === grant.id);

    const TabContent = () => {
        switch (activeTab) {
            case 'Eligibility':
                return (
                    <div>
                        <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Eligibility Requirements</h4>
                        <p className="text-night/80 dark:text-dark-text/80 whitespace-pre-line">Eligiblity Section</p>
                    </div>
                );
            case 'Documents':
                return <p className="text-night/60 dark:text-dark-textMuted">Required documents will be listed here. (Placeholder)</p>;
            case 'Contacts':
                return <p className="text-night/60 dark:text-dark-textMuted">Contact information for the funder will be available here. (Placeholder)</p>;
            case 'Overview':
            default:
                return (
                    <div>
                        <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Description</h4>
                        <p className="text-night/80 dark:text-dark-text/80 mb-4 whitespace-pre-line">{grant?.description}</p>
                        <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Funding Objectives</h4>
                        <ul className="list-disc list-inside text-night/80 dark:text-dark-text/80 space-y-1">
                            <li>Digital capacity building and infrastructure development</li>
                            <li>Technology training and staff development programs</li>
                            <li>Innovation in service delivery through digital solutions</li>
                            <li>Data management and analytics capabilities</li>
                        </ul>
                    </div>
                );
        }
    };

    const isSaved = savedGrants?.some(g => g.id === grant.id);

    // New animation variants for the main component
    const variants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
        exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.4, ease: 'easeIn' } }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-8 max-w-5xl mx-auto border border-mercury/50 dark:border-dark-border"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-night dark:text-dark-text font-heading">{grant?.title ?? "N/A"}</h2>
                        <div className="flex items-center gap-4 mt-3 text-sm text-night/80 dark:text-dark-text/80">
                            <div className="flex items-center gap-2">
                                <BuildingOfficeIcon className="w-5 h-5 text-night/50 dark:text-dark-textMuted" />
                                <span>{grant?.funder ?? "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/20 text-secondary dark:bg-primary/10 dark:text-dark-primary px-2 py-0.5 rounded-full text-xs font-semibold">{grant?.category}</span>
                            </div>
                            {typeof matchPercentage === 'number' && (
                                <div className="bg-primary text-night font-bold text-sm px-3 py-1 rounded-md">
                                    {matchPercentage ?? 0}%<span className="font-normal text-xs ml-1">Match</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onToggleSave(grant)}
                            className={`transition-colors p-1 ${isSaved ? 'text-primary' : 'text-night/50 dark:text-dark-textMuted hover:text-primary'}`}
                            aria-label={isSaved ? "Remove this grant from your saved list" : "Save this grant for later"}
                        >
                            <HeartIcon className="w-6 h-6" isFilled={isSaved} />
                        </button>
                        <motion.button
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={() => onClose ? onClose() : navigate(-1)}
                            className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text transition-colors" aria-label="Close grant details">
                            <XIcon className="w-6 h-6" />
                        </motion.button>
                    </div>
                </div>

                <hr className="my-6 border-mercury/30 dark:border-dark-border/50" />

                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-night/60 dark:text-dark-textMuted mb-1">Deadline</p>
                        <p className="font-semibold text-night dark:text-dark-text">{new Date(grant?.deadline).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        {daysRemaining >= 0 ? (
                            <p className={`text-sm mt-1 font-medium ${daysRemaining < 14 ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'}`}>Closing in {daysRemaining} day{daysRemaining !== 1 && 's'}</p>
                        ) : (
                            <p className="text-sm mt-1 font-medium text-night/50 dark:text-dark-textMuted">Closed</p>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-sm text-night/60 dark:text-dark-textMuted mb-1">Amount</p>
                        <p className="font-semibold text-secondary dark:text-dark-secondary text-lg">{currencyFormatter?.format(grant?.amount)}</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-sm text-night/60 dark:text-dark-textMuted mb-1">Per Organization</p>
                        <p className="font-semibold text-night dark:text-dark-text">One application</p>
                    </div>
                    <div className="text-center md:text-left">
                        <button
                            onClick={() => setIsReminderModalOpen(true)}
                            className={`w-full h-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${currentGrantData?.reminderDate ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/60' : 'bg-mercury/50 dark:bg-dark-border hover:bg-mercury dark:hover:bg-dark-border/50 text-night dark:text-dark-text'}`}
                            aria-label={currentGrantData?.reminderDate ? `Reminder set for ${new Date(currentGrantData.reminderDate).toLocaleDateString('en-AU')}` : "Set a reminder for this grant's deadline"}
                        >
                            <BellIcon className="w-5 h-5" />
                            {currentGrantData?.reminderDate ? `Reminder: ${new Date(currentGrantData.reminderDate).toLocaleDateString('en-AU')}` : 'Set Reminder'}
                        </button>
                    </div>
                </div>

                <hr className="my-6 border-mercury/30 dark:border-dark-border/50" />

                {/* Tabs */}
                <div>
                    <div className="border-b border-mercury/30 dark:border-dark-border/50">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                        ? 'border-primary text-secondary dark:text-dark-secondary'
                                        : 'border-transparent text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text hover:border-mercury dark:hover:border-dark-border'
                                        }`}
                                    aria-label={`View ${tab} for this grant`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="py-6">
                        <TabContent />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-6 border-t border-mercury/30 dark:border-dark-border/50 flex items-center justify-end gap-3">
                    <motion.button
                        onClick={() => onApplyNow(grant)}
                        className="px-6 py-3 bg-primary font-semibold text-night rounded-lg hover:bg-secondary transition-colors duration-300"
                        aria-label={`Apply now for ${grant?.title}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Apply Now
                    </motion.button>
                    <motion.button
                        onClick={handleQuickReview}
                        className="px-6 py-3 bg-night dark:bg-dark-border font-semibold text-white dark:text-dark-text rounded-lg hover:bg-gray-800 dark:hover:bg-dark-border/50 transition-colors duration-300 flex items-center gap-2 border border-mercury/50 dark:border-dark-border"
                        aria-label={`Get a quick AI-powered review of ${grant?.title}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <SparklesIcon className="w-5 h-5" />
                        Quick AI Review
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isReviewModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsReviewModalOpen(false)}>
                        <motion.div
                            ref={reviewModalRef}
                            className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full border border-mercury dark:border-dark-border"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold font-heading flex items-center gap-2 text-night dark:text-dark-text">
                                    <SparklesIcon className="w-6 h-6" />
                                    AI Grant Review
                                </h3>
                                <button onClick={() => setIsReviewModalOpen(false)} className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text" aria-label="Close AI review modal">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>
                            {isReviewLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <SpinnerIcon className="w-10 h-10 text-primary" />
                                </div>
                            ) : (
                                <div className="mt-4 text-night/80 dark:text-dark-text/90 whitespace-pre-wrap font-sans text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                                    {reviewContent}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isReminderModalOpen && <ReminderModal modalRef={reminderModalRef} grant={grant} existingReminder={currentGrantData?.reminderDate} onClose={() => setIsReminderModalOpen(false)} onSetReminder={onSetReminder} />}
            </AnimatePresence>

        </AnimatePresence>
    );
};

export default GrantDetail;





