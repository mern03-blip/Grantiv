import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getGrants, handleGetFavoriteGrants } from "../../api/endpoints/grants";
import GrantCard from "../../components/cards/GrantCard";
import CustomPagination from "../../components/pagination/CustomPagination";
import Loader from "../../components/loading/Loader";
import { SpinnerIcon } from "../../components/icons/Icons";
import { CiFilter } from "react-icons/ci";
import { Dropdown } from "antd";
import { useDispatch } from "react-redux";
import { setSavedGrants } from "../../redux/slices/favoriteGrantSlice";

const FindGrants = () => {
  const dispatch = useDispatch();

  // --- Local states ---
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedGrants, setMatchedGrants] = useState([]);
  const [isAIPagination, setIsAIPagination] = useState(false);
  const [grantsPerPage, setGrantsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState("date_soonest");

  // Updated fetch function to accept filters
  const fetchGrants = async ({ queryKey }) => {
    const [, page, searchQuery, grantsPerPage, sortOption] = queryKey;

    const response = await getGrants({
      page,
      limit: grantsPerPage,
      search: searchQuery,
      sortFilter: sortOption || "",
    });

    return response;
  };

  // --- Fetch Grants with TanStack Query (now includes filters in queryKey) ---
  const {
    data: Grants,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      "grants",
      currentPage,
      searchQuery,
      grantsPerPage,
      sortOption,
    ],
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
    window.scrollTo({ top: 300, behavior: "smooth" });
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

  // Fetch all fav grant to for fav toggle btn
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { data } = await handleGetFavoriteGrants();
        dispatch(setSavedGrants(data || []));
      } catch (err) {
        console.error("Error loading favorite grants:", err);
      }
    };
    loadFavorites();
  }, [dispatch]);

  // --- Derived values for rendering ---
  const paginatedGrantsForDisplay = useMemo(() => {
    if (isAIPagination && matchedGrants.length > 0) {
      const startIndex = (currentPage - 1) * grantsPerPage;
      const endIndex = startIndex + grantsPerPage;
      return matchedGrants.slice(startIndex, endIndex);
    }
    return grants;
  }, [grants, matchedGrants, isAIPagination, currentPage, grantsPerPage]);

  const paginationTotalPages = isAIPagination
    ? Math.ceil(matchedGrants.length / grantsPerPage)
    : totalPages;

  const isGlobalLoading = isLoading || isFetching;

  // ✅ Check if any filters are active
  const hasActiveFilters = sortOption !== "";

  // ✅ Get filter label for display
  const getFilterLabel = () => {
    const filterLabels = {
      title_asc: "Ascending: A-Z",
      title_desc: "Descending: Z-A",
      date_latest: "Soonest to Latest",
      date_soonest: "Latest to Soonest",
      amount_high: "High to Low",
      amount_low: "Low to High",
      recent_added: "Recently Added",
      recent_updated: "Recently Updated",
    };
    return filterLabels[sortOption] || "Filter";
  };

  // --- Conditional rendering ---
  if (isLoading && !isFetching) return <Loader />;

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-100 rounded-lg">
        Error loading grants: {error.message || "An unknown error occurred."}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
        Find & Match Grants
      </h2>
      <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-4 sm:mb-6">
        Describe your business or project to find the perfect grant with AI.
      </p>

      {/* Search Input + Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={`Total Available Grants: ${totalItems}`}
          className="w-[66%] p-3 sm:p-4 text-sm sm:text-base border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-dark-surface text-night dark:text-dark-text"
        />

        <div className="flex gap-2">
          <motion.button
            onClick={handleSearch}
            disabled={isGlobalLoading}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-all duration-300 disabled:bg-mercury dark:disabled:bg-dark-border shadow-[0_0_10px_theme(colors.primary/0.4)] hover:shadow-[0_0_15px_theme(colors.primary/0.6)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading || isFetching ? (
              <SpinnerIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              "Search"
            )}
          </motion.button>

          <Dropdown
            menu={{
              items: [
                { key: "title_asc", label: "Grant Title: Ascending" },
                { key: "title_desc", label: "Grant Title: Descending" },
                {
                  key: "date_latest",
                  label: "Closing Date: Soonest to Latest",
                },
                {
                  key: "date_soonest",
                  label: "Closing Date: Latest to Soonest",
                },
                { key: "amount_high", label: "Amount: High to Low" },
                { key: "amount_low", label: "Amount: Low to High" },
                { key: "recent_added", label: "Most Recently Added" },
                { key: "recent_updated", label: "Most Recently Updated" },
              ],
              onClick: ({ key }) => {
                setSortOption(key);
                setCurrentPage(1);
              },
            }}
            trigger={["click"]}
          >
            <button className="w-[220px] px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text text-sm sm:text-base font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2">
              <CiFilter size={20} className="sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">
                {hasActiveFilters ? getFilterLabel() : "Filter"}
              </span>
            </button>
          </Dropdown>
        </div>
      </div>

      {/* Display Grants */}
      {!isGlobalLoading && paginatedGrantsForDisplay.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
            <div className="mt-6 sm:mt-8">
              <CustomPagination
                currentPage={currentPage}
                totalPages={paginationTotalPages}
                onPageChange={handlePageChange}
                grantsPerPage={grantsPerPage}
                onGrantsPerPageChange={(value) => {
                  setGrantsPerPage(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!isGlobalLoading && paginatedGrantsForDisplay.length === 0 && (
        <p className="text-center text-sm sm:text-base text-night/60 dark:text-dark-textMuted mt-6 sm:mt-8">
          No grants found!
        </p>
      )}
    </div>
  );
};

export default FindGrants;