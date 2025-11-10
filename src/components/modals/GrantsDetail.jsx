import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  HeartIcon,
  BuildingOfficeIcon,
  BellIcon,
  SpinnerIcon,
  XIcon,
} from "../icons/Icons";
import { getGrantQuickReview } from "../../services/geminiService";
import { handleFavoriteGrants } from "../../api/endpoints/grants";
import { ReminderModal } from "./ReminderModal";
import "./grantdetail.scss"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { addFavoriteGrant, removeFavoriteGrant, setSavedGrants } from "../../redux/slices/favoriteGrantSlice";
import { formatAmount } from "../../utils/formatAmount";
import { getDaysRemaining } from "../../utils/deadlineDate";

const GrantDetailModal = ({ open, onClose, grant }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewContent, setReviewContent] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const savedGrants = useSelector((state) => state.favoriteGrants.savedGrants);
  const deadlineDateString = grant.closeDateTime;
  const daysRemaining = getDaysRemaining(deadlineDateString);
  const tabs = ["Overview", "Eligibility", "Documents", "Contacts"];

  // ✅ Check if current grant is already favorite
  useEffect(() => {
    if (grant?._id && savedGrants.length > 0) {
      const isFavorite = savedGrants.some((g) => g._id === grant._id);
      setIsSaved(isFavorite);
    }
  }, [grant, savedGrants]);

  // ✅ Mutation for toggle (add/remove favorite)
  const { mutate: toggleFavorite, isPending: isToggling } = useMutation({
    mutationFn: (grantId) => handleFavoriteGrants(grantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["FavGrants"] });
    },
    onError: () => {
      message.error("Failed to update favorites.");
    },
  });

  // ✅ Toggle favorite (local + Redux + server)
  const onToggleSave = () => {
    if (!grant?._id || isToggling) return;

    const nextState = !isSaved;
    setIsSaved(nextState);

    if (nextState) {
      dispatch(addFavoriteGrant(grant));
    } else {
      dispatch(removeFavoriteGrant(grant._id));
    }

    toggleFavorite(grant._id, {
      onSuccess: () => {
        message.success(nextState ? "Added to Favorites!" : "Removed from Favorites.");
      },
      onError: () => {
        // revert UI + Redux on error
        setIsSaved((prev) => !prev);
        if (nextState) dispatch(removeFavoriteGrant(grant._id));
        else dispatch(addFavoriteGrant(grant));
        message.error("Something went wrong.");
      },
    });
  };

  const handleQuickReview = async () => {
    if (!grant) return;
    setIsReviewModalOpen(true);
    if (reviewContent) return;
    setIsReviewLoading(true);
    const review = await getGrantQuickReview(grant);
    setReviewContent(review);
    setIsReviewLoading(false);
  };

  const TabContent = () => {
    if (!grant) return null;

    switch (activeTab) {
      case 'Eligibility':
        return (
          <div>
            <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Eligibility Requirements</h4>
            <p className="text-night/80 dark:text-dark-text/80 whitespace-pre-line">{grant.eligibility || "N/A"}</p>
          </div>
        );
      case 'Documents':
        return (
          <div>
            <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Application Instructions</h4>
            <p className="text-night/80 dark:text-dark-text/80 whitespace-pre-line">{grant.applicationInstructions || "N/A"}</p>
            {/* <p className="text-night/60 dark:text-dark-textMuted mt-4">Required documents will be listed here. (Placeholder for specific document list)</p> */}
          </div>
        );
      case 'Contacts':
        return (
          <div>
            <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Funder Contact</h4>
            <p className="text-night/80 dark:text-dark-text/80 mb-2">Email: {grant.contactEmail || "N/A"}</p>
            <p className="text-night/80 dark:text-dark-text/80">Agency: {grant.agency || "N/A"}</p>
          </div>
        );
      case 'Overview':
      default:
        return (
          <div>
            <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Description</h4>
            <p className="text-night/80 dark:text-dark-text/80 mb-4 whitespace-pre-line">{grant.description || "N/A"}</p>
            <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Grant Activity Timeframe</h4>
            <p className="text-night/80 dark:text-dark-text/80 mb-4 whitespace-pre-line">{grant.grantActivityTimeframe || "N/A"}</p>
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

  if (!grant) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      className="grant-detail-modal"
      closable={false}
      destroyOnHidden={false}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={grant._id}
          className="bg-white dark:bg-dark-surface text-night dark:text-dark-text rounded-xl p-6 border border-mercury/30 dark:border-dark-border shadow-lg"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{grant?.title ?? "N/A"}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-night/70 dark:text-dark-text/70">
                <BuildingOfficeIcon className="w-5 h-5" />
                <span>{grant?.agency ?? "N/A"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* 
              <button
                onClick={onToggleSave}
                disabled={isToggling}
                className={`transition-colors p-1 ${isSaved
                  ? "text-primary"
                  : "text-night/50 dark:text-dark-textMuted hover:text-primary"
                  }`}
              >
                <HeartIcon className="w-6 h-6" isFilled={isSaved} />
              </button> */}
              <button
                onClick={onToggleSave}
                disabled={isToggling}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                            font-semibold text-sm transition-all duration-200 ease-in-out whitespace-nowrap
                            ${isSaved
                    ? "bg-primary text-white shadow-md hover:bg-primary/90"
                    : "bg-gray-100 dark:bg-gray-700 text-night/70 dark:text-dark-textMuted hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-primary"}`}>
                {/* The Icon */}
                <HeartIcon className="w-5 h-5" isFilled={isSaved} />

                {/* The Text changes based on state */}
                <span className="hidden sm:inline">
                  {isSaved ? "Favorite" : "Add Fav"}
                </span>
              </button>

              <button
                onClick={onClose}
                className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-night/60 dark:text-dark-textMuted">
                Deadline
              </p>
              <p className="font-semibold">
                {new Date(grant?.closeDateTime).toLocaleDateString("en-AU")}
              </p>
              {daysRemaining >= 0 ? (
                <p
                  className={`text-sm ${daysRemaining < 14
                    ? "text-red-600 dark:text-red-400"
                    : "text-orange-500 dark:text-orange-400"
                    }`}
                >
                  Closing in {daysRemaining} day
                  {daysRemaining !== 1 && "s"}
                </p>
              ) : (
                <p className="text-sm text-night/50 dark:text-dark-textMuted">
                  Closed
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-night/60 dark:text-dark-textMuted">
                Amount
              </p>
              <p className="font-semibold text-secondary dark:text-dark-secondary text-lg">
                {formatAmount(grant)}
              </p>


            </div>
            <div>
              <p className="text-sm text-night/60 dark:text-dark-textMuted">
                Location
              </p>
              <p className="font-semibold">{grant?.location ?? "N/A"}</p>
            </div>
            <div>
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="w-full h-full flex items-center justify-center gap-2 px-4 py-2 bg-mercury/40 dark:bg-dark-border/60 rounded-lg hover:bg-mercury/60 dark:hover:bg-dark-border/80"
              >
                <BellIcon className="w-5 h-5" />
                Set Reminder
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-mercury/30 dark:border-dark-border mb-4">
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 border-b-2 font-medium text-sm ${activeTab === tab
                    ? "border-primary text-secondary dark:text-dark-secondary"
                    : "border-transparent text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="py-4">
            <TabContent />
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 pt-4 border-t border-mercury/30 dark:border-dark-border flex justify-end gap-3">
            <motion.button
              onClick={() => window.open(grant?.applyUrl, "_blank")}
              className="px-6 py-3 bg-primary font-semibold text-night rounded-lg hover:bg-secondary transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
            </motion.button>
            <motion.button
              onClick={handleQuickReview}
              className="px-6 py-3 bg-night dark:bg-dark-border text-white dark:text-dark-text rounded-lg flex items-center gap-2 border border-mercury/50 dark:border-dark-border hover:bg-gray-800 dark:hover:bg-dark-border/50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SparklesIcon className="w-5 h-5" />
              Quick AI Review
            </motion.button>
          </div>

          {/* Review Modal */}
          {isReviewModalOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
              onClick={() => setIsReviewModalOpen(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-6 max-w-2xl w-full border border-mercury dark:border-dark-border"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-night dark:text-dark-text">
                    <SparklesIcon className="w-5 h-5" /> AI Grant Review
                  </h3>
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    className="text-night/60 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                {isReviewLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <SpinnerIcon className="w-10 h-10 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="text-night/80 dark:text-dark-text/80 whitespace-pre-wrap text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                    {reviewContent}
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Reminder Modal */}
          {isReminderModalOpen && (
            <ReminderModal
              grant={grant}
              onClose={() => setIsReminderModalOpen(false)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default GrantDetailModal;




