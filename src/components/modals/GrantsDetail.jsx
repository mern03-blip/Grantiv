// Page
// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { getGrantQuickReview } from '../../services/geminiService';
// import {
//   SparklesIcon, HeartIcon, XIcon, BuildingOfficeIcon, BellIcon, SpinnerIcon
// } from '../icons/Icons';
// import useFocusTrap from '../../hooks/useFocusTrap';
// import useKeydown from '../../hooks/useKeydown';
// import { ReminderModal } from './ReminderModal';
// import { getGrantDetail, handleGetFavoriteGrants } from '../../api/endpoints/grants';
// import Loader from '../loading/Loader';
// import { useToggleFavoriteGrant } from "../../hooks/useToggleFavoriteGrant";
// import { message } from 'antd';


// // Utility function for TanStack Query
// const fetchGrant = async (id) => {
//   if (!id) return null;
//   const response = await getGrantDetail(id);
//   return response.data; // Assuming getGrant returns { data: grantObject }
// };

// const GrantDetail = ({ myGrants, matchPercentage, onApplyNow, onClose, onSetReminder }) => {
//   const [activeTab, setActiveTab] = useState('Overview');
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
//   const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
//   const [isReviewLoading, setIsReviewLoading] = useState(false);
//   const [reviewContent, setReviewContent] = useState(null);
//   const reviewModalRef = useRef(null);
//   const reminderModalRef = useRef(null);
//   const returnFocusRef = useRef(null);
//   const navigate = useNavigate();
//   useFocusTrap(isReviewModalOpen ? reviewModalRef : { current: null });
//   useKeydown('Escape', () => setIsReviewModalOpen(false));
//   useFocusTrap(isReminderModalOpen ? reminderModalRef : { current: null });
//   useKeydown('Escape', () => setIsReminderModalOpen(false));

//   //#########Get detail of current open single grant detail modal############
//   // 1. GET ID FROM URL
//   const { id } = useParams();
//   // console.log("grantId from URL:", id); 

//   // 2. TANSTACK QUERY FOR FETCHING GRANT DATA
//   const {
//     data: grant,
//     isLoading,
//     error
//   } = useQuery({
//     queryKey: ['grant', id],
//     queryFn: () => fetchGrant(id),
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000,
//   });

//   // console.log("Fetched grant data:", grant); 



//   // ##########Favorite (Saved) Grant Logic###############

//   const {
//     data: { data: savedGrants = [] } = {},
//   } = useQuery({
//     queryKey: ['favoriteGrants'],
//     queryFn: handleGetFavoriteGrants,
//     staleTime: 1000 * 60, // 1 min
//     retry: 1,
//   });

//   console.log("Saved Grants in Favorites Collection:", savedGrants);

//   const { mutate: toggleFavorite, isPending: isToggling } = useToggleFavoriteGrant();

//   // 1. Initialize isSaved state to false/null
//   const [isSaved, setIsSaved] = useState(false);

//   // 2. Add a useEffect to check the favorite status when data loads
//   useEffect(() => {
//     // Only run if both grant data and savedGrants data are available
//     if (grant?._id && savedGrants) {
//       const isFavorite = savedGrants.some((g) => g._id === grant._id);
//       setIsSaved(isFavorite);
//     }
//   }, [grant, savedGrants]); // Dependency array ensures this runs when grant or savedGrants changes


//   // The rest of the onToggleSave function remains correct for optimistic updates:
//   const onToggleSave = (grant) => {
//     if (!grant?._id) return;

//     // 🔄 Optimistic update
//     setIsSaved((prev) => !prev); // The previous value (which is what we set in the useEffect) is used

//     toggleFavorite(grant._id, {
//       onSuccess: () => {
//         message.success(!isSaved ? "Added to your Favorites collection!" : "Removed from your Favorites collection.");
//       },
//       onError: () => {
//         // Revert UI if request fails
//         setIsSaved((prev) => !prev);
//       },
//     });
//   };

//   //Other Logics
//   useEffect(() => {
//     if (isReviewModalOpen || isReminderModalOpen) {
//       returnFocusRef.current = document.activeElement;
//     } else {
//       returnFocusRef.current?.focus();
//     }
//   }, [isReviewModalOpen, isReminderModalOpen]);

//   const currencyFormatter = new Intl.NumberFormat('en-AU', {
//     style: 'currency',
//     currency: 'AUD',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   });

//   const getDaysRemaining = () => {
//     if (!grant?.closeDateTime) return -1;

