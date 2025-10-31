// import React, { useState, useMemo, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { getGrants } from '../../api/endpoints/grants';
// import GrantCard from '../../components/cards/GrantCard';
// import CustomPagination from '../../components/pagination/CustomPagination';
// import Loader from '../../components/loading/Loader';
// import { SpinnerIcon, BookmarkIcon } from '../../components/icons/Icons';
// import { Select } from 'antd';
// import { CiFilter } from 'react-icons/ci';
// import SearchFilterPopup from './components/SearchFilterPopup';
// import { useCitiesQuery } from '../../hooks/useGetCities';
// // import { Select } from 'antd';

// const GRANTS_PER_PAGE = 10;

// // Fetch function for TanStack Query
// const fetchGrants = async ({ queryKey }) => {
//   const [, page, searchQuery] = queryKey;
//   const response = await getGrants(page, GRANTS_PER_PAGE, searchQuery);
//   return response;
// };

// const FindGrants = () => {
//   const navigate = useNavigate();

//   // --- Local states (no URL params) ---
//   const [currentPage, setCurrentPage] = useState(1); // ✅ Local state for page
//   const [query, setQuery] = useState(''); // for input field
//   const [searchQuery, setSearchQuery] = useState(''); // used in API calls
//   const [matchedGrants, setMatchedGrants] = useState([]);
//   const [isAIPagination, setIsAIPagination] = useState(false);
//   const [savedSearches, setSavedSearches] = useState([]);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);


//   const { data: cities = [] } = useCitiesQuery();
 

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
//     setCurrentPage(1); // Reset to page 1 on new search
//   };

//   // --- Handlers ---
//   const handlePageChange = (page) => {
//     setCurrentPage(page); // ✅ Just update local state
//     window.scrollTo({ top: 300, behavior: 'smooth' });
//   };

//   // ✅ Automatically refetch when input is cleared
//   useEffect(() => {
//     if (query.trim() === "") {
//       setSearchQuery("");
//       setIsAIPagination(false);
//       setCurrentPage(1); // Reset to page 1
//     }
//   }, [query]);

//   const handleSearch = () => {
//     const newQuery = query.trim();
//     if (!newQuery) return;
//     performAISearch(newQuery);
//   };

//   const handleRunSavedSearch = (savedQuery) => {
//     setQuery(savedQuery);
//     setSearchQuery(savedQuery);
//     setIsAIPagination(false);
//     setCurrentPage(1);
//   };

//   // --- Derived values for rendering ---
//   const paginatedGrantsForDisplay = useMemo(() => {
//     if (isAIPagination && matchedGrants.length > 0) {
//       const startIndex = (currentPage - 1) * GRANTS_PER_PAGE;
//       const endIndex = startIndex + GRANTS_PER_PAGE;
//       return matchedGrants.slice(startIndex, endIndex);
//     }
//     return grants;
//   }, [grants, matchedGrants, isAIPagination, currentPage]);

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
//           // onClick={() => handleRunSavedSearch(query)}
//           onClick={() => setIsPopupOpen(true)}
//           className="px-4 py-1 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-2"
//         >
//           {/* <BookmarkIcon className="w-5 h-5" /> */}
//           <CiFilter size={24} />
//           Filter
//         </button>
//         {/* THE POP-UP COMPONENT */}
//         <SearchFilterPopup
//           isOpen={isPopupOpen}
//           onClose={() => setIsPopupOpen(false)}
//           cities={cities}
//         // onSave={handleSaveSearch}
//         />
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

//           {/* Left side: page size dropdown */}
//           {/* <div className="flex items-center gap-3">
//             <span className="text-sm text-gray-600 dark:text-gray-300">Show:</span>
//             <Select
//               // value={pageSize}
//               // onChange={(value) => onPageSizeChange(value)}
//               options={[
//                 { value: 10, label: "10 grants" },
//                 { value: 25, label: "25 grants" },
//                 { value: 50, label: "50 grants" },
//                 { value: 100, label: "100 grants" },
//               ]}
//               className="min-w-[120px]"
//               dropdownStyle={{ borderRadius: "8px" }}
//             />
//           </div> */}

//           {/* Pagination */}
//           {paginationTotalPages > 1 && (
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
import { CiFilter } from 'react-icons/ci';
import SearchFilterPopup from './components/SearchFilterPopup';
import { useCitiesQuery } from '../../hooks/useGetCities';

const GRANTS_PER_PAGE = 10;

// Updated fetch function to accept filters
const fetchGrants = async ({ queryKey }) => {
  const [, page, searchQuery, filters] = queryKey;
  
  const response = await getGrants({
    page,
    limit: GRANTS_PER_PAGE,
    search: searchQuery,
    filterLocation: filters.city || '',
    filterAgency: filters.agencyName || '',
    minAmount: filters.minAmount || '',
    maxAmount: filters.maxAmount || '',
  });
  
  return response;
};

const FindGrants = () => {
  const navigate = useNavigate();

  // --- Local states ---
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedGrants, setMatchedGrants] = useState([]);
  const [isAIPagination, setIsAIPagination] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // ✅ NEW: State for filters
  const [filters, setFilters] = useState({
    city: '',
    agencyName: '',
    minAmount: '',
    maxAmount: '',
  });

  const { data: cities = [] } = useCitiesQuery();

  // --- Fetch Grants with TanStack Query (now includes filters in queryKey) ---
  const {
    data: Grants,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['grants', currentPage, searchQuery, filters], // ✅ Added filters to queryKey
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
    setCurrentPage(1);
  };

  // --- Handlers ---
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // ✅ Automatically refetch when input is cleared
  useEffect(() => {
    if (query.trim() === "") {
      setSearchQuery("");
      setIsAIPagination(false);
      setCurrentPage(1);
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

  // ✅ NEW: Handle filter save
  const handleSaveFilters = (filterData) => {
    setFilters({
      city: filterData.city || '',
      agencyName: filterData.agencyName || '',
      minAmount: filterData.minAmount || '',
      maxAmount: filterData.maxAmount || '',
    });
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // ✅ NEW: Clear filters function
  const handleClearFilters = () => {
    setFilters({
      city: '',
      agencyName: '',
      minAmount: '',
      maxAmount: '',
    });
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

  // ✅ Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-1 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-2"
        >
          <CiFilter size={24} />
          Filter
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-primary text-night text-xs rounded-full">
              Active
            </span>
          )}
        </button>

        {/* Clear Filters Button (only show when filters are active) */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Clear Filters
          </button>
        )}

        {/* Filter Popup */}
        <SearchFilterPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          cities={cities}
          onSave={handleSaveFilters}
          initialFilters={filters} // Pass current filters to popup
        />
      </div>

      {/* Display active filters */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <p className="text-sm font-semibold text-night dark:text-dark-text mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.city && (
              <span className="px-3 py-1 bg-white dark:bg-dark-surface rounded-full text-sm">
                City: {filters.city}
              </span>
            )}
            {filters.agencyName && (
              <span className="px-3 py-1 bg-white dark:bg-dark-surface rounded-full text-sm">
                Agency: {filters.agencyName}
              </span>
            )}
            {filters.minAmount && (
              <span className="px-3 py-1 bg-white dark:bg-dark-surface rounded-full text-sm">
                Min: ${filters.minAmount}
              </span>
            )}
            {filters.maxAmount && (
              <span className="px-3 py-1 bg-white dark:bg-dark-surface rounded-full text-sm">
                Max: ${filters.maxAmount}
              </span>
            )}
          </div>
        </div>
      )}

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




