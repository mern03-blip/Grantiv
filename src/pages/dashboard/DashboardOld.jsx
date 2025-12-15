import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_GRANTS, MOCK_TASKS, MOCK_TEAM } from '../../../constants';
import { getDashboardSuggestions, getDashboardSummary } from '../../api/endpoints/geminiService';
import ProgressBar from '../../components/progressbar/ProgressBar';
import {
    SparklesIcon, XIcon, CheckCircleIcon, ClockIcon, SpinnerIcon
} from '../../components/icons/Icons';
import useFocusTrap from '../../hooks/useFocusTrap';
import useKeydown from '../../hooks/useKeydown';
import AiRecommendedGrants from './components/AiRecommendedGrants';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetFavoriteGrants } from '../../api/endpoints/grants';
import { setSavedGrants } from '../../redux/slices/favoriteGrantSlice';
import { getDaysRemaining } from '../../utils/deadlineDate';


const Dashboard = () => {
    // Local state for the component's data
    const [myGrants, setMyGrants] = useState([]);
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [teamMembers, setTeamMembers] = useState(MOCK_TEAM);

    // Existing state and hooks
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const [daysRemaining, setdaysRemaining] = useState("")

    const summaryModalRef = useRef(null);
    const returnFocusRef = useRef(null);
    const { aiTotalAmount, nearestDeadline } = useSelector((state) => state.grants);
    const dispatch = useDispatch();

    useFocusTrap(isSummaryModalOpen ? summaryModalRef : { current: null });
    useKeydown('Escape', () => setIsSummaryModalOpen(false));


    // Dummy data and local handlers for the component to be independent
    useEffect(() => {
        // Set up some mock data on initial load
        setMyGrants(
            ALL_GRANTS.slice(0, 2).map((grant, index) => ({
                ...grant,
                // status: index === 0 ? GrantStatus.ApplicationDraft : GrantStatus.WaitingForDecision
            }))
        );
        setTasks(MOCK_TASKS);
        setTeamMembers(MOCK_TEAM);
    }, []);

    const handleToggleTask = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    // const onSelectGrant = (grant, matchPercentage) => {
    //     // This function now just logs the selection, as there is no router to navigate with
    //     console.log(`Selected grant: ${grant.title}`);
    // };

    useEffect(() => {
        if (isSummaryModalOpen) {
            returnFocusRef.current = document.activeElement;
        } else {
            returnFocusRef.current?.focus();
        }
    }, [isSummaryModalOpen]);

    const handleGenerateSummary = async () => {
        setIsSummaryModalOpen(true);
        setIsSummaryLoading(true);
        const summary = await getDashboardSummary(suggestions, myGrants, tasks.filter(t => !t.completed));
        setSummaryContent(summary);
        setIsSummaryLoading(false);
    };

    const incompleteTasks = tasks.filter(t => !t.completed).slice(0, 4);
    //Fetch Recomanded Grants
    useEffect(() => {
        const fetchSuggestions = async () => {
            setError(null);
            try {
                const suggestedResults = await getDashboardSuggestions(ALL_GRANTS);
                const suggestedGrants = suggestedResults.map(result => {
                    const grant = ALL_GRANTS.find(g => g.id === result.grantId);
                    return grant ? { ...grant, matchPercentage: result.matchPercentage } : null;
                }).filter((g) => !!g);
                setSuggestions(suggestedGrants);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
                setError("Could not load grants. Please try again later.");
            }
        };
        fetchSuggestions();
    }, []);

    //NearestDedline Date
    useEffect(() => {
        if (nearestDeadline) {
            const formatdate = getDaysRemaining(nearestDeadline);
            // console.log("========",formatdate);
            setdaysRemaining(formatdate)
        }
    }, [nearestDeadline])

    //Fetch all fav grant to for fav toggle btn  
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

    return (
        <div className="p-4 space-y-6 sm:space-y-8 md:space-y-12">
            <div
                className="p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl bg-primary text-night relative overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '15px 15px',
                }}
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full"></div>
                <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full"></div>
                <div className="relative">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading">Welcome back!</h2>
                    <p className="text-sm sm:text-base">Here's your funding outlook.</p>

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                        <div>
                            {/* <p className="text-5xl font-bold font-heading">{currencyFormatter.format(totalGrantAmount)}</p> */}
                            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold font-heading">${aiTotalAmount.toLocaleString()}
                            </p>
                            <p className="opacity-80 text-xs sm:text-sm md:text-base">Potential Funding</p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                <div>
                                    <p className="font-bold text-sm sm:text-base">In Progress</p>
                                    <p className="opacity-80 text-xs sm:text-sm">Overall Status</p>
                                </div>
                                <div>
                                    <span>
                                        {/* UPDATED: Use the validDeadlineDate or fallback string */}

                                        {daysRemaining !== null ? (
                                            <span className={`font-semibold ml-1 text-sm sm:text-base`}>
                                                ({daysRemaining === 0 ? 'Due today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`})
                                            </span>
                                        ) : (
                                            {/* <p className="font-bold">14 days</p> */ }
                                        )}
                                    </span>

                                    <p className="opacity-80 text-xs sm:text-sm">Next Deadline</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={handleGenerateSummary}
                                className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-night text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-colors"
                                aria-label="Get an AI-powered summary of your funding outlook"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4" stroke="white" style={{}} />
                                AI Summary
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <AiRecommendedGrants />
            </div>

            <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-night dark:text-dark-text mb-3 sm:mb-4 font-heading">Quick AI Progress</h3>
                {myGrants.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                        {myGrants.slice(0, 2).map(grant => (
                            <div key={grant.id} className="bg-white dark:bg-dark-surface p-3 sm:p-4 rounded-lg border border-mercury dark:border-dark-border">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm sm:text-base text-night dark:text-dark-text font-heading">{grant.title}</h4>
                                        <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted">Grant in Progress</p>
                                    </div>
                                    <motion.button
                                        // onClick={() => onSelectGrant(grant)}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors w-full sm:w-auto"
                                        aria-label={`Continue application for ${grant.title}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Continue
                                    </motion.button>
                                </div>
                                <ProgressBar status={grant.status} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6 sm:p-8 bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border">
                        <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted">You have no in-progress applications.</p>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-night dark:text-dark-text mb-3 sm:mb-4 font-heading">Your To-Do List</h3>
                <div className="bg-white dark:bg-dark-surface p-3 sm:p-4 rounded-lg border border-mercury dark:border-dark-border">
                    {incompleteTasks.length > 0 ? (
                        <div className="space-y-1">
                            {incompleteTasks.map(task => {
                                const grant = myGrants.find(g => g.id === task.grantId);
                                const assignee = teamMembers.find(m => m.id === task.assigneeId);
                                const isOverdue = task.deadline && new Date(task.deadline) < new Date();

                                return (
                                    <div key={task.id} className="flex items-start sm:items-center gap-2 sm:gap-3 py-2 border-b border-mercury/30 dark:border-dark-border/50 last:border-b-0 group">
                                        <button
                                            onClick={() => handleToggleTask(task.id)}
                                            className="flex-shrink-0 mt-0.5 sm:mt-0"
                                            aria-label={`Mark task as complete: ${task.text}`}
                                        >
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-mercury/80 dark:border-dark-border rounded-full group-hover:border-primary transition"></div>
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs sm:text-sm text-night dark:text-dark-text group-hover:text-secondary transition-colors break-words">{task.text}</span>
                                            {grant && <p className="text-xs text-night/60 dark:text-dark-textMuted truncate">For: {grant.title}</p>}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                                            {task.deadline && (
                                                <div className={`flex items-center gap-1 text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-mercury/50 dark:bg-dark-border'}`}>
                                                    <ClockIcon className="w-3 h-3 flex-shrink-0" />
                                                    <span className="text-xs">{new Date(task.deadline).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                                                </div>
                                            )}
                                            {assignee && (
                                                <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <CheckCircleIcon className="w-10 h-10 text-primary mx-auto mb-2" />
                            <p className="text-night/60 dark:text-dark-textMuted font-medium">All tasks complete. You're on top of it!</p>
                        </div>
                    )}
                </div>
            </div>
            
            <AnimatePresence>
                {isSummaryModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 h-screen !m-0" onClick={() => setIsSummaryModalOpen(false)}>
                        <motion.div
                            ref={summaryModalRef}
                            className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-mercury dark:border-dark-border"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold font-heading flex items-center gap-2 text-night dark:text-dark-text">
                                    <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Your Funding Outlook
                                </h3>
                                <button onClick={() => setIsSummaryModalOpen(false)} className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text flex-shrink-0" aria-label="Close AI summary modal">
                                    <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                            {isSummaryLoading ? (
                                <div className="flex justify-center items-center h-32 sm:h-48">
                                    <SpinnerIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                                </div>
                            ) : (
                                <div
                                    className="mt-4 text-night/80 dark:text-dark-text/90 prose-sm max-w-none max-h-[60vh] overflow-y-auto space-y-4"
                                    dangerouslySetInnerHTML={{ __html: summaryContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;