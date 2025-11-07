import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GrantCard from '../../../components/cards/GrantCard';
import { getAIRecommendedGrants } from '../../../api/endpoints/grants';
import { setAiTotalAmount, setNearestDeadline } from '../../../redux/slices/grantSlice';
import { useDispatch } from 'react-redux';

const AiRecommendedGrants = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['ai-recommended-grants'],
        queryFn: getAIRecommendedGrants,
        staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep the cache in memory for 10 minutes
        refetchOnMount: false, // Don't refetch the query when the component remounts
        refetchOnWindowFocus: false, // Don't refetch when the browser tab/window regains focus
    });

    const suggestions = data?.recommendedGrants || [];
    const nearestDeadline = data?.nearestDeadline || null;

    // ✅ Limit to only 3 grants from backend data
    const topGrants = suggestions.slice(0, 3);

    // ✅ Calculate total amount of these 3 grants
    const totalAmount = topGrants.reduce((sum, grant) => {
        const rawValue = String(grant.totalAmountAvailable || "0");

        // Extract **all numbers** from the string, even in ranges
        const numbers = (rawValue.match(/\d[\d,\.]*/g) || []).map((num) =>
            parseFloat(num.replace(/,/g, ""))
        );

        // If it's a range (like "$1,000 - $15,000"), take the **average**
        let amount = 0;
        if (numbers.length === 1) {
            amount = numbers[0];
        } else if (numbers.length === 2) {
            amount = (numbers[0] + numbers[1]) / 2;
        }

        return sum + (amount || 0);
    }, 0);

    // console.log("Total amount of top 3 grants:", totalAmount);

    useEffect(() => {
        if (totalAmount) {
            dispatch(setAiTotalAmount(totalAmount));
        }
        if (!isLoading) {
            dispatch(setNearestDeadline(nearestDeadline));
        }
    }, [totalAmount, nearestDeadline, dispatch]);


    return (
        <div>
            <h3 className="text-2xl font-bold text-night dark:text-dark-text mb-4 font-heading">
                AI-Recommended Grants
            </h3>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-mercury dark:border-dark-border animate-pulse"
                        >
                            <div className="h-32 bg-mercury/80 dark:bg-dark-border rounded mb-4"></div>
                            <div className="h-5 bg-mercury/80 dark:bg-dark-border rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-mercury/80 dark:bg-dark-border rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-mercury/80 dark:bg-dark-border rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300">
                    <p>{'We couldn’t fetch recommendations. Kindly complete your business profile to proceed.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topGrants.map((grant) => (
                        <GrantCard
                            key={grant.id}
                            grant={grant}
                            matchPercentage={grant.matchPercentage}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AiRecommendedGrants;