//     const datePart = grant.closeDateTime.split(' ')[0];
//     const [day, monthStr, year] = datePart.split('-');

//     const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthStr);

//     const deadlineDate = new Date(year, monthIndex, day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     deadlineDate.setHours(0, 0, 0, 0);

//     const diffTime = deadlineDate.getTime() - today.getTime();
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const daysRemaining = grant ? getDaysRemaining() : null;

//   const tabs = ['Overview', 'Eligibility', 'Documents', 'Contacts'];

//   const handleQuickReview = async () => {
//     if (!grant) return;
//     setIsReviewModalOpen(true);
//     if (reviewContent) return;
//     setIsReviewLoading(true);
//     const review = await getGrantQuickReview(grant);
//     setReviewContent(review);
//     setIsReviewLoading(false);
//   };

//   // Use 'id' for the lookup in myGrants
//   const currentGrantData = myGrants?.find(g => g.id === id);

//   const TabContent = () => {
//     if (!grant) return null;

//     switch (activeTab) {
//       case 'Eligibility':
//         return (
//           <div>
//             <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Eligibility Requirements</h4>
//             <p className="text-night/80 dark:text-dark-text/80 whitespace-pre-line">{grant.eligibility}</p>
//           </div>
//         );
//       case 'Documents':
//         return (
//           <div>
//             <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Application Instructions</h4>
//             <p className="text-night/80 dark:text-dark-text/80 whitespace-pre-line">{grant.applicationInstructions}</p>
//             <p className="text-night/60 dark:text-dark-textMuted mt-4">Required documents will be listed here. (Placeholder for specific document list)</p>
//           </div>
//         );
//       case 'Contacts':
//         return (
//           <div>
//             <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Funder Contact</h4>
//             <p className="text-night/80 dark:text-dark-text/80 mb-2">Email: {grant.contactEmail}</p>
//             <p className="text-night/80 dark:text-dark-text/80">Agency: {grant.agency}</p>
//           </div>
//         );
//       case 'Overview':
//       default:
//         return (
//           <div>
//             <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Description</h4>
//             <p className="text-night/80 dark:text-dark-text/80 mb-4 whitespace-pre-line">{grant.description}</p>
//             <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Grant Activity Timeframe</h4>
//             <p className="text-night/80 dark:text-dark-text/80 mb-4 whitespace-pre-line">{grant.grantActivityTimeframe}</p>
//             <h4 className="text-lg font-bold font-heading mb-2 text-night dark:text-dark-text">Funding Objectives</h4>
//             <ul className="list-disc list-inside text-night/80 dark:text-dark-text/80 space-y-1">
//               <li>Digital capacity building and infrastructure development</li>
//               <li>Technology training and staff development programs</li>
//               <li>Innovation in service delivery through digital solutions</li>
//               <li>Data management and analytics capabilities</li>
//             </ul>
//           </div>
//         );
//     }
//   };

//   const variants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
//     exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.4, ease: 'easeIn' } }
//   };

//   // RENDER LOADING STATE (Managed by TanStack Query)
//   if (isLoading) {
//     return (
//       <Loader />
//     );
//   }

//   // RENDER NOT FOUND/ERROR STATE (Managed by TanStack Query)
//   if (error || !grant) {
//     return (
//       <div className="text-center p-12 bg-white dark:bg-dark-surface rounded-2xl shadow-lg max-w-5xl mx-auto my-12">
//         <h2 className="text-2xl font-bold text-red-600">Grant Not Found or Error</h2>
//         <p className="mt-2 text-night/80 dark:text-dark-text/80">The grant with ID "{id}" could not be loaded. ({error ? error.message : 'No data received'})</p>
//         <motion.button
//           onClick={() => onClose ? onClose() : navigate('/dashboard')}
//           className="mt-6 px-6 py-3 bg-primary font-semibold text-night rounded-lg hover:bg-secondary transition-colors duration-300"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Go Back to Dashboard
//         </motion.button>
//       </div>
//     );
//   }

