import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  SparklesIcon,
  HeartIcon,
  BuildingOfficeIcon,
  BellIcon,
  SpinnerIcon,
  XIcon,
} from "../icons/Icons";
import { getGrantQuickReview } from "../../api/endpoints/geminiService";
import { handleFavoriteGrants } from "../../api/endpoints/grants";
import { addFavMyGrants } from "../../api/endpoints/customGrant";
import { ReminderModal } from "./ReminderModal";
import "./grantdetail.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteGrant,
  removeFavoriteGrant,
} from "../../redux/slices/favoriteGrantSlice";
import { formatAmount } from "../../utils/formatAmount";
import { getDaysRemaining } from "../../utils/deadlineDate";
import { quickAireview } from "../../api/endpoints/aisnapshoot";

const GrantDetailModal = ({ open, onClose, grant }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewContent, setReviewContent] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const location = useLocation();
  const savedGrants = useSelector((state) => state.favoriteGrants.savedGrants);
  const favoriteProjects = useSelector(
    (state) => state.favoriteGrants.favoriteProjects
  );
  const deadlineDateString = grant.closeDateTime;
  const daysRemaining = getDaysRemaining(deadlineDateString);
  const tabs = ["Overview", "Eligibility", "Documents", "Contacts"];

  // Check if we're on my-grants route
  const isMyGrantsRoute = location.pathname === "/my-grants";

  // ✅ Check if current grant is already favorite
  useEffect(() => {
    if (grant?._id) {
      // Check both savedGrants and favoriteProjects for comprehensive coverage
      const isFavoriteInSaved = savedGrants.some((g) => g._id === grant._id);
      const isFavoriteInProjects = favoriteProjects.some(
        (g) => g._id === grant._id
      );

      // Grant is favorite if it exists in either array
      const isFavorite = isFavoriteInSaved || isFavoriteInProjects;
      setIsSaved(isFavorite);
    } else {
      // If no grant ID, default to false
      setIsSaved(false);
    }
  }, [grant?._id, savedGrants, favoriteProjects]);

  // ✅ Conditional mutation based on route
  const { mutate: toggleFavorite, isPending: isToggling } = useMutation({
    mutationFn: (grantId) => {
      // Use different endpoint based on current route
      if (isMyGrantsRoute) {
        return addFavMyGrants(grantId);
      } else {
        return handleFavoriteGrants(grantId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["FavGrants"] });
      // queryClient.invalidateQueries({ queryKey: ["myGrants"] });
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
        message.success(
          nextState ? "Added to Favorites!" : "Removed from Favorites."
        );
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
    const review = await quickAireview(grant._id);
    setReviewContent(review);
    setIsReviewLoading(false);
  };

  // console.log("Grant Detail Modal Rendered with grant:", reviewContent);

  const TabContent = () => {
    if (!grant) return null;

    switch (activeTab) {
      case "Eligibility":
        return (
          <div>
            <h4 className="text-base sm:text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">
              Eligibility Requirements
            </h4>
            <p className="text-sm sm:text-base text-night/80 dark:text-dark-text/80 whitespace-pre-line">
              {grant.eligibility || "N/A"}
            </p>
          </div>
        );
      case "Documents":
        return (
          <div>
            <h4 className="text-base sm:text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">
              Application Instructions
            </h4>
            <p className="text-sm sm:text-base text-night/80 dark:text-dark-text/80 whitespace-pre-line">
              {grant.applicationInstructions || "N/A"}
            </p>
            {/* <p className="text-night/60 dark:text-dark-textMuted mt-4">Required documents will be listed here. (Placeholder for specific document list)</p> */}
          </div>
        );
      case "Contacts":
        return (
          <div>
            <h4 className="text-base sm:text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">
              Funder Contact
            </h4>
            <p className="text-sm sm:text-base text-night/80 dark:text-dark-text/80 mb-2">
              Email: {grant.contactEmail || "N/A"}
            </p>
            <p className="text-sm sm:text-base text-night/80 dark:text-dark-text/80">
              Agency: {grant.agency || "N/A"}
            </p>
          </div>
        );
      case "Overview":
      default:
        return (
          <div>
            <h4 className="text-base sm:text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">
              Description
            </h4>
            <p className="text-sm sm:text-base text-night/80 dark:text-dark-text/80 mb-3 sm:mb-4 whitespace-pre-line">
              {grant.description || "N/A"}
            </p>
            <h4 className="text-base sm:text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">
              Grant Activity Timeframe
            </h4>
            <p className="text-sm sm:text-base text-night/80 dark:text-dark-text/80 mb-3 sm:mb-4 whitespace-pre-line">
              {grant.grantActivityTimeframe || "N/A"}
            </p>
            <h4 className="text-base sm:text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">
              Funding Objectives
            </h4>
            <ul className="list-disc list-inside text-sm sm:text-base text-night/80 dark:text-dark-text/80 space-y-1">
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
      width="95%"
      style={{ maxWidth: "1000px" }}
      className="grant-detail-modal"
      closable={false}
      destroyOnHidden={false}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={grant._id}
          className="bg-white dark:bg-dark-surface text-night dark:text-dark-text rounded-xl p-3 sm:p-4 md:p-6 border border-mercury/30 dark:border-dark-border shadow-lg"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex-1 pr-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                {grant?.title ?? "N/A"}
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-xs sm:text-sm text-night/70 dark:text-dark-text/70">
                <BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{grant?.agency ?? "N/A"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onToggleSave}
                disabled={isToggling}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full 
                            font-semibold text-xs sm:text-sm transition-all duration-200 ease-in-out whitespace-nowrap
                            ${
                              isSaved
                                ? "bg-primary text-white shadow-md hover:bg-primary/90"
                                : "bg-gray-100 dark:bg-gray-700 text-night/70 dark:text-dark-textMuted hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-primary"
                            }`}
              >
                {/* The Icon */}
                <HeartIcon
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  isFilled={isSaved}
                />

                {/* The Text changes based on state */}
                <span className="hidden sm:inline">
                  {isSaved ? "Favorite" : "Add Fav"}
                </span>
              </button>

              <button
                onClick={onClose}
                className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
              >
                <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted">
                Deadline
              </p>
              <p className="text-sm sm:text-base font-semibold">
                {new Date(grant?.closeDateTime).toLocaleDateString("en-AU")}
              </p>
              {daysRemaining >= 0 ? (
                <p
                  className={`text-xs sm:text-sm ${
                    daysRemaining < 14
                      ? "text-red-600 dark:text-red-400"
                      : "text-orange-500 dark:text-orange-400"
                  }`}
                >
                  Closing in {daysRemaining} day
                  {daysRemaining !== 1 && "s"}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-night/50 dark:text-dark-textMuted">
                  Closed
                </p>
              )}
            </div>
            <div>
              <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted">
                Amount
              </p>
              <p className="text-base sm:text-lg font-semibold text-secondary dark:text-dark-secondary">
                {formatAmount(grant)}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted">
                Location
              </p>
              <p className="text-sm sm:text-base font-semibold">
                {grant?.location ?? "N/A"}
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="w-full h-full flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm bg-mercury/40 dark:bg-dark-border/60 rounded-lg hover:bg-mercury/60 dark:hover:bg-dark-border/80"
              >
                <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Set Reminder</span>
                <span className="sm:hidden">Remind</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-mercury/30 dark:border-dark-border mb-3 sm:mb-4 overflow-x-auto">
            <div className="flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 sm:pb-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab
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
          <div className="py-3 sm:py-4">
            <TabContent />
          </div>

          {/* Footer Buttons (hidden on /my-grants route) */}
          {!isMyGrantsRoute && (
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-mercury/30 dark:border-dark-border flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <motion.button
                onClick={() => window.open(grant?.applyUrl, "_blank")}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-primary font-semibold text-night rounded-lg hover:bg-secondary transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now
              </motion.button>
              <motion.button
                onClick={handleQuickReview}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-night dark:bg-dark-border text-white dark:text-dark-text rounded-lg flex items-center justify-center gap-2 border border-mercury/50 dark:border-dark-border hover:bg-gray-800 dark:hover:bg-dark-border/50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Quick AI Review
              </motion.button>
            </div>
          )}

          {/* Review Modal */}
          {isReviewModalOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-3 sm:p-4"
              onClick={() => setIsReviewModalOpen(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-4 sm:p-5 md:p-6 max-w-2xl w-full border border-mercury dark:border-dark-border"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-1.5 sm:gap-2 text-night dark:text-dark-text">
                    <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" /> AI Grant
                    Review
                  </h3>
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    className="text-night/60 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
                  >
                    <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
                {isReviewLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <SpinnerIcon className="w-10 h-10 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm text-night/80 dark:text-dark-text/80">
                    {/* Grant Summary */}
                    <div>
                      <h4 className="font-semibold text-night dark:text-dark-text mb-1">
                        Grant Summary
                      </h4>
                      <p>{reviewContent?.grantSummary}</p>
                    </div>

                    {/* Relevance */}
                    <div>
                      <h4 className="font-semibold text-night dark:text-dark-text mb-1">
                        Relevance To You
                      </h4>
                      <p>{reviewContent?.relevanceToYou}</p>
                    </div>

                    {/* Key Focus Areas */}
                    {reviewContent?.keyFocusAreas?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-night dark:text-dark-text mb-1">
                          Key Focus Areas
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {reviewContent.keyFocusAreas.map((area, index) => (
                            <li key={index} className="font-medium">
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Potential Challenges */}
                    {reviewContent?.potentialChallenges?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-night dark:text-dark-text mb-1">
                          Potential Challenges
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {reviewContent.potentialChallenges.map(
                            (challenge, index) => (
                              <li key={index}>{challenge}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Top Tip */}
                    <div className="bg-primary/5 border-l-4 border-primary p-3 rounded">
                      <h4 className="font-semibold text-night dark:text-dark-text mb-1">
                        Top Tip
                      </h4>
                      <p className="font-medium">{reviewContent?.topTip}</p>
                    </div>
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
