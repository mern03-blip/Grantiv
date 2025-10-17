import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GrantCard from '../cards/GrantCard';
import axiosInstance from '../../api/axios/axiosInstance';


const AiRecommendedGrants = ({ onSelectGrant }) => {
    // State to hold the fetched grant suggestions
    const [suggestions, setSuggestions] = useState([]);
    // State to manage the loading skeleton UI
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    // State to handle and display any errors
    const [error, setError] = useState(null);

    useEffect(() => {
        // This function fetches the AI recommendations from your backend
        const fetchRecommendations = async () => {
            setIsLoadingSuggestions(true);
            setError(null);

            try {
                // Get the required token and organization ID from local storage
                const token = localStorage.getItem('token');
                const organizationId = localStorage.getItem('orgId');

                if (!token || !organizationId) {
                    throw new Error("Authentication details are missing. Please log in again.");
                }
                
                // Configure the request headers
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-Organization-ID': organizationId,
                    },
                };

                // Make the API call to your backend
                const response = await axiosInstance.get('/organizations/recommendations', config);

                // ✅ Transform the backend data to match the frontend component's needs
                const formattedSuggestions = response.data.map(grant => ({
                    ...grant, // Keep all original grant data
                    id: grant._id, // Map _id to id for the component's key
                    // Convert the AI score (e.g., 0.91) to a percentage
                    matchPercentage: Math.round(grant.score * 100), 
                }));
                
                setSuggestions(formattedSuggestions);

            } catch (err) {
                // Handle potential errors gracefully
                const errorMessage = err.response?.data?.message || err.message || 'Could not fetch recommendations.';
                setError(errorMessage);
                console.error("Failed to fetch AI recommendations:", err);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        fetchRecommendations();
    }, []); // The empty dependency array ensures this runs only once when the component mounts

    return (
        <div>
            <h3 className="text-2xl font-bold text-night dark:text-dark-text mb-4 font-heading">AI-Recommended Grants</h3>
            {isLoadingSuggestions ? (
                // --- Loading State Skeleton ---
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-mercury dark:border-dark-border animate-pulse">
                            <div className="h-32 bg-mercury/80 dark:bg-dark-border rounded mb-4"></div>
                            <div className="h-5 bg-mercury/80 dark:bg-dark-border rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-mercury/80 dark:bg-dark-border rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-mercury/80 dark:bg-dark-border rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                // --- Error State Display ---
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300">
                    <p>{error}</p>
                </div>
            ) : (
                // --- Success State: Display Grant Cards ---
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestions.map(grant => (
                        <GrantCard
                            key={grant.id} 
                            grant={grant} 
                            // onSelect={(g, p) => onSelectGrant(g, p)} 
                            matchPercentage={grant.matchPercentage} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AiRecommendedGrants;