//   // RENDER MAIN CONTENT
//   return (
//     <AnimatePresence>
//       <motion.div
//         className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-8 max-w-5xl mx-auto border border-mercury/50 dark:border-dark-border"
//         variants={variants}
//         initial="hidden"
//         animate="visible"
//         exit="exit"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div>
//             <h2 className="text-3xl font-bold text-night dark:text-dark-text font-heading">{grant.title ?? "N/A"}</h2>
//             <div className="flex items-center gap-4 mt-3 text-sm text-night/80 dark:text-dark-text/80">
//               <div className="flex items-center gap-2">
//                 <BuildingOfficeIcon className="w-5 h-5 text-night/50 dark:text-dark-textMuted" />
//                 <span>{grant.agency ?? "N/A"}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="bg-primary/20 text-secondary dark:bg-primary/10 dark:text-dark-primary px-2 py-0.5 rounded-full text-xs font-semibold">{grant.selectionProcess}</span>
//               </div>
//               {typeof matchPercentage === 'number' && (
//                 <div className="bg-primary text-night font-bold text-sm px-3 py-1 rounded-md">
//                   {matchPercentage ?? 0}%<span className="font-normal text-xs ml-1">Match</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => onToggleSave(grant)}
//               disabled={isToggling}
//               className={`transition-colors p-1 ${isSaved
//                 ? "text-primary"
//                 : "text-night/50 dark:text-dark-textMuted hover:text-primary"
//                 }`}
//               aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
//             >
//               <HeartIcon className="w-6 h-6" isFilled={isSaved} />
//             </button>

//             <motion.button
//               onClick={() => onClose ? onClose() : navigate(-1)}
//               className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text transition-colors" aria-label="Close grant details">
//               <XIcon className="w-6 h-6" />
//             </motion.button>
//           </div>
//         </div>

//         <hr className="my-6 border-mercury/30 dark:border-dark-border/50" />

//         {/* Key Info */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           <div className="text-center md:text-left">
//             <p className="text-sm text-night/60 dark:text-dark-textMuted mb-1">Deadline</p>
//             <p className="font-semibold text-night dark:text-dark-text">{new Date(grant.closeDateTime).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
//             {daysRemaining >= 0 ? (
//               <p className={`text-sm mt-1 font-medium ${daysRemaining < 14 ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'}`}>Closing in {daysRemaining} day{daysRemaining !== 1 && 's'}</p>
//             ) : (
//               <p className="text-sm mt-1 font-medium text-night/50 dark:text-dark-textMuted">Closed</p>
//             )}
//           </div>
//           <div className="text-center md:text-left">
//             <p className="text-sm text-night/60 dark:text-dark-textMuted mb-1">Amount</p>
//             <p className="font-semibold text-secondary dark:text-dark-secondary text-lg">
//               {
//                 grant?.totalAmountAvailable && !isNaN(Number(grant.totalAmountAvailable.replace(/[^0-9.]/g, '')))
//                   ? currencyFormatter.format(Number(grant.totalAmountAvailable.replace(/[^0-9.]/g, '')))
//                   : "Not Specified"
//               }
//             </p>
//           </div>
//           <div className="text-center md:text-left">
//             <p className="text-sm text-night/60 dark:text-dark-textMuted mb-1">Location</p>
//             <p className="font-semibold text-night dark:text-dark-text">{grant.location}</p>
//           </div>
//           <div className="text-center md:text-left">
//             <button
//               onClick={() => setIsReminderModalOpen(true)}
//               className={`w-full h-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${currentGrantData?.reminderDate ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/60' : 'bg-mercury/50 dark:bg-dark-border hover:bg-mercury dark:hover:bg-dark-border/50 text-night dark:text-dark-text'}`}
//               aria-label={currentGrantData?.reminderDate ? `Reminder set for ${new Date(currentGrantData.reminderDate).toLocaleDateString('en-AU')}` : "Set a reminder for this grant's deadline"}
//             >
//               <BellIcon className="w-5 h-5" />
//               {currentGrantData?.reminderDate ? `Reminder: ${new Date(currentGrantData.reminderDate).toLocaleDateString('en-AU')}` : 'Set Reminder'}
//             </button>
//           </div>
//         </div>

//         <hr className="my-6 border-mercury/30 dark:border-dark-border/50" />

