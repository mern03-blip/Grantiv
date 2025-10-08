import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon, PaperAirplaneIcon, XIcon, ChevronLeftIcon, PaperclipIcon,
} from '../../components/icons/Icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { handleGetFavoriteGrants } from '../../api/endpoints/grants';

// --- MOCK DATA AND MOCKED FUNCTIONS ---
// These replace the props and external service calls
const mockGrants = [
    {
        id: 'grant-123',
        title: 'Small Business Innovation Grant',
        funder: 'Tech Forward Foundation',
        amount: 50000,
        deadline: '2025-10-31',
        description: 'A grant to support small businesses in developing innovative technology solutions.',
    },
    {
        id: 'grant-456',
        title: 'Community Arts & Culture Fund',
        funder: 'Creative Works Coalition',
        amount: 25000,
        deadline: '2025-11-15',
        description: 'Funding for projects that promote community engagement through arts and culture.',
    },
];

const mockBusinessProfile = {
    name: 'Innovate Solutions LLC',
    industry: 'Software Development',
    location: 'San Francisco, CA',
    // Add other profile fields as needed
};

// Mock the API service calls to return data directly
const mockGetAssistantResponse = async (grant, messages, userMessage, attachments, businessProfile) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    if (userMessage.includes('review')) {
        return "I've reviewed the paragraph. It looks strong and well-structured! To make it even more compelling, consider adding a specific metric or a powerful testimonial.";
    }
    if (userMessage.includes('budget')) {
        return "A good project budget should break down costs into key categories like personnel, materials, and marketing. I can help you create a table for this.";
    }
    if (grant) {
        return `I can help with the **${grant.title}** grant. What specific section are you working on?`;
    }
    return 'Thanks for your message! How can I help with your grant applications?';
};

const mockGenerateSuggestedPrompts = async (grant) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (grant) {
        return [
            `Draft an introduction for the ${grant.title}`,
            'Suggest project outcomes',
            'Clarify eligibility criteria',
            'Outline a sample budget',
        ];
    }
    return [
        "How do I find grants for my industry?",
        "What makes a grant application successful?",
        "Help me structure a project budget.",
        "Can you review a paragraph for me?",
    ];
};

// --- STANDALONE COMPONENT ---
const AIAssistant = () => {
    const [selectedGrant, setSelectedGrant] = useState(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [suggestedPrompts, setSuggestedPrompts] = useState([]);
    const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
    const [showGrantDetail, setShowGrantDetail] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingIntervalRef = useRef(undefined);
    const [chatHistories, setChatHistories] = useState({});
    const [profileJustUpdated, setProfileJustUpdated] = useState(true);

    const navigate = useNavigate();
    const myGrants = mockGrants;
    // const savedGrants = mockGrants;
    const businessProfile = mockBusinessProfile;
    const currentGrantKey = selectedGrant?.id || 'general';
    const messages = chatHistories[currentGrantKey] || [];
    const showIntro = messages.length <= 1;

    const {
        data: { data: savedGrants = [] } = {},
        isLoading: isSavedLoading,
        // refetch: refetchSavedGrants
    } = useQuery({
        queryKey: ['favoriteGrants'],
        queryFn: handleGetFavoriteGrants,
        staleTime: 1000 * 60, // 1 min
        retry: 1,
    });


    console.log("Saved Grants in AI Assistant:", savedGrants);



    const onUpdateChatHistory = (key, action) => {
        setChatHistories(prev => {
            const newHistory = typeof action === 'function' ? action(prev[key] || []) : action;
            return {
                ...prev,
                [key]: newHistory,
            };
        });
    };

    const onProfileUpdateAcknowledged = () => {
        setProfileJustUpdated(false);
    };

    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                window.clearInterval(typingIntervalRef.current);
            }
        };
    }, [currentGrantKey]);

    const generalPrompts = [
        "How do I find grants for my industry?",
        "What makes a grant application successful?",
        "Help me structure a project budget.",
        "Can you review a paragraph for me?",
    ];

    const fallbackGrantPrompts = [
        "Draft a powerful introduction for this grant",
        "Brainstorm some standout project outcomes",
        "Clarify the eligibility criteria for me",
        "Help me outline a sample budget",
    ];

    useEffect(() => {
        if (selectedGrant) {
            const fetchPrompts = async () => {
                setIsLoadingPrompts(true);
                try {
                    const prompts = await mockGenerateSuggestedPrompts(selectedGrant);
                    setSuggestedPrompts(prompts.length > 0 ? prompts : fallbackGrantPrompts);
                } catch (error) {
                    console.error("Failed to fetch suggested prompts", error);
                    setSuggestedPrompts(fallbackGrantPrompts);
                } finally {
                    setIsLoadingPrompts(false);
                }
            };
            fetchPrompts();
        } else {
            setSuggestedPrompts(generalPrompts);
        }
    }, [selectedGrant]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const grantKey = selectedGrant?.id || 'general';
        if (!chatHistories[grantKey]) {
            let welcomeMessageText;
            if (selectedGrant) {
                welcomeMessageText = `Alright, let's dive into the **${selectedGrant.title}** application! I'm your Grantiv AI co-pilot, and I've reviewed the details. I'm ready to help you build a standout submission. What's our first move?`;
            } else {
                welcomeMessageText = `Hi there! I'm your Grantiv AI co-pilot. How can we get your grant applications moving today? Feel free to ask a general question, or select one of your grants to begin.`;
            }

            const initialMessages = [];

            if (profileJustUpdated && grantKey === 'general') {
                initialMessages.push({ sender: 'ai', text: "I've just reviewed your updated business profile! I'll keep these new details in mind to provide even more tailored grant-matching and advice." });
                onProfileUpdateAcknowledged();
            }

            initialMessages.push({ sender: 'ai', text: welcomeMessageText });
            onUpdateChatHistory(grantKey, initialMessages);
        }
    }, [selectedGrant, profileJustUpdated]);

    const handleFileChange = (event) => {
        if (event.target.files) {
            setAttachments(prev => [...prev, ...Array.from(event.target.files)]);
        }
    };

    const handleRemoveAttachment = (indexToRemove) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSend = async (messageText) => {
        if ((messageText.trim() === '' && attachments.length === 0) || isLoading) return;

        const attachmentPreviews = attachments.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));

        const userMessage = { sender: 'user', text: messageText, attachments: attachmentPreviews };
        onUpdateChatHistory(currentGrantKey, prev => [...prev, userMessage]);

        const currentAttachments = [...attachments];
        setInput('');
        setAttachments([]);
        setIsLoading(true);

        try {
            const aiResponseText = await mockGetAssistantResponse(selectedGrant, messages, messageText, currentAttachments, businessProfile);

            onUpdateChatHistory(currentGrantKey, prev => [...prev, { sender: 'ai', text: '' }]);

            let index = 0;
            const typingSpeed = 20;

            typingIntervalRef.current = window.setInterval(() => {
                const currentText = aiResponseText.substring(0, index + 1);
                onUpdateChatHistory(currentGrantKey, prev => {
                    if (prev.length === 0) return [];
                    const updatedPrev = prev.slice(0, -1);
                    return [...updatedPrev, { ...prev[prev.length - 1], text: currentText }];
                });

                index++;

                if (index > aiResponseText.length) {
                    if (typingIntervalRef.current) {
                        window.clearInterval(typingIntervalRef.current);
                    }
                    setIsLoading(false);
                }
            }, typingSpeed);

        } catch (error) {
            const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            onUpdateChatHistory(currentGrantKey, prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    const GrantSelectionButton = ({ isSelected, onClick, title, subtext }) => (
        <>
            {/* {console.log( title, subtext)} */}
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 border-l-4 text-left transition-colors duration-200 ${isSelected
                    ? 'bg-primary/80 dark:bg-primary/20 border-primary text-night dark:text-dark-primary'
                    : 'bg-transparent border-transparent text-night/70 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-border/20 hover:text-night dark:hover:text-dark-text'
                    }`}
            >
                <h4 className="font-bold text-sm font-heading truncate">{title}</h4>
                <p className="text-xs opacity-80 mt-0.5 truncate">{subtext}</p>
            </motion.button>
        </>

    );

    const lightPattern = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgODAwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNFMkRGREUiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTcuMiA3LjJsNzE3LjIgNzE3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03MjQuNCA3LjJMNy4yIDcyNC40IiBvcGFjaXR5PSIuMTUiLz48cGF0aCBkPSJNNTAzLjIgNzI0LjRMMjIzLjIgNDQ0LjQiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0yOTUuNiA3LjJMNTc1LjYgMjg3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03OTIuOCAzOTIuOGMwLTIxNy0xNzUuMi0zOTIuOC0zOTIuOC0zOTIuOCIgb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNNy4yIDM5Mi44YzAtMjE3IDE3NS4yLTM5Mi44IDM5Mi44LTM5Mi44IiBvcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')`;
    const darkPattern = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgODAwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzYTNkNDAiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTcuMiA3LjJsNzE3LjIgNzE3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03MjQuNCA3LjJMNy4yIDcyNC40IiBvcGFjaXR5PSIuMTUiLz48cGF0aCBkPSJNNTAzLjIgNzI0LjRMMjIzLjIgNDQ0LjQiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0yOTUuNiA3LjJMNTc1LjYgMjg3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03OTIuOCAzOTIuOGMwLTIxNy0xNzUuMi0zOTIuOC0zOTIuOC0zOTIuOCIgb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNNy4yIDM5Mi44YzAtMjE3IDE3NS4yLTM5Mi44IDM5Mi44LTM5Mi44IiBvcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')`;

    // Animation variants for messages and prompts
    const messageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const promptContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const promptItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };


    return (
        <div className="relative flex h-[100vh] border transition-colors bg-alabaster dark:bg-dark-background text-night dark:text-dark-text">
            <AnimatePresence mode='wait'>
                {showGrantDetail && selectedGrant && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="relative w-full h-full max-w-5xl max-h-[90vh] bg-white dark:bg-dark-surface rounded-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold">Mock Grant Details</h3>
                                <p>Details for **{selectedGrant.title}** would go here.</p>
                                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg" onClick={() => setShowGrantDetail(false)}>Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.aside className="w-80 flex-shrink-0 border-r flex flex-col transition-colors bg-white dark:bg-dark-surface border-mercury dark:border-dark-border">
                <motion.div className="p-4 border-b transition-colors border-mercury dark:border-dark-border">
                    {/* <button
                        onClick={() => navigate('Exiting AI Assistant...')} // Mocking navigation
                        className="flex items-center gap-2 text-sm font-semibold w-full text-left p-2 rounded-lg transition-colors text-night/70 dark:text-dark-textMuted hover:text-secondary dark:hover:text-dark-secondary hover:bg-mercury/50 dark:hover:bg-dark-border/20"
                        aria-label="Exit AI Assistant and return to Dashboard"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        Exit Assistant
                    </button> */}

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-semibold w-full text-left p-2 rounded-lg transition-colors text-night/70 dark:text-dark-textMuted hover:text-secondary dark:hover:text-dark-secondary hover:bg-mercury/50 dark:hover:bg-dark-border/20"
                        aria-label="Exit AI Assistant and return to Dashboard"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        Exit Assistant
                    </button>

                </motion.div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors text-night/50 dark:text-dark-textMuted/70">Work on a Grant</p>
                    <GrantSelectionButton
                        isSelected={!selectedGrant}
                        onClick={() => setSelectedGrant(null)}
                        title="General Chat"
                        subtext="Ask any grant question"
                    />
                    {myGrants.length > 0 && (
                        <>
                            <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider transition-colors text-night/50 dark:text-dark-textMuted/70">In-Progress Applications</p>
                            {myGrants.map(grant => (
                                <GrantSelectionButton
                                    key={grant.id}
                                    grant={grant}
                                    isSelected={selectedGrant?.id === grant.id}
                                    onClick={() => setSelectedGrant(grant)}
                                    title={grant.title}
                                    subtext={grant.funder}
                                />
                            ))}
                        </>
                    )}
                    {/* {savedGrants.length > 0 && (
                        <>
                            <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider transition-colors text-night/50 dark:text-dark-textMuted/70">Saved Opportunities</p>
                            {savedGrants.map(grant => (
                                <GrantSelectionButton
                                    key={grant.id}
                                    grant={grant}
                                    isSelected={selectedGrant?.id === grant.id}
                                    onClick={() => setSelectedGrant(grant)}
                                    title={grant.title}
                                    subtext={grant.funder}
                                />
                            ))}
                        </>
                    )} */}
                    {isSavedLoading ? (
                        <p className="px-3 py-2 text-xs text-center text-night/50 dark:text-dark-textMuted/70">Loading saved opportunities...</p>
                    ) : savedGrants.length > 0 ? (
                        <>
                            <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider transition-colors text-night/50 dark:text-dark-textMuted/70">Saved Opportunities</p>
                            {savedGrants.map(grant => (
                                <GrantSelectionButton
                                    key={grant.id || grant._id}
                                    grant={grant}
                                    isSelected={selectedGrant?.id === (grant.id || grant._id)}
                                    onClick={() => setSelectedGrant(grant)}
                                    title={grant.title || 'N/A'}
                                    subtext={grant.agency}
                                />
                            ))}
                        </>
                    ) : (
                        <p className="px-3 py-2 text-xs text-center text-night/50 dark:text-dark-textMuted/70">No saved opportunities yet.</p>
                    )}

                </div>
            </motion.aside>

            <motion.main className="flex-1 flex flex-col min-h-0 relative">
                <div className="absolute inset-0 z-0 bg-[#F7F7F7] dark:bg-dark-background"
                    style={{
                        backgroundImage: `
                        radial-gradient(circle at 50% 50%, rgba(168, 221, 107, 0.25) 0%, transparent 60%),
                        var(--pattern)
                        `,
                        backgroundSize: 'cover, auto',
                        transition: 'background-color 0.3s ease',
                    }}
                    dangerouslySetInnerHTML={{ __html: `<style>:root { --pattern: ${document.documentElement.classList.contains('dark') ? darkPattern : lightPattern}; }</style>` }}
                >
                </div>

                <div className="relative flex-1 flex flex-col min-h-0">
                    {showIntro && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10"
                        >
                            <SparklesIcon className="w-16 h-16 text-primary mb-4 animate-pulse-glow" />
                            <h2 className="text-3xl font-bold font-heading text-night dark:text-dark-text">Welcome to your Grantiv AI Co-pilot</h2>
                            <p className="text-night/70 dark:text-dark-textMuted mt-2 max-w-md">I'm ready to help you draft, refine, and perfect your grant applications. Select a grant or ask a question to get started.</p>
                        </motion.div>
                    )}

                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${showIntro ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial="hidden"
                                    animate="visible"
                                    variants={messageVariants}
                                    className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'ai' && <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0 mb-1" />}
                                    <div
                                        className={`max-w-xl p-3 rounded-xl transition-colors ${msg.sender === 'user'
                                            ? 'bg-primary text-night rounded-br-none'
                                            : 'bg-white dark:bg-dark-surface text-night dark:text-dark-text rounded-bl-none border border-primary dark:border-dark-secondary'
                                            }`}
                                    >
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <AnimatePresence>
                                                    {msg.attachments.map((att, attIndex) => (
                                                        <motion.div key={attIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}>
                                                            <img src={att.url} alt={att.name} className="max-w-xs max-h-40 rounded-lg" />
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                        {msg.text && <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                            <div className="flex justify-start items-end gap-2">
                                <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0 mb-1" />
                                <div className="max-w-md p-3 rounded-xl rounded-bl-none transition-colors bg-white dark:bg-dark-surface text-night dark:text-dark-text border border-primary dark:border-dark-secondary">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 backdrop-blur-sm z-10 transition-colors bg-white/80 dark:bg-dark-surface/80">
                        {messages.length <= (profileJustUpdated ? 2 : 1) && !isLoading && (
                            <motion.div
                                variants={promptContainerVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-4 grid grid-cols-2 gap-3"
                            >
                                {isLoadingPrompts ? (
                                    <>
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="p-3 rounded-lg border animate-pulse bg-mercury/50 dark:bg-dark-border/50 border-mercury/80 dark:border-dark-border">
                                                <div className="h-4 rounded bg-mercury dark:bg-dark-border"></div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {suggestedPrompts.map(prompt => (
                                            <motion.button
                                                key={prompt}
                                                variants={promptItemVariants}
                                                onClick={() => handleSend(prompt)}
                                                className="p-3 text-sm font-medium rounded-lg border transition-all duration-300 text-left bg-white dark:bg-dark-surface text-night dark:text-dark-text border-mercury/80 dark:border-dark-border hover:bg-mercury/50 dark:hover:bg-dark-border/50 shadow-sm hover:shadow-md"
                                                aria-label={`Start conversation with the prompt: ${prompt}`}
                                            >
                                                {prompt}
                                            </motion.button>
                                        ))}
                                    </>
                                )}
                            </motion.div>
                        )}
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                <AnimatePresence>
                                    {attachments.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center gap-2 rounded-full pl-3 pr-1 py-1 text-sm transition-colors bg-mercury dark:bg-dark-border text-night dark:text-dark-text"
                                        >
                                            <span>{file.name}</span>
                                            <button onClick={() => handleRemoveAttachment(index)} className="p-1 rounded-full hover:bg-night/20 dark:hover:bg-dark-background" aria-label={`Remove ${file.name}`}>
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-12 h-12 flex items-center justify-center shrink-0 rounded-full disabled:opacity-50 transition-colors bg-mercury/80 dark:bg-dark-border text-night/80 dark:text-dark-textMuted hover:bg-mercury dark:hover:bg-dark-border/50"
                                aria-label="Attach files"
                            >
                                <PaperclipIcon className="w-6 h-6" />
                            </motion.button>
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,application/pdf"
                            />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSend(input);
                                    }
                                }}
                                placeholder={selectedGrant ? `Ask about the ${selectedGrant.title}...` : 'Ask a question or suggest a task...'}
                                className="flex-1 w-full px-5 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-300 bg-white dark:bg-dark-background border-mercury dark:border-dark-border text-night dark:text-dark-text placeholder-night/60 dark:placeholder-dark-textMuted/70 focus:shadow-[0_0_15px_theme(colors.primary/0.5)]"
                                disabled={isLoading}
                                aria-label="Type your message to the AI assistant"
                            />
                            <motion.button
                                onClick={() => handleSend(input)}
                                disabled={isLoading || (!input.trim() && attachments.length === 0)}
                                className="w-12 h-12 flex items-center justify-center shrink-0 bg-primary text-night rounded-full font-semibold hover:bg-secondary disabled:bg-mercury/20 dark:disabled:bg-dark-border disabled:text-mercury/50 dark:disabled:text-dark-textMuted/50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_10px_theme(colors.primary/0.5)] hover:shadow-[0_0_15px_theme(colors.primary/0.7)] disabled:shadow-none"
                                aria-label="Send your message to the AI assistant"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default AIAssistant;


