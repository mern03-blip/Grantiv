import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGrants } from '../../api/endpoints/grants';
import GrantCard from '../../components/cards/GrantCard';
import CustomPagination from '../../components/pagination/CustomPagination';
import Loader from '../../components/loading/Loader';
import { SpinnerIcon, BookmarkIcon } from '../../components/icons/Icons';
import { Select } from 'antd';
// import { Select } from 'antd';

const GRANTS_PER_PAGE = 10;

// Fetch function for TanStack Query
const fetchGrants = async ({ queryKey }) => {
  const [, page, searchQuery] = queryKey;
  const response = await getGrants(page, GRANTS_PER_PAGE, searchQuery);
  return response;
};

const FindGrants = () => {
  const navigate = useNavigate();

  // --- Local states (no URL params) ---
  const [currentPage, setCurrentPage] = useState(1); // ✅ Local state for page
  const [query, setQuery] = useState(''); // for input field
  const [searchQuery, setSearchQuery] = useState(''); // used in API calls
  const [matchedGrants, setMatchedGrants] = useState([]);
  const [isAIPagination, setIsAIPagination] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);


  // --- Fetch Grants with TanStack Query ---
  const {
    data: Grants,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['grants', currentPage, searchQuery],
    queryFn: fetchGrants,
    enabled: !isAIPagination,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  // Extract data
  const grants = Grants?.data || [];
  const totalItems = Grants?.pagination.totalItems || 0;
  const totalPages = Grants?.pagination.totalPages || 1;

  // --- Search Logic ---
  const performAISearch = async (searchQueryInput) => {
    setSearchQuery(searchQueryInput);
    setIsAIPagination(false);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // --- Handlers ---
  const handlePageChange = (page) => {
    setCurrentPage(page); // ✅ Just update local state
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // ✅ Automatically refetch when input is cleared
  useEffect(() => {
    if (query.trim() === "") {
      setSearchQuery("");
      setIsAIPagination(false);
      setCurrentPage(1); // Reset to page 1
    }
  }, [query]);

  const handleSearch = () => {
    const newQuery = query.trim();
    if (!newQuery) return;
    performAISearch(newQuery);
  };

  const handleRunSavedSearch = (savedQuery) => {
    setQuery(savedQuery);
    setSearchQuery(savedQuery);
    setIsAIPagination(false);
    setCurrentPage(1);
  };

  // --- Derived values for rendering ---
  const paginatedGrantsForDisplay = useMemo(() => {
    if (isAIPagination && matchedGrants.length > 0) {
      const startIndex = (currentPage - 1) * GRANTS_PER_PAGE;
      const endIndex = startIndex + GRANTS_PER_PAGE;
      return matchedGrants.slice(startIndex, endIndex);
    }
    return grants;
  }, [grants, matchedGrants, isAIPagination, currentPage]);

  const paginationTotalPages = isAIPagination
    ? Math.ceil(matchedGrants.length / GRANTS_PER_PAGE)
    : totalPages;

  const isSaveButtonDisabled = !query.trim() || savedSearches.includes(query.trim()) || isFetching;
  const isGlobalLoading = isLoading || isFetching;

  // --- Conditional rendering ---
  if (isLoading && !isFetching) return <Loader />;

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-100 rounded-lg">
        Error loading grants: {error.message || 'An unknown error occurred.'}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
        Find & Match Grants
      </h2>
      <p className="text-night/60 dark:text-dark-textMuted mb-6">
        Describe your business or project to find the perfect grant with AI.
      </p>

      {/* Search Input + Buttons */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

        <button
          onClick={() => handleRunSavedSearch(query)}
          disabled={isSaveButtonDisabled}
          className="px-4 py-2 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-2"
        >
          <BookmarkIcon className="w-5 h-5" />
          Save
        </button>
      </div>

      {/* Loading State */}
      {/* {isFetching && !isLoading && (
        <p className="text-center text-primary mb-4">Updating results...</p>
      )} */}

      {/* Display Grants */}
      {!isGlobalLoading && paginatedGrantsForDisplay.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGrantsForDisplay.map((grant) => (
              <GrantCard
                key={grant._id || grant.id}
                grant={grant}
                matchPercentage={grant.matchPercentage}
              />
            ))}
          </div>

          {/* Left side: page size dropdown */}
          {/* <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">Show:</span>
            <Select
              // value={pageSize}
              // onChange={(value) => onPageSizeChange(value)}
              options={[
                { value: 10, label: "10 grants" },
                { value: 25, label: "25 grants" },
                { value: 50, label: "50 grants" },
                { value: 100, label: "100 grants" },
              ]}
              className="min-w-[120px]"
              dropdownStyle={{ borderRadius: "8px" }}
            />
          </div> */}

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

      {/* No Results */}
      {!isGlobalLoading && paginatedGrantsForDisplay.length === 0 && (
        <p className="text-center text-night/60 dark:text-dark-textMuted mt-8">
          No grants found matching your search.
        </p>
      )}
    </div>
  );
};

export default FindGrants;



//Parama issue
// import React, { useState, useMemo, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { getGrants } from '../../api/endpoints/grants';
// import GrantCard from '../../components/cards/GrantCard';
// import CustomPagination from '../../components/pagination/CustomPagination';
// import Loader from '../../components/loading/Loader';
// import { SpinnerIcon, BookmarkIcon } from '../../components/icons/Icons';

// const GRANTS_PER_PAGE = 10;

// const fetchGrants = async ({ queryKey }) => {
//   const [, page, searchQuery] = queryKey;

//   // ✅ Dynamically decide limit based on search mode
//   const apiLimit = searchQuery ? 1000 : GRANTS_PER_PAGE; // send big limit during search
//   const apiPage = searchQuery ? 1 : page;

//   const response = await getGrants(apiPage, apiLimit, searchQuery);
//   return response;
// };

// const FindGrants = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // --- Extract page number from URL ---
//   const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const urlPage = parseInt(searchParams.get('page')) || 1;
//   const currentPage = urlPage;

//   // --- Local states ---
//   const [query, setQuery] = useState(''); // for input field
//   const [searchQuery, setSearchQuery] = useState(''); // used in API calls
//   const [matchedGrants, setMatchedGrants] = useState([]);
//   const [isAIPagination, setIsAIPagination] = useState(false);
//   const [savedSearches, setSavedSearches] = useState([]);

//   // --- Update URL only with page (not search) ---
//   const updateUrlParams = (page) => {
//     const newSearchParams = new URLSearchParams();
//     if (page > 1) {
//       newSearchParams.set('page', page);
//     }
//     navigate(`${location.pathname}?${newSearchParams.toString()}`);
//   };

//   // --- Fetch Grants with TanStack Query ---
//   const {
//     data: Grants,
//     isLoading,
//     error,
//     isFetching,
//   } = useQuery({
//     queryKey: ['grants', currentPage, searchQuery],
//     queryFn: fetchGrants,
//     enabled: !isAIPagination,
//     staleTime: 5 * 60 * 1000,
//     keepPreviousData: true,
//   });

//   // Extract data
//   const grants = Grants?.data || [];
//   const totalItems = Grants?.pagination.totalItems || 0;
//   const totalPages = Grants?.pagination.totalPages || 1;

//   // --- Search Logic ---
//   const performAISearch = async (searchQueryInput) => {
//     setSearchQuery(searchQueryInput);
//     setIsAIPagination(false);
//   };

//   // --- Handlers ---
//   const handlePageChange = (page) => {
//     updateUrlParams(page);
//     window.scrollTo({ top: 300, behavior: 'smooth' });
//   };

//   // ✅ Automatically refetch when input is cleared
//   useEffect(() => {
//     if (query.trim() === "") {
//       setSearchQuery("");   // reset the search query
//       setIsAIPagination(false);
//       navigate(`${location.pathname}?page=${currentPage}`);
//     }
//   }, [query]);

//   const handleSearch = () => {
//     const newQuery = query.trim();

//     if (!newQuery) return; // ✅ don't trigger search if input empty

//     // Run new search
//     performAISearch(newQuery);
//     setPage?.(1);
//   };

//   const handleRunSavedSearch = (savedQuery) => {
//     setQuery(savedQuery);
//     setSearchQuery(savedQuery);
//     setIsAIPagination(false);
//   };

//   const paginatedGrantsForDisplay = useMemo(() => {
//     // ✅ If searching → show all results directly
//     if (searchQuery && grants.length > 0) {
//       return grants;
//     }

//     // ✅ Normal pagination for non-search
//     if (isAIPagination && matchedGrants.length > 0) {
//       const startIndex = (currentPage - 1) * GRANTS_PER_PAGE;
//       const endIndex = startIndex + GRANTS_PER_PAGE;
//       return matchedGrants.slice(startIndex, endIndex);
//     }
//     return grants;
//   }, [grants, matchedGrants, isAIPagination, currentPage, searchQuery]);


//   const paginationTotalPages = isAIPagination
//     ? Math.ceil(matchedGrants.length / GRANTS_PER_PAGE)
//     : totalPages;

//   const isSaveButtonDisabled = !query.trim() || savedSearches.includes(query.trim()) || isFetching;
//   const isGlobalLoading = isLoading || isFetching;

//   // --- Conditional rendering ---
//   if (isLoading && !isFetching) return <Loader />;

//   if (error) {
//     return (
//       <div className="text-red-500 p-4 bg-red-100 rounded-lg">
//         Error loading grants: {error.message || 'An unknown error occurred.'}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
//         Find & Match Grants
//       </h2>
//       <p className="text-night/60 dark:text-dark-textMuted mb-6">
//         Describe your business or project to find the perfect grant with AI.
//       </p>

//       {/* Search Input + Buttons */}
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//           placeholder="e.g., a community garden project in regional Victoria"
//           className="w-full p-4 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-dark-surface text-night dark:text-dark-text"
//         />

//         <motion.button
//           onClick={handleSearch}
//           disabled={isGlobalLoading}
//           className="px-6 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-all duration-300 disabled:bg-mercury dark:disabled:bg-dark-border shadow-[0_0_10px_theme(colors.primary/0.4)] hover:shadow-[0_0_15px_theme(colors.primary/0.6)]"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           {(isLoading || isFetching) ? <SpinnerIcon className="w-6 h-6" /> : 'Search'}
//         </motion.button>

//         <button
//           onClick={() => handleRunSavedSearch(query)}
//           disabled={isSaveButtonDisabled}
//           className="px-4 py-2 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-2"
//         >
//           <BookmarkIcon className="w-5 h-5" />
//           Save
//         </button>
//       </div>

//       {/* Loading State */}
//       {/* {isFetching && !isLoading && (
//         <p className="text-center text-primary mb-4">Updating results...</p>
//       )} */}

//       {/* Display Grants */}
//       {!isGlobalLoading && paginatedGrantsForDisplay.length > 0 && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {paginatedGrantsForDisplay.map((grant) => (
//               <GrantCard
//                 key={grant._id || grant.id}
//                 grant={grant}
//                 matchPercentage={grant.matchPercentage}
//               />
//             ))}
//           </div>

//           {/* Pagination */}
//           {!searchQuery && paginationTotalPages > 1 && (
//             <div className="mt-8">
//               <CustomPagination
//                 currentPage={currentPage}
//                 totalPages={paginationTotalPages}
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           )}

//         </>
//       )}

//       {/* No Results */}
//       {!isGlobalLoading && paginatedGrantsForDisplay.length === 0 && (
//         <p className="text-center text-night/60 dark:text-dark-textMuted mt-8">
//           No grants found matching your search.
//         </p>
//       )}
//     </div>
//   );
// };

// export default FindGrants;