//         {/* Tabs */}
//         <div>
//           <div className="border-b border-mercury/30 dark:border-dark-border/50">
//             <nav className="-mb-px flex space-x-6" aria-label="Tabs">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   // key={`${tab}-${index}`} 
//                   onClick={() => setActiveTab(tab)}
//                   className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
//                     ? 'border-primary text-secondary dark:text-dark-secondary'
//                     : 'border-transparent text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text hover:border-mercury dark:hover:border-dark-border'
//                     }`}
//                   aria-label={`View ${tab} for this grant`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </nav>
//           </div>
//           <div className="py-6">
//             <TabContent />
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="mt-4 pt-6 border-t border-mercury/30 dark:border-dark-border/50 flex items-center justify-end gap-3">
//           <motion.button
//             onClick={() => onApplyNow(grant)}
//             className="px-6 py-3 bg-primary font-semibold text-night rounded-lg hover:bg-secondary transition-colors duration-300"
//             aria-label={`Apply now for ${grant.title}`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Apply Now
//           </motion.button>
//           <motion.button
//             onClick={handleQuickReview}
//             className="px-6 py-3 bg-night dark:bg-dark-border font-semibold text-white dark:text-dark-text rounded-lg hover:bg-gray-800 dark:hover:bg-dark-border/50 transition-colors duration-300 flex items-center gap-2 border border-mercury/50 dark:border-dark-border"
//             aria-label={`Get a quick AI-powered review of ${grant.title}`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <SparklesIcon className="w-5 h-5" />
//             Quick AI Review
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* AI Review Modal */}
//       {isReviewModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsReviewModalOpen(false)}>
//           <motion.div
//             ref={reviewModalRef}
//             className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full border border-mercury dark:border-dark-border"
//             onClick={(e) => e.stopPropagation()}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold font-heading flex items-center gap-2 text-night dark:text-dark-text">
//                 <SparklesIcon className="w-6 h-6" />
//                 AI Grant Review
//               </h3>
//               <button onClick={() => setIsReviewModalOpen(false)} className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text" aria-label="Close AI review modal">
//                 <XIcon className="w-6 h-6" />
//               </button>
//             </div>
//             {isReviewLoading ? (
//               <div className="flex justify-center items-center h-48">
//                 <SpinnerIcon className="w-10 h-10 text-primary animate-spin" />
//               </div>
//             ) : (
//               <div className="mt-4 text-night/80 dark:text-dark-text/90 whitespace-pre-wrap font-sans text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
//                 {reviewContent}
//               </div>
//             )}
//           </motion.div>
//         </div>
//       )}

//       {/* Reminder Modal */}
//       {isReminderModalOpen && <ReminderModal modalRef={reminderModalRef} grant={grant} existingReminder={currentGrantData?.reminderDate} onClose={() => setIsReminderModalOpen(false)} onSetReminder={onSetReminder} />}

//     </AnimatePresence>
//   );
// };

// export default GrantDetail;



//Modal
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

  // ✅ Check if current grant is already favorite
  useEffect(() => {
    if (grant?._id && savedGrants.length > 0) {
      const isFavorite = savedGrants.some((g) => g._id === grant._id);
      setIsSaved(isFavorite);
    }
  }, [grant, savedGrants]);

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

  const currencyFormatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const getDaysRemaining = () => {
    if (!grant?.closeDateTime) return -1;
    const date = new Date(grant.closeDateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  const tabs = ["Overview", "Eligibility", "Documents", "Contacts"];

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
      case "Eligibility":
        return (
          <div>
            <h4 className="text-lg font-bold mb-2 text-night dark:text-dark-text">
              Eligibility Requirements
            </h4>
            <p className="text-night/80 dark:text-dark-text/80 whitespace-pre-line">
              {grant.eligibility}
            </p>
          </div>
        );
      case "Documents":
        return (
          <div>
            <h4 className="text-lg font-bold mb-2 text-night dark:text-dark-text">
              Application Instructions
            </h4>
            <p className="text-night/80 dark:text-dark-text/80 whitespace-pre-line">
              {grant.applicationInstructions}
            </p>
          </div>
        );
      case "Contacts":
        return (
          <div>
            <h4 className="text-lg font-bold mb-2 text-night dark:text-dark-text">
              Funder Contact
            </h4>
            <p className="text-night/80 dark:text-dark-text/80 mb-2">
              Email: {grant.contactEmail}
            </p>
            <p className="text-night/80 dark:text-dark-text/80">
              Agency: {grant.agency}
            </p>
          </div>
        );
      default:
        return (
          <div>
            <h4 className="text-lg font-bold mb-2 text-night dark:text-dark-text">
              Description
            </h4>
            <p className="text-night/80 dark:text-dark-text/80 mb-4 whitespace-pre-line">
              {grant.description}
            </p>
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
                            font-semibold text-sm transition-all duration-200 ease-in-out 
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
                {grant?.totalAmountAvailable !== undefined && grant?.totalAmountAvailable !== null && grant?.totalAmountAvailable !== "0"
                  ? currencyFormatter.format(
                    typeof grant.totalAmountAvailable === "string"
                      ? Number(grant.totalAmountAvailable.replace(/[^0-9.]/g, "")) || "Unspecified"
                      : Number(grant.totalAmountAvailable)
                  )
                  : "Unspecified"}
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




