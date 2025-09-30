import React, { useState } from 'react';
import { ALL_GRANTS } from '../../../constants';
import { matchGrants } from '../../services/geminiService';
import GrantCard from '../../components/cards/GrantCard';
import { SpinnerIcon, BookmarkIcon, XIcon } from '../../components/icons/Icons';
import { motion } from 'framer-motion';

const FindGrants = () => {
    const [query, setQuery] = useState('');
    const [matchedGrants, setMatchedGrants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState(null);

    const [businessProfile] = useState(null); // Type removed

    const [savedSearches, setSavedSearches] = useState([]);

    const performSearch = async (searchQuery) => { // Type removed
        if (!searchQuery) {
            setMatchedGrants([]);
            setSearched(false);
            return;
        }
        setIsLoading(true);
        setSearched(true);
        setError(null);
        try {
            const matches = await matchGrants(searchQuery, ALL_GRANTS, businessProfile);
            const grantsWithPercentage = matches
                .map(match => {
                    const grant = ALL_GRANTS.find(g => g.id === match.grantId);
                    return grant ? { ...grant, matchPercentage: match.matchPercentage } : null;
                })
                .filter((g) => g !== null) // Type assertion removed
                .sort((a, b) => b.matchPercentage - a.matchPercentage);

            setMatchedGrants(grantsWithPercentage);
        } catch (error) {
            console.error("Failed to fetch matched grants", error);
            setMatchedGrants([]);
            setError("Could not load grants. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunSavedSearch = (savedQuery) => { // Type removed
        setQuery(savedQuery);
        performSearch(savedQuery);
    };

    const handleSaveSearch = (q) => { // Type removed
        if (q && !savedSearches.includes(q)) {
            setSavedSearches([...savedSearches, q]);
        }
    };

    const handleDeleteSearch = (q) => { // Type removed
        setSavedSearches(savedSearches.filter(s => s !== q));
    };

    const handleSelectGrant = (grant, matchPercentage) => { // Type removed
        console.log("Selected grant:", grant, "Match %:", matchPercentage);
    };

    const isSaveButtonDisabled = !searched || !query || savedSearches.includes(query) || isLoading;

    return (
        <div>
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
                    onKeyDown={e => e.key === 'Enter' && performSearch(query)}
                    placeholder="e.g., a community garden project in regional Victoria"
                    className="w-full p-4 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-dark-surface text-night dark:text-dark-text"
                />

                <motion.button
                    onClick={() => performSearch(query)}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-all duration-300 disabled:bg-mercury dark:disabled:bg-dark-border shadow-[0_0_10px_theme(colors.primary/0.4)] hover:shadow-[0_0_15px_theme(colors.primary/0.6)]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isLoading ? <SpinnerIcon className="w-6 h-6" /> : 'Search'}
                </motion.button>

                <button
                    onClick={() => handleSaveSearch(query)}
                    disabled={isSaveButtonDisabled}
                    className="px-4 py-2 bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border text-night dark:text-dark-text font-semibold rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-border/50 transition-all duration-300 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/50 dark:disabled:text-dark-textMuted disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <BookmarkIcon className="w-5 h-5" />
                    Save
                </button>
            </div>

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
                <div className="mb-8 p-4 bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border">
                    <h4 className="text-md font-bold text-night dark:text-dark-text font-heading mb-3">
                        Saved Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {savedSearches.map(savedQuery => (
                            <div
                                key={savedQuery}
                                className="flex items-center gap-1 bg-mercury/50 dark:bg-dark-border rounded-full pl-3 pr-1 py-1 text-sm font-medium text-night dark:text-dark-text"
                            >
                                <button
                                    onClick={() => handleRunSavedSearch(savedQuery)}
                                    className="hover:underline"
                                >
                                    {savedQuery}
                                </button>
                                <button
                                    onClick={() => handleDeleteSearch(savedQuery)}
                                    className="p-1 rounded-full hover:bg-night/20 dark:hover:bg-dark-background text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text"
                                >
                                    <XIcon className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Results Section */}
            {isLoading ? (
                <div className="text-center p-8 flex items-center justify-center gap-3">
                    <SpinnerIcon className="w-8 h-8 text-primary" />
                    <p className="text-night/80 dark:text-dark-textMuted">
                        Our AI is finding the best matches for you...
                    </p>
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300">
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    {!searched && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ALL_GRANTS.slice(0, 6).map(grant => (
                                <GrantCard key={grant.id} grant={grant} onSelect={handleSelectGrant} />
                            ))}
                        </div>
                    )}

                    {searched && matchedGrants.length > 0 && (
                        <>
                            <h3 className="text-xl font-bold text-night dark:text-dark-text mb-4 font-heading">
                                Top AI Matches
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matchedGrants.map(grant => (
                                    <GrantCard
                                        key={grant.id}
                                        grant={grant}
                                        onSelect={(g, p) => handleSelectGrant(g, p)}
                                        matchPercentage={grant.matchPercentage}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {searched && matchedGrants.length === 0 && (
                        <div className="text-center p-8 bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border">
                            <h3 className="text-xl font-bold text-night dark:text-dark-text font-heading">
                                No Matches Found
                            </h3>
                            <p className="text-night/60 dark:text-dark-textMuted mt-2">
                                Try refining your search terms for better results.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FindGrants;