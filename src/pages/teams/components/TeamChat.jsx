import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { PaperAirplaneIcon, ChatBubbleOvalLeftEllipsisIcon } from '../../../components/icons/Icons';
import Loader from '../../../components/loading/Loader';
import axiosInstance from '../../../api/axios/axiosInstance';
import { getChatHistory } from '../../../api/endpoints/chats';

// This is a custom hook to create a memoized map of members by ID for quick lookups
const useMembersMap = (members) => {
    return React.useMemo(() => {
        if (!members) return {};
        return members.reduce((acc, member) => {
            // The user object is nested inside the membership record
            if (member.user) {
                acc[member.user._id] = member.user;
            }
            return acc;
        }, {});
    }, [members]);
};

// Helper to format dates
const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const TeamChat = ({ currentUser, selectedOrgId, projectId }) => {
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // This state holds the active socket connection
    const [socket, setSocket] = useState(null);

    const membersById = useMembersMap(members);
    const messagesContainerRef = useRef(null);
    const isAtBottomRef = useRef(true);

    // --- EFFECT 1: Fetch initial data (history and members) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // We need the user's token and orgId to make authenticated requests
                // const token = localStorage.getItem('token');
                // const orgId = selectedOrgId || localStorage.getItem('orgId');
                
                if (projectId) {
                    // Project-specific chat - fetch project chat history
                    const history = await getChatHistory(projectId);
                    setMessages(history);
                    // For project chat, we don't need to fetch members separately
                    setMembers([]);
                } else {
                    // General organization chat
                    // const config = {
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //         'X-Organization-ID': orgId,
                    //     },
                    // };

                    // Fetch chat history and member list in parallel
                    const [historyRes, membersRes] = await Promise.all([
                        axiosInstance.get('/chat/messages', ),
                        axiosInstance.get('/organizations/members',)
                    ]);

                    setMessages(historyRes.data);
                    setMembers(membersRes.data);
                }
            } catch (err) {
                setError('Failed to load chat data. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedOrgId || projectId) {
            fetchData();
        }
    }, [selectedOrgId, projectId]);


    // --- EFFECT 2: Manage WebSocket connection ---
    useEffect(() => {
        // Retrieve token and orgId for socket connection
        const token = localStorage.getItem('token');
        const orgId = selectedOrgId || localStorage.getItem('orgId');
        
        if (!token || !orgId) return;

        // Establish the connection
        const socketUrl = import.meta.env.VITE_API_URL;
        const newSocket = io(socketUrl, {
            auth: {
                token,
                organizationId: orgId,
            },
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            
            // Join appropriate room based on projectId
            if (projectId) {
                newSocket.emit("joinProjectRoom", projectId);
            }
            // For general chat, no need to join a specific room
        });

        // Listen for incoming messages based on chat type
        if (projectId) {
            // Project-specific chat events
            newSocket.on('receiveGrantMessage', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        } else {
            // General organization chat events
            newSocket.on('receiveMessage', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }

        // Handle connection errors
        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
            setError('Real-time connection failed.');
        });

        newSocket.on("error", (err) => {
            console.error("Socket Error:", err);
            setError("Chat Error: " + err);
        });

        // **Crucial Cleanup**: Disconnect when the component unmounts
        return () => {
            if (projectId) {
                newSocket.emit("leaveProjectRoom", projectId);
            }
            newSocket.disconnect();
        };
    }, [selectedOrgId, projectId]);

    // Scroll handling logic (your existing code is great!)
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        // Check if the user is near the bottom
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        isAtBottomRef.current = isAtBottom;
    };

    useEffect(() => {
        if (isAtBottomRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);


    // --- Sending a Message ---
    const handleSend = (e) => {
        if (e) {
            e.preventDefault();
        }
        
        if (input.trim() && socket) {
            if (projectId) {
                // Project-specific message
                socket.emit('sendGrantMessage', {
                    projectId: projectId,
                    message: input.trim(),
                });
            } else {
                // General organization message
                socket.emit('sendMessage', input.trim());
            }
            
            setInput("");
            
            // Immediately scroll to bottom for the sender
            if (messagesContainerRef.current) {
                setTimeout(() => {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }, 0);
            }
        }
    };

    // --- Render Logic ---
    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader /></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col h-[725px] bg-white rounded-lg border border-mercury dark:bg-dark-background">
            {/* Header */}
            <div className="p-4 border-b border-mercury dark:border-dark-border">
                <h3 className="font-bold text-night dark:text-dark-text font-heading flex items-center gap-2">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /> 
                    {projectId ? 'Team Discussion' : 'Team Chat'}
                </h3>
                {projectId && (
                    <p className="text-xs text-gray-500">Real-time collaboration</p>
                )}
            </div>

            {/* Messages Section */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col no-scrollbar"
            >
                {messages.map((msg) => {
                    // Handle both message formats (general chat and project chat)
                    const messageId = msg._id || msg.id;
                    const messageContent = msg.content || msg.message;
                    const messageSender = msg.sender;
                    const messageTime = msg.createdAt;
                    
                    const member = membersById[messageSender._id];
                    const isCurrentUser = messageSender._id === currentUser._id;

                    return (
                        <div
                            key={messageId}
                            className={`flex items-start gap-2.5 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                            {/* Avatar for other users */}
                            {!isCurrentUser && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                    {(member?.name || messageSender?.name)?.charAt(0) || "?"}
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`flex flex-col w-full max-w-xs leading-1.5 p-3 border border-mercury dark:border-dark-border ${isCurrentUser
                                    ? "rounded-s-xl rounded-ee-xl bg-primary text-night"
                                    : "rounded-e-xl rounded-es-xl bg-mercury text-night dark:bg-dark-background dark:text-dark-text"
                                    }`}
                            >
                                <div
                                    className={`flex items-center ${isCurrentUser
                                        ? "justify-start space-x-2"
                                        : "justify-start space-x-2"
                                        }`}
                                >
                                    <span
                                        className={`text-sm font-semibold ${isCurrentUser
                                            ? "text-night"
                                            : "text-night dark:text-dark-text"
                                            }`}
                                    >
                                        {isCurrentUser
                                            ? currentUser?.name || "You"
                                            : (member?.name || messageSender?.name || "Unknown User")}
                                    </span>
                                    <span
                                        className={`text-xs font-normal ${isCurrentUser
                                            ? "text-night/70"
                                            : "text-night/60 dark:text-dark-textMuted"
                                            }`}
                                    >
                                        {formatTime(messageTime)}
                                    </span>
                                </div>
                                <p className="text-sm font-normal py-2.5 whitespace-pre-wrap">{messageContent}</p>
                            </div>

                            {/* Avatar for current user */}
                            {isCurrentUser && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                    {(currentUser?.name || "You")?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input Section */}
            <div className="p-4 border-t border-mercury dark:border-dark-border bg-white dark:bg-dark-surface">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        className="w-full pl-4 pr-12 py-2 border border-mercury/80 dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleSend(e);
                        }}
                        disabled={!input.trim()}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-night/50 dark:text-dark-textMuted hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
