// import React, { useEffect, useState } from 'react';
// import { ALL_GRANTS } from '../../../constants';
// import { matchGrants } from '../../services/geminiService';
// import GrantCard from '../../components/cards/GrantCard';
// import { SpinnerIcon, BookmarkIcon, XIcon } from '../../components/icons/Icons';
// import { motion } from 'framer-motion';
// import { getGrants } from '../../api/auth/grants';

// const FindGrants = () => {
//     const [query, setQuery] = useState('');
//     const [matchedGrants, setMatchedGrants] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [searched, setSearched] = useState(false);
//     const [error, setError] = useState(null);

//     const [businessProfile] = useState(null); // Type removed

//     const [savedSearches, setSavedSearches] = useState([]);

//     const performSearch = async (searchQuery) => { // Type removed
//         if (!searchQuery) {
//             setMatchedGrants([]);
//             setSearched(false);
//             return;
//         }
//         setIsLoading(true);
//         setSearched(true);
//         setError(null);
//         try {
//             const matches = await matchGrants(searchQuery, ALL_GRANTS, businessProfile);
//             const grantsWithPercentage = matches
//                 .map(match => {
//                     const grant = ALL_GRANTS.find(g => g.id === match.grantId);
//                     return grant ? { ...grant, matchPercentage: match.matchPercentage } : null;
//                 })
//                 .filter((g) => g !== null) // Type assertion removed
//                 .sort((a, b) => b.matchPercentage - a.matchPercentage);

//             setMatchedGrants(grantsWithPercentage);
//         } catch (error) {
//             console.error("Failed to fetch matched grants", error);
//             setMatchedGrants([]);
//             setError("Could not load grants. Please try again later.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleGetGrants = async () => {
//         try {
//             const grants = await getGrants();
//             console.log("Fetched grants:", grants);
//         } catch (error) {
//             console.error("Failed to fetch grants", error);
//         }
//     };

//     useEffect(() => {
//         handleGetGrants();
//     }, []);


//     const handleRunSavedSearch = (savedQuery) => { // Type removed
//         setQuery(savedQuery);
//         performSearch(savedQuery);
//     };

//     const handleSaveSearch = (q) => { // Type removed
//         if (q && !savedSearches.includes(q)) {
//             setSavedSearches([...savedSearches, q]);
//         }
//     };

//     const handleDeleteSearch = (q) => { // Type removed
//         setSavedSearches(savedSearches.filter(s => s !== q));
//     };

//     const handleSelectGrant = (grant, matchPercentage) => { // Type removed
//         console.log("Selected grant:", grant, "Match %:", matchPercentage);
//     };

//     const isSaveButtonDisabled = !searched || !query || savedSearches.includes(query) || isLoading;

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
//                 Find & Match Grants
//             </h2>
//             <p className="text-night/60 dark:text-dark-textMuted mb-6">
//                 Describe your business or project to find the perfect grant with AI.
//             </p>

//             {/* Search input + buttons */}
//             <div className="flex gap-2 mb-4">
//                 <input
//                     type="text"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     onKeyDown={e => e.key === 'Enter' && performSearch(query)}
//                     placeholder="e.g., a community garden project in regional Victoria"
//                     className="w-full p-4 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-dark-surface text-night dark:text-dark-text"
//                 />

//                 <motion.button
//                     onClick={() => performSearch(query)}
//                     disabled={isLoading}
//                     className="px-6 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-all duration-300 disabled:bg-mercury dark:disabled:bg-dark-border shadow-[0_0_10px_theme(colors.primary/0.4)] hover:shadow-[0_0_15px_theme(colors.primary/0.6)]"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                 >
//                     {isLoading ? <SpinnerIcon className="w-6 h-6" /> : 'Search'}
//                 </motion.button>

// <button
//     onClick={() => handleSaveSearch(query)}
//     disabled={isSaveButtonDisabled}
//     className="px-4 py-2 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-2"
// >
//     <BookmarkIcon className="w-5 h-5" />
//     Save
// </button>
//             </div>

//             {/* Saved Searches */}
//             {savedSearches.length > 0 && (
//                 <div className="mb-8 p-4 bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border">
//                     <h4 className="text-md font-bold text-night dark:text-dark-text font-heading mb-3">
//                         Saved Searches
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                         {savedSearches.map(savedQuery => (
//                             <div
//                                 key={savedQuery}
//                                 className="flex items-center gap-1 bg-mercury/50 dark:bg-dark-border rounded-full pl-3 pr-1 py-1 text-sm font-medium text-night dark:text-dark-text"
//                             >
//                                 <button
//                                     onClick={() => handleRunSavedSearch(savedQuery)}
//                                     className="hover:underline"
//                                 >
//                                     {savedQuery}
//                                 </button>
//                                 <button
//                                     onClick={() => handleDeleteSearch(savedQuery)}
//                                     className="p-1 rounded-full hover:bg-night/20 dark:hover:bg-dark-background text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
//                                 >
//                                     <XIcon className="w-3 h-3" />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Results Section */}
//             {isLoading ? (
//                 <div className="text-center p-8 flex items-center justify-center gap-3">
//                     <SpinnerIcon className="w-8 h-8 text-primary" />
//                     <p className="text-night/80 dark:text-dark-textMuted">
//                         Our AI is finding the best matches for you...
//                     </p>
//                 </div>
//             ) : error ? (
//                 <div className="text-center p-8 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300">
//                     <p>{error}</p>
//                 </div>
//             ) : (
//                 <>
//                     {!searched && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {ALL_GRANTS.slice(0, 6).map(grant => (
//                                 <GrantCard key={grant.id} grant={grant} onSelect={handleSelectGrant} />
//                             ))}
//                         </div>
//                     )}

//                     {searched && matchedGrants.length > 0 && (
//                         <>
//                             <h3 className="text-xl font-bold text-night dark:text-dark-text mb-4 font-heading">
//                                 Top AI Matches
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {matchedGrants.map(grant => (
//                                     <GrantCard
//                                         key={grant.id}
//                                         grant={grant}
//                                         onSelect={(g, p) => handleSelectGrant(g, p)}
//                                         matchPercentage={grant.matchPercentage}
//                                     />
//                                 ))}
//                             </div>
//                         </>
//                     )}

//                     {searched && matchedGrants.length === 0 && (
//                         <div className="text-center p-8 bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border">
//                             <h3 className="text-xl font-bold text-night dark:text-dark-text font-heading">
//                                 No Matches Found
//                             </h3>
//                             <p className="text-night/60 dark:text-dark-textMuted mt-2">
//                                 Try refining your search terms for better results.
//                             </p>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default FindGrants;




import React, { useEffect, useState, useMemo } from 'react';
// Remove ALL_GRANTS import if it's no longer used
import { matchGrants } from '../../services/geminiService';
import GrantCard from '../../components/cards/GrantCard';
import { SpinnerIcon, BookmarkIcon, XIcon } from '../../components/icons/Icons';
import { motion } from 'framer-motion';
import { getGrants } from '../../api/auth/grants'; // Your correct API function
import CustomPagination from '../../components/pagination/CustomPagination';

// Use the API's default/desired page size
const GRANTS_PER_PAGE = 15;

const FindGrants = () => {
    const [query, setQuery] = useState('');
    const [grants, setGrants] = useState([]); // Holds the CURRENT page of grants from the API
    const [matchedGrants, setMatchedGrants] = useState([]); // Holds client-side AI matched grants (if used)
    const [isLoading, setIsLoading] = useState(false);
    const [isAIPagination, setIsAIPagination] = useState(false); // New state to differentiate
    const [error, setError] = useState(null);

    const [businessProfile] = useState(null);
    const [savedSearches, setSavedSearches] = useState([]);

    // --- Pagination State for API Response ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    // -----------------------------------------

    // --- Core API Fetch Function ---
    const fetchGrantsFromApi = async (page = currentPage, searchQuery = query) => {
        setIsLoading(true);
        setError(null);
        setIsAIPagination(false); // Reset to API mode

        try {
            // Pass the current page, limit, and search query to the getGrants function
            const response = await getGrants(page, GRANTS_PER_PAGE, searchQuery);

            setGrants(response.data || []); // Use 'data' array
            setTotalItems(response.pagination.totalItems || 0);
            setTotalPages(response.pagination.totalPages || 1);
            setCurrentPage(response.pagination.currentPage || 1);
            setMatchedGrants([]); // Clear AI matches on general search

        } catch (e) {
            console.error("Failed to fetch grants from API", e);
            setError("Could not load grants. Please check your network or try again.");
            setGrants([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    // --- AI Search (Client-Side Slicing) Logic ---
    const performAISearch = async (searchQuery) => {
        // This is your original client-side AI logic, which requires special handling.
        // **Recommendation**: Move this logic to your backend API.

        setIsLoading(true);
        setSearched(true);
        setError(null);
        setCurrentPage(1);
        setIsAIPagination(true); // Switch to client-side pagination mode

        try {
            // Simulate AI Match on a large dataset (This is where the API should take over)
            // For now, assume ALL_GRANTS is available or the AI API returns all matches
            // Since ALL_GRANTS is removed, we'll skip the actual match and just show a message or fetch general grants

            // --- Fallback/Temporary Logic (Assuming AI Matching is API-based): ---
            // If `matchGrants` is an API call that returns the full list of matches:
            // const matches = await matchGrants(searchQuery, ALL_GRANTS_MOCK_IF_NEEDED, businessProfile);
            // setMatchedGrants(matches); 
            // setTotalItems(matches.length); 

            // Since we don't have ALL_GRANTS, let's just fall back to a regular API search
            // when the user hits the search button.

            await fetchGrantsFromApi(1, searchQuery);
            setSearched(!!searchQuery); // Set searched state based on query presence

        } catch (error) {
            console.error("Failed to perform search", error);
            setError("Could not perform search. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handlers ---

    // 1. Initial Load: Fetch the first page of grants
    useEffect(() => {
        fetchGrantsFromApi(1, query);
    }, []);

    // 2. Handle Pagination Clicks
    const handlePageChange = (page) => {
        // If we are showing client-side AI results, handle pagination locally
        if (isAIPagination && matchedGrants.length > 0) {
            setCurrentPage(page);
        } else {
            // Otherwise, fetch the new page from the API using the current search query
            fetchGrantsFromApi(page, query);
        }
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    // 3. Handle Search Button Click (use AI logic if you intend to keep it)
    const handleSearch = () => {
        if (!query) {
            // If query is empty, show the first page of all grants
            fetchGrantsFromApi(1, '');
            setSearched(false);
            return;
        }

        // If your AI logic is critical, call performAISearch:
        performAISearch(query);

        // OR, if you just want a simple API search, call:
        // fetchGrantsFromApi(1, query); 
    };

    const handleRunSavedSearch = (savedQuery) => {
        setQuery(savedQuery);
        // Triggers a new API fetch with the saved query
        fetchGrantsFromApi(1, savedQuery);
    };

    // --- Render Variables ---
    const displayGrants = isAIPagination ? matchedGrants : grants;
    const paginatedGrantsForDisplay = useMemo(() => {
        if (isAIPagination && matchedGrants.length > 0) {
            const startIndex = (currentPage - 1) * GRANTS_PER_PAGE;
            const endIndex = startIndex + GRANTS_PER_PAGE;
            return matchedGrants.slice(startIndex, endIndex);
        }
        // For API mode, `grants` already holds the page, no need to slice.
        return grants;
    }, [grants, matchedGrants, isAIPagination, currentPage]);

    const paginationTotalPages = isAIPagination
        ? Math.ceil(matchedGrants.length / GRANTS_PER_PAGE)
        : totalPages;

    const isSaveButtonDisabled = !query || savedSearches.includes(query) || isLoading;

    // ... (handleSaveSearch and handleDeleteSearch remain the same)
    // ... (handleSelectGrant remains the same)

    return (
        <div>
            {/* ... (Header, description, Saved Searches) ... */}
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
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-all duration-300 disabled:bg-mercury dark:disabled:bg-dark-border shadow-[0_0_10px_theme(colors.primary/0.4)] hover:shadow-[0_0_15px_theme(colors.primary/0.6)]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isLoading ? <SpinnerIcon className="w-6 h-6" /> : 'Search'}
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
            {/* ... (Loading/Error handling) ... */}

            {/* Display Grants */}
            {(!isLoading && !error && displayGrants.length > 0) && (
                <>
                    {/* <h3 className="text-xl font-bold text-night dark:text-dark-text mb-4 font-heading">
                        {isAIPagination ? `Top AI Matches (${totalItems} grants found)` : `Available Grants (${totalItems} total)`}
                    </h3> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedGrantsForDisplay.map(grant => (
                            <GrantCard
                                key={grant._id || grant.id}
                                grant={grant}
                                // onSelect={(g, p) => handleSelectGrant(g, p)}
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

        </div>
    );
};

export default FindGrants;