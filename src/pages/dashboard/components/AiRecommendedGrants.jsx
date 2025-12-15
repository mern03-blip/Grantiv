// import React, { useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import GrantCard from '../../../components/cards/GrantCard';
// import { getAIRecommendedGrants } from '../../../api/endpoints/grants';
// import { setAiTotalAmount, setNearestDeadline } from '../../../redux/slices/grantSlice';
// import { useDispatch } from 'react-redux';

// const AiRecommendedGrants = () => {
//     const dispatch = useDispatch();

//     const {
//         data,
//         isLoading,
//         isError,
//     } = useQuery({
//         queryKey: ['ai-recommended-grants'],
//         queryFn: getAIRecommendedGrants,
//         staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
//         cacheTime: 10 * 60 * 1000, // Keep the cache in memory for 10 minutes
//         refetchOnMount: false, // Don't refetch the query when the component remounts
//         refetchOnWindowFocus: false, // Don't refetch when the browser tab/window regains focus
//     });

//     const suggestions = data?.recommendedGrants || [];
//     const nearestDeadline = data?.nearestDeadline || null;

//     // ✅ Limit to only 3 grants from backend data
//     const topGrants = suggestions.slice(0, 3);

//     // ✅ Calculate total amount of these 3 grants
//     const totalAmount = topGrants.reduce((sum, grant) => {
//         const rawValue = String(grant.totalAmountAvailable || "0");

//         // Extract **all numbers** from the string, even in ranges
//         const numbers = (rawValue.match(/\d[\d,\.]*/g) || []).map((num) =>
//             parseFloat(num.replace(/,/g, ""))
//         );

//         // If it's a range (like "$1,000 - $15,000"), take the **average**
//         let amount = 0;
//         if (numbers.length === 1) {
//             amount = numbers[0];
//         } else if (numbers.length === 2) {
//             amount = (numbers[0] + numbers[1]) / 2;
//         }

//         return sum + (amount || 0);
//     }, 0);

//     // console.log("Total amount of top 3 grants:", totalAmount);

//     useEffect(() => {
//         if (totalAmount) {
//             dispatch(setAiTotalAmount(totalAmount));
//         }
//         if (!isLoading) {
//             dispatch(setNearestDeadline(nearestDeadline));
//         }
//     }, [totalAmount, nearestDeadline, dispatch]);

//     return (
//         <div>
//             {isLoading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
//                     {[...Array(3)].map((_, i) => (
//                         <div
//                             key={i}
//                             className="bg-white dark:bg-dark-surface p-3 sm:p-4 rounded-lg border border-mercury dark:border-dark-border animate-pulse"
//                         >
//                             <div className="h-24 sm:h-28 md:h-32 bg-mercury/80 dark:bg-dark-border rounded mb-3 sm:mb-4"></div>
//                             <div className="h-4 sm:h-5 bg-mercury/80 dark:bg-dark-border rounded w-3/4 mb-2"></div>
//                             <div className="h-3 sm:h-4 bg-mercury/80 dark:bg-dark-border rounded w-1/2 mb-3 sm:mb-4"></div>
//                             <div className="h-7 sm:h-8 bg-mercury/80 dark:bg-dark-border rounded w-full"></div>
//                         </div>
//                     ))}
//                 </div>
//             ) : isError ? (
//                 <div className="text-center p-4 sm:p-6 md:p-8 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300">
//                     <p className="text-sm sm:text-base">{'We couldnt fetch recommendations. Kindly complete your business profile to proceed.'}</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
//                     {topGrants.map((grant) => (
//                         <GrantCard
//                             key={grant.id}
//                             grant={grant}
//                             matchPercentage={grant.matchPercentage}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AiRecommendedGrants;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import GrantDetailModal from "../../../components/modals/GrantsDetail"; 
import { getAIRecommendedGrants } from "../../../api/endpoints/grants";
import {
  setAiTotalAmount,
  setNearestDeadline,
} from "../../../redux/slices/grantSlice";
import { BuildingOfficeIcon } from "../../../components/icons/Icons";

// Since you didn't provide it, I will define a basic one for this component's scope.
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// 1. RecommendedGrantCard Component (Reusable Card Item)
const RecommendedGrantCard = ({ grant, onClick }) => {
  return (
    <motion.div
      // The onClick event on the card itself triggers the modal
      onClick={() => onClick(grant)}
      className="bg-alabaster dark:bg-dark-background/60 p-4 rounded-xl border border-mercury/50 dark:border-dark-border/50 cursor-pointer h-full flex flex-col"
      whileHover={{ y: -4, borderColor: "#A8DD6B" }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {/* Image/Placeholder */}
      <div className="w-full h-20 mb-3">
        {grant.grantImg ? (
          <img
            src={grant.grantImg}
            alt={grant.title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-mercury/30 dark:bg-dark-border/50 flex items-center justify-center rounded-md">
            <BuildingOfficeIcon className="w-8 h-8 text-mercury dark:text-dark-border" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <h4 className="font-bold text-sm mb-1 line-clamp-2 text-night dark:text-dark-text">
          {grant.title}
        </h4>
        <p className="text-xs text-night/60 dark:text-dark-textMuted mb-3">
          {grant.funder}
        </p>
      </div>

      {/* Amount */}
      <div className="mt-auto pt-2">
        <span className="font-bold text-secondary dark:text-dark-secondary text-lg">
          {formatCurrency(grant.amount)}
        </span>
      </div>
    </motion.div>
  );
};

RecommendedGrantCard.propTypes = {
  grant: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    funder: PropTypes.string,
    grantImg: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

// 2. RecommendedGrantsSkeleton Component (Loading State - kept unchanged)
const RecommendedGrantsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-alabaster dark:bg-dark-background/60 p-4 rounded-xl border border-mercury/50 dark:border-dark-border/50 animate-pulse h-full flex flex-col"
      >
        <div className="h-20 bg-mercury/50 dark:bg-dark-border rounded w-full mb-3"></div>
        <div className="h-4 bg-mercury/50 dark:bg-dark-border rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-mercury/50 dark:bg-dark-border rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-mercury/50 dark:bg-dark-border rounded w-1/3 mt-auto"></div>
      </div>
    ))}
  </div>
);

// 3. Main AiRecommendedGrants Component
const AiRecommendedGrants = () => {
  const dispatch = useDispatch();

  // --- Modal State Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState(null);

  const handleSelectGrant = (grant) => {
    setSelectedGrant(grant);
    setIsModalOpen(true);
  };

  // --- Data Fetching Logic (unchanged) ---
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ai-recommended-grants"],
    queryFn: getAIRecommendedGrants,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const suggestions = data?.recommendedGrants || [];
  const nearestDeadline = data?.nearestDeadline || null;

  // Preprocess grants for display and total calculation
  const topGrants = suggestions.slice(0, 3).map((grant) => {
    const rawValue = String(grant.totalAmountAvailable || "0");
    const numbers = (rawValue.match(/\d[\d,\.]*/g) || []).map((num) =>
      parseFloat(num.replace(/,/g, ""))
    );
    let amount = numbers[0] || 0;

    return {
      ...grant,
      amount: amount,
    };
  });

  const totalAmount = suggestions.slice(0, 3).reduce((sum, grant) => {
    const rawValue = String(grant.totalAmountAvailable || "0");
    const numbers = (rawValue.match(/\d[\d,\.]*/g) || []).map((num) =>
      parseFloat(num.replace(/,/g, ""))
    );
    let amount = 0;
    if (numbers.length === 1) {
      amount = numbers[0];
    } else if (numbers.length === 2) {
      amount = (numbers[0] + numbers[1]) / 2;
    }
    return sum + (amount || 0);
  }, 0);

  // Redux Dispatch Effect (unchanged)
  useEffect(() => {
    if (totalAmount) {
      dispatch(setAiTotalAmount(totalAmount));
    }
    if (!isLoading) {
      dispatch(setNearestDeadline(nearestDeadline));
    }
  }, [totalAmount, nearestDeadline, dispatch, isLoading]);

  // --- Render JSX with Modal Integration ---
  return (
    <>
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-mercury/50 dark:border-dark-border/50 shadow-sm">
        {/* Header */}
        <h2 className="text-xl font-bold font-heading mb-2 text-night dark:text-dark-text">
          AI-Recommended Grants
        </h2>

        {/* Description */}
        <p className="text-sm text-night/70 dark:text-dark-textMuted mb-4">
          Based on general suitability, here are a few grants you might be
          interested in. For personalized recommendations, use the "Find Grants"
          feature.
        </p>

        {/* Content */}
        {isLoading ? (
          <RecommendedGrantsSkeleton />
        ) : isError ? (
          <div className="text-center p-4 sm:p-6 md:p-8 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300">
            <p className="text-sm sm:text-base">
              {
                "We couldn't fetch recommendations. Kindly complete your business profile to proceed."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topGrants.map((grant) => (
              <RecommendedGrantCard
                key={grant.id}
                grant={grant}
                onClick={handleSelectGrant} // Passes the function to set state and open modal
              />
            ))}
          </div>
        )}
      </div>

      {/* 👇 Grant Detail Modal (placed outside the main card component) */}
      {selectedGrant && (
        <GrantDetailModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          grant={selectedGrant}
        />
      )}
    </>
  );
};

export default AiRecommendedGrants;
