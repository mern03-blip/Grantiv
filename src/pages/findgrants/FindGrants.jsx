import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { matchGrants } from '../../services/geminiService'; // Assume this is the AI matching service
import GrantCard from '../../components/cards/GrantCard';
import { SpinnerIcon, BookmarkIcon, XIcon } from '../../components/icons/Icons';
import { motion } from 'framer-motion';
import { getGrants } from '../../api/endpoints/grants';
import CustomPagination from '../../components/pagination/CustomPagination';
import Loader from '../../components/loading/Loader';

// Use the API's default/desired page size
const GRANTS_PER_PAGE = 10;

// Utility function to fetch data for TanStack Query
const fetchGrants = async ({ queryKey }) => {
    // queryKey: ['grants', page, searchQuery]
    const [, page, searchQuery] = queryKey;
    const response = await getGrants(page, GRANTS_PER_PAGE, searchQuery);
    return response; // Return the full response object { data, pagination }
};

const FindGrants = () => {
    const [query, setQuery] = useState(''); // Holds the search input value
    const [searchQuery, setSearchQuery] = useState(''); // Holds the query used for the API/AI search
    const [matchedGrants, setMatchedGrants] = useState([]); // Holds client-side AI matched grants (if used)
    const [isAIPagination, setIsAIPagination] = useState(false); // New state to differentiate AI vs API

    const [businessProfile] = useState(null);
    const [savedSearches, setSavedSearches] = useState([]);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    // -------------------------

    // --- TanStack Query for API Grants Fetching ---
    const {
        data: apiResponse,
        isLoading,
        error,
        isFetching,
    } = useQuery({
        // The query key includes the search query and the current page
        // This ensures a refetch happens when either changes
        queryKey: ['grants', currentPage, searchQuery],
        queryFn: fetchGrants,
        // The query is only enabled when not in AI pagination mode, or if the search is empty
        enabled: !isAIPagination,
        staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
        keepPreviousData: true, // Keep showing old data while fetching new page/query
    });

    // Extracting data from API response or setting defaults
    const grants = apiResponse?.data || [];
    const totalItems = apiResponse?.pagination.totalItems || 0;
    const totalPages = apiResponse?.pagination.totalPages || 1;

    // --- AI Search (Client-Side Slicing) Logic ---
    const performAISearch = async (searchQueryInput) => {
        setIsAIPagination(true); // Switch to client-side pagination mode
        setCurrentPage(1); // Reset to page 1 for a new search
        setSearchQuery(searchQueryInput); // Set the query used for the search

        // --- TEMPORARY: Fallback to regular API search since ALL_GRANTS is not available ---
        // In a real scenario, you would call your AI endpoint and get a full list of matches
        // For now, we'll force the API query by setting isAIPagination back to false 
        // and letting the TanStack Query run.

        // This part would be the actual AI matching logic:
        // try {
        //     const matches = await matchGrants(searchQueryInput, null, businessProfile);
        //     setMatchedGrants(matches); 
        //     setTotalItems(matches.length); // Update total items for AI match
        //     // ... other state updates for AI results
        // } catch (e) { /* handle error */ }

        // Fallback to API search immediately after setting states
        // This causes the `useQuery` to run with the new `searchQuery`
        setIsAIPagination(false);
    };

    // --- Handlers ---

    // 1. Handle Pagination Clicks
    const handlePageChange = (page) => {
        setCurrentPage(page);

        // If we are showing client-side AI results, TanStack Query is disabled, 
        // and we just update the page state.
        if (isAIPagination && matchedGrants.length > 0) {
            // Local change, no fetch needed
        } else {
            // For API mode, `setCurrentPage` triggers a refetch via `useQuery` because 
            // `currentPage` is in the `queryKey`.
        }
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    // 2. Handle Search Button Click
    const handleSearch = () => {
        if (!query) {
            // If query is empty, set searchQuery to empty string, and reset page
            setSearchQuery('');
            setCurrentPage(1);
            setIsAIPagination(false); // Ensure API mode
            return;
        }

        // Use AI logic (which currently falls back to API search)
        performAISearch(query);
    };

    const handleRunSavedSearch = (savedQuery) => {
        setQuery(savedQuery); // Update the input field
        setSearchQuery(savedQuery); // Update the search key
        setCurrentPage(1); // Reset page to 1
        setIsAIPagination(false); // Ensure API mode
        // TanStack Query automatically refetches because `searchQuery` changes.
    };

    // --- Render Variables ---

    // Determine which grants and pagination to use
    const paginatedGrantsForDisplay = useMemo(() => {
        if (isAIPagination && matchedGrants.length > 0) {
            const startIndex = (currentPage - 1) * GRANTS_PER_PAGE;
            const endIndex = startIndex + GRANTS_PER_PAGE;
            return matchedGrants.slice(startIndex, endIndex);
        }
        // In API mode, `grants` is already the current page
        return grants;
    }, [grants, matchedGrants, isAIPagination, currentPage]);

    const paginationTotalPages = isAIPagination
        ? Math.ceil(matchedGrants.length / GRANTS_PER_PAGE)
        : totalPages;

    const isSaveButtonDisabled = !query || savedSearches.includes(query) || isFetching; // Use isFetching
    const isGlobalLoading = isLoading || isFetching; // Distinguish between initial load and refetch

    // ... (handleSaveSearch and handleDeleteSearch remain the same)
    // ... (handleSelectGrant remains the same)

    // Conditional render for loading/error
    if (isLoading && !isFetching) { // Only show full loading on initial fetch
        return (
            <Loader />
        );
    }

    // Note: Error handling is simplified; consider a more detailed UI for real app.
    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-100 rounded-lg">
                Error loading grants: {error.message || "An unknown error occurred."}
            </div>
        );
    }


    return (
        <div>
            {/* ... (Header, description) ... */}
            <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
                Find & Match Grants
            </h2>
            <p className="text-night/60 dark:text-dark-textMuted mb-6">
                Describe your business or project to find the perfect grant with AI.
            </p>
            {/* Search input + buttons */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g., a community garden project in regional Victoria"
                    className="w-full p-4 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-dark-surface text-night dark:text-dark-text"
                />

                <motion.button
                    onClick={handleSearch}
                    disabled={isGlobalLoading}
                    className="px-6 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-all duration-300 disabled:bg-mercury dark:disabled:bg-dark-border shadow-[0_0_10px_theme(colors.primary/0.4)] hover:shadow-[0_0_15px_theme(colors.primary/0.6)]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {(isLoading || isFetching) ? <SpinnerIcon className="w-6 h-6" /> : 'Search'}
                </motion.button>
                {/* ... (Save Button) ... */}
                <button
                    onClick={() => handleRunSavedSearch(query)}
                    disabled={isSaveButtonDisabled}
                    className="px-4 py-2 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <BookmarkIcon className="w-5 h-5" />
                    Save
                </button>
            </div>

            {/* Results Section */}
            {(isFetching && !isLoading && <p className="text-center text-primary mb-4">Updating results...</p>)}

            {/* Display Grants */}
            {(!isGlobalLoading && paginatedGrantsForDisplay.length > 0) && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedGrantsForDisplay.map(grant => (
                            <GrantCard
                                key={grant._id || grant.id}
                                grant={grant}
                                matchPercentage={grant.matchPercentage}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {paginationTotalPages > 1 && (
                        <div className="mt-8">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={paginationTotalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {(!isGlobalLoading && paginatedGrantsForDisplay.length === 0) && (
                <p className="text-center text-night/60 dark:text-dark-textMuted mt-8">
                    No grants found matching your search. Try a different query.
                </p>
            )}
        </div>
    );
};

export default FindGrants;