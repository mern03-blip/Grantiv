import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_GRANTS, MOCK_TASKS, MOCK_TEAM } from '../../../constants';
import { getDashboardSuggestions, getDashboardSummary } from '../../services/geminiService';
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
// import { json } from 'stream/consumers';


const Dashboard = () => {
    // Local state for the component's data
    const [myGrants, setMyGrants] = useState([]);
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [teamMembers, setTeamMembers] = useState(MOCK_TEAM);

    // Existing state and hooks
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
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

    const onSelectGrant = (grant, matchPercentage) => {
        // This function now just logs the selection, as there is no router to navigate with
        console.log(`Selected grant: ${grant.title}`);
    };

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

    useEffect(() => {
        if (isSummaryModalOpen) {
            returnFocusRef.current = document.activeElement;
        } else {
            returnFocusRef.current?.focus();
        }
    }, [isSummaryModalOpen]);


    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoadingSuggestions(true);
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
            } finally {
                setIsLoadingSuggestions(false);
            }
        };
        fetchSuggestions();
    }, []);

    const handleGenerateSummary = async () => {
        setIsSummaryModalOpen(true);
        setIsSummaryLoading(true);
        const summary = await getDashboardSummary(suggestions, myGrants, tasks.filter(t => !t.completed));
        setSummaryContent(summary);
        setIsSummaryLoading(false);
    };

    const potentialFunding = suggestions
        .filter(grant => grant.matchPercentage >= 85)
        .reduce((total, grant) => total + grant.amount, 0);

    const currencyFormatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const incompleteTasks = tasks.filter(t => !t.completed).slice(0, 4);



    const parseAustralianDate = (dateString) => {
        console.log(dateString, "\\\\")
        if (!dateString) return null;
        if (typeof dateString != "string") return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };
    // 3. Deadline: Use 'closeDateTime' from the API

    const getDaysRemaining = (deadlineValue) => {
        const deadlineDate = parseAustralianDate(deadlineValue);
        if (!deadlineDate) return null; // Handle invalid date

        const today = new Date();
        // Compare dates without time component for accuracy
        today.setHours(0, 0, 0, 0);

        const diffTime = deadlineDate.getTime() - today.getTime();

        // If the difference is less than zero, the grant has closed.
        if (diffTime < 0) return null;

        // Use floor to get the number of full days remaining
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setdaysRemaining(diffDays)
        // return diffDays;
    };

    // const daysRemaining = getDaysRemaining();

    useEffect(() => {
        if (nearestDeadline) {
            // console.log(nearestDeadline, "yes it is working")
            const deadline = JSON.stringify(nearestDeadline)
            console.log(deadline, "------");

            getDaysRemaining(deadline)
        }
    }, [nearestDeadline])


    return (
        <div className="space-y-12">
            <div
                className="p-8 rounded-xl bg-primary text-night relative overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '15px 15px',
                }}
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="relative">
                    <h2 className="text-3xl font-bold font-heading">Welcome back!</h2>
                    <p>Here's your funding outlook.</p>

                    <div className="mt-6 flex justify-between items-end">
                        <div>
                            {/* <p className="text-5xl font-bold font-heading">{currencyFormatter.format(totalGrantAmount)}</p> */}
                            <p className="text-4xl font-semibold font-heading">${aiTotalAmount.toLocaleString()}
                            </p>
                            <p className="opacity-80">Potential Funding</p>
                        </div>
                        <div className="text-right">
                            <div className="flex gap-6">
                                <div>
                                    <p className="font-bold">In Progress</p>
                                    <p className="opacity-80 text-sm">Overall Status</p>
                                </div>
                                <div>
                                    <span>
                                        {/* UPDATED: Use the validDeadlineDate or fallback string */}

                                        {daysRemaining !== null ? (
                                            <span className={`font-semibold ml-1`}>
                                                ({daysRemaining === 0 ? 'Due today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`})
                                            </span>
                                        ) : (
                                            {/* <p className="font-bold">14 days</p> */ }
                                        )}
                                    </span>

                                    <p className="opacity-80 text-sm">Next Deadline</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={handleGenerateSummary}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-night text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                                aria-label="Get an AI-powered summary of your funding outlook"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SparklesIcon className="w-4 h-4" stroke="white" style={{}} />
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
                <h3 className="text-2xl font-bold text-night dark:text-dark-text mb-4 font-heading">Quick AI Progress</h3>
                {myGrants.length > 0 ? (
                    <div className="space-y-4">
                        {myGrants.slice(0, 2).map(grant => (
                            <div key={grant.id} className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-mercury dark:border-dark-border">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h4 className="font-bold text-night dark:text-dark-text font-heading">{grant.title}</h4>
                                        <p className="text-sm text-night/60 dark:text-dark-textMuted">Grant in Progress</p>
                                    </div>
                                    <motion.button
                                        // onClick={() => onSelectGrant(grant)}
                                        className="px-4 py-2 text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors"
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
                    <div className="text-center p-8 bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border">
                        <p className="text-night/60 dark:text-dark-textMuted">You have no in-progress applications.</p>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-2xl font-bold text-night dark:text-dark-text mb-4 font-heading">Your To-Do List</h3>
                <div className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-mercury dark:border-dark-border">
                    {incompleteTasks.length > 0 ? (
                        <div className="space-y-1">
                            {incompleteTasks.map(task => {
                                const grant = myGrants.find(g => g.id === task.grantId);
                                const assignee = teamMembers.find(m => m.id === task.assigneeId);
                                const isOverdue = task.deadline && new Date(task.deadline) < new Date();

                                return (
                                    <div key={task.id} className="flex items-center gap-3 py-2 border-b border-mercury/30 dark:border-dark-border/50 last:border-b-0 group">
                                        <button
                                            onClick={() => handleToggleTask(task.id)}
                                            className="flex-shrink-0"
                                            aria-label={`Mark task as complete: ${task.text}`}
                                        >
                                            <div className="w-6 h-6 border-2 border-mercury/80 dark:border-dark-border rounded-full group-hover:border-primary transition"></div>
                                        </button>
                                        <div className="flex-1">
                                            <span className="text-sm text-night dark:text-dark-text group-hover:text-secondary transition-colors">{task.text}</span>
                                            {grant && <p className="text-xs text-night/60 dark:text-dark-textMuted">For: {grant.title}</p>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {task.deadline && (
                                                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-mercury/50 dark:bg-dark-border'}`}>
                                                    <ClockIcon className="w-3 h-3" />
                                                    <span>{new Date(task.deadline).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                                                </div>
                                            )}
                                            {assignee && (
                                                <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="w-7 h-7 rounded-full" />
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsSummaryModalOpen(false)}>
                        <motion.div
                            ref={summaryModalRef}
                            className="bg-white dark:bg-dark-surface rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full border border-mercury dark:border-dark-border"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold font-heading flex items-center gap-2 text-night dark:text-dark-text">
                                    <SparklesIcon className="w-6 h-6" />
                                    Your Funding Outlook
                                </h3>
                                <button onClick={() => setIsSummaryModalOpen(false)} className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text" aria-label="Close AI summary modal">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>
                            {isSummaryLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <SpinnerIcon className="w-10 h-10 text-primary" />
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