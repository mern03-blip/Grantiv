import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios'; // For fetching initial data
import { PaperAirplaneIcon, ChatBubbleOvalLeftEllipsisIcon } from '../icons/Icons';
import "./chat.scss"
import Loader from '../loading/Loader';

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


export const TeamChat = ({ currentUser, selectedOrgId }) => {
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
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-Organization-ID': selectedOrgId,
                    },
                };

                // Fetch chat history and member list in parallel
                const [historyRes, membersRes] = await Promise.all([
                    axios.get('https://grantiv.uc.r.appspot.com/api/chat/messages', config),
                    axios.get('https://grantiv.uc.r.appspot.com/api/organizations/members', config)
                ]);

                setMessages(historyRes.data);
                setMembers(membersRes.data);
            } catch (err) {
                setError('Failed to load chat data. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedOrgId) {
            fetchData();
        }
    }, [selectedOrgId]);


    // --- EFFECT 2: Manage WebSocket connection ---
    useEffect(() => {
        // Retrieve token and orgId for socket connection
        const token = localStorage.getItem('token');
        if (!token || !selectedOrgId) return;

        // Establish the connection
        const newSocket = io("https://grantiv.uc.r.appspot.com" || 'http://localhost:5000', {
            auth: {
                token,
                organizationId: selectedOrgId,
            },
        });

        setSocket(newSocket);

        // Listen for incoming messages
        newSocket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Handle connection errors
        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
            setError('Real-time connection failed.');
        });

        // **Crucial Cleanup**: Disconnect when the component unmounts
        return () => {
            newSocket.disconnect();
        };
    }, [selectedOrgId]);

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
    const handleSend = () => {
        if (input.trim() && socket) {
            // Emit the message content to the server
            socket.emit('sendMessage', input.trim());
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
                    <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /> Team Chat
                </h3>
            </div>

            {/* Messages Section */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col hide-scrollbar"
            >
                {messages.map((msg) => {
                    const member = membersById[msg.sender._id];
                    const isCurrentUser = msg.sender._id === currentUser._id;

                    return (
                        <div
                            key={msg._id}
                            className={`flex items-start gap-2.5 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                            {/* Avatar for other users */}
                            {!isCurrentUser && member && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                    {member?.name?.charAt(0) || "?"}
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
                                            : member?.name || "Unknown User"}
                                    </span>
                                    <span
                                        className={`text-xs font-normal ${isCurrentUser
                                            ? "text-night/70"
                                            : "text-night/60 dark:text-dark-textMuted"
                                            }`}
                                    >
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm font-normal py-2.5">{msg.content}</p>
                            </div>

                            {/* Avatar for current user */}
                            {isCurrentUser && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                    {currentUser?.name?.charAt(0) || "U"}
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
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="w-full pl-4 pr-12 py-2 border border-mercury/80 dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-night/50 dark:text-dark-textMuted hover:text-primary"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

    );
};