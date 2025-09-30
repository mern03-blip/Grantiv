import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_TEAM } from '../../../constants';
import { PaperAirplaneIcon, DocumentTextIcon, TrashIcon, ClockIcon, CheckCircleIcon, UploadIcon, XIcon, SparklesIcon, ChatBubbleOvalLeftEllipsisIcon } from '../icons/Icons';
import "./Tools.css"

// --- Custom Hooks for Accessibility ---
const useFocusTrap = (ref) => {
    useEffect(() => {
        if (!ref.current) return;
        const element = ref.current;
        const focusableElements = Array.from(element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        firstElement?.focus();
        element.addEventListener('keydown', handleKeyDown);

        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, [ref]);
};

const useKeydown = (key, callback) => {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === key) {
                callback();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [key, callback]);
};


// --- Upgrade Notice Component ---
export const UpgradeNotice = ({ featureName, onUpgrade }) => (
    <div className="text-center p-6 bg-mercury/30 dark:bg-dark-surface/50 rounded-lg border-2 border-dashed border-mercury/80 dark:border-dark-border">
        <h4 className="font-bold text-night dark:text-dark-text font-heading">{featureName}</h4>
        <p className="text-sm text-night/60 dark:text-dark-textMuted mt-1 mb-3">This is a premium feature available on Pro and Enterprise plans.</p>
        <motion.button
            onClick={onUpgrade}
            className="px-4 py-2 text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Upgrade Plan
        </motion.button>
    </div>
);


// --- Task Item Component ---
export const TaskItem = ({ task, onToggle, onAssign, plan, isDemoMode }) => {
    const assignee = MOCK_TEAM.find(m => m.id === task.assigneeId);
    const isProOrEnterprise = plan === 'Pro' || plan === 'Enterprise';
    const hasAssignPermission = isProOrEnterprise || isDemoMode;

    const isOverdue = task.deadline && new Date(task.deadline) < new Date();

    return (
        <div className="flex items-center gap-3 py-2 border-b border-mercury/30 dark:border-dark-border/50 last:border-b-0">
            <button
                onClick={() => onToggle(task.id)}
                className="flex-shrink-0"
                aria-label={task.completed ? `Mark task as incomplete: ${task.text}` : `Mark task as complete: ${task.text}`}
            >
                {task.completed ? (
                    <CheckCircleIcon className="w-6 h-6 text-primary" />
                ) : (
                    <div className="w-6 h-6 border-2 border-mercury/80 dark:border-dark-border rounded-full hover:border-primary transition"></div>
                )}
            </button>
            <span className={`flex-1 text-sm transition-colors ${task.completed ? 'line-through text-night/50 dark:text-dark-textMuted/60' : 'text-night dark:text-dark-text'}`}>
                {task.text}
            </span>
            <div className="flex items-center gap-2">
                {task.deadline && (
                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isOverdue && !task.completed ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-mercury/50 dark:bg-dark-border'}`}>
                        <ClockIcon className="w-3 h-3" />
                        <span>{new Date(task.deadline).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                    </div>
                )}
                {assignee && hasAssignPermission && (
                    <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="w-6 h-6 rounded-full" />
                )}
                <select
                    value={task.assigneeId || ''}
                    onChange={(e) => onAssign(task.id, e.target.value)}
                    disabled={!hasAssignPermission}
                    className="text-xs border-mercury/50 dark:border-dark-border rounded-md focus:ring-primary focus:border-primary text-night bg-white dark:bg-dark-surface dark:text-dark-text py-1 pl-2 pr-7 disabled:bg-mercury/50 dark:disabled:bg-dark-border"
                    aria-label={`Assign task: ${task.text}`}
                >
                    <option value="">Unassigned</option>
                    {MOCK_TEAM.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};


// --- File Detail Modal ---
const FileDetailModal = ({ file, onClose, onAddComment }) => {
    const [comment, setComment] = useState('');
    const teamMembersById = MOCK_TEAM.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
    }, {});

    const modalRef = useRef(null);
    const returnFocusRef = useRef(null);

    useFocusTrap(modalRef);
    useKeydown('Escape', onClose);

    useEffect(() => {
        returnFocusRef.current = document.activeElement;
        return () => {
            returnFocusRef.current?.focus();
        };
    }, []);

    const handleAddComment = () => {
        if (comment.trim()) {
            onAddComment(file.id, comment.trim());
            setComment('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
                ref={modalRef}
                className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-2xl w-full border border-mercury dark:border-dark-border flex flex-col h-[80vh]"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
            >
                <div className="p-4 border-b border-mercury dark:border-dark-border flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text">{file.name}</h3>
                        <p className="text-xs text-night/60 dark:text-dark-textMuted">{file.size} - {file.type} - Uploaded on {new Date(file.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text" aria-label="Close file details">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="font-bold text-night dark:text-dark-text mb-3">Comments</h4>
                    <div className="space-y-4">
                        {(file.comments || []).map(c => {
                            const member = teamMembersById[c.memberId];
                            return (
                                <div key={c.id} className="flex items-start gap-3">
                                    <img src={member?.avatar} alt={member?.name} className="w-8 h-8 rounded-full" />
                                    <div className="flex-1 bg-mercury/50 dark:bg-dark-background p-3 rounded-lg">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-semibold text-sm text-night dark:text-dark-text">{member?.name}</p>
                                            <p className="text-xs text-night/60 dark:text-dark-textMuted">{new Date(c.timestamp).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-night/90 dark:text-dark-text/90 mt-1">{c.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {(!file.comments || file.comments.length === 0) && <p className="text-sm text-night/50 dark:text-dark-textMuted text-center py-4">No comments yet.</p>}
                    </div>
                </div>
                <div className="p-4 border-t border-mercury dark:border-dark-border">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:border-dark-border dark:text-dark-text"
                        />
                        <button onClick={handleAddComment} className="px-4 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary">Send</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


// --- Document Hub Component ---
export const DocumentHub = ({ files, onDeleteFile, onAddComment, plan, isDemoMode, navigateToSettings }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const isProOrEnterprise = plan === 'Pro' || plan === 'Enterprise';

    if (!isProOrEnterprise && !isDemoMode) {
        return <UpgradeNotice featureName="Shared Document Hub" onUpgrade={navigateToSettings} />;
    }

    return (
        <>
            <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-night dark:text-dark-text font-heading">Document Hub</h3>
                    <motion.button
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-night font-semibold rounded-md hover:bg-secondary transition-colors"
                        aria-label="Upload a new document for this application"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <UploadIcon className="w-4 h-4" />
                        Upload
                    </motion.button>
                </div>
                <div className="space-y-2">
                    {files.map(file => (
                        <div key={file.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-mercury/30 dark:hover:bg-dark-background/50 group">
                            <DocumentTextIcon className="w-6 h-6 text-night/50 dark:text-dark-textMuted flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <button onClick={() => setSelectedFile(file)} className="text-sm font-medium text-night dark:text-dark-text truncate text-left hover:underline">{file.name}</button>
                                <p className="text-xs text-night/60 dark:text-dark-textMuted">{file.size} - {(file.comments || []).length} comments</p>
                            </div>
                            <button
                                onClick={() => onDeleteFile(file.id)}
                                className="text-night/40 dark:text-dark-textMuted/60 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Delete file: ${file.name}`}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {files.length === 0 && <p className="text-sm text-center text-night/50 dark:text-dark-textMuted py-4">No documents uploaded.</p>}
                </div>
            </div>
            <AnimatePresence>
                {selectedFile && <FileDetailModal file={selectedFile} onClose={() => setSelectedFile(null)} onAddComment={onAddComment} />}
            </AnimatePresence>
        </>
    );
};

const CURRENT_USER_ID = "t1";

export const TeamChat = ({
    plan,
    isDemoMode,
    messages,
    onSendMessage,
    navigateToSettings,
}) => {
    const [input, setInput] = useState("");
    const teamMembersById = MOCK_TEAM.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
    }, {});

    const messagesContainerRef = useRef(null);
    const isAtBottomRef = useRef(true); // Tracks whether the user is at the bottom

    // Detect scroll position to check if user is at bottom or not
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const isAtBottom =
            container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
        isAtBottomRef.current = isAtBottom;
    };

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput("");

            // Scroll to bottom only if the user is already at the bottom
            if (isAtBottomRef.current && messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop =
                    messagesContainerRef.current.scrollHeight;
            }
        }
    };

    // Auto-scroll when new messages arrive, only if user is at bottom
    useEffect(() => {
        if (isAtBottomRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (plan === "Starter" && !isDemoMode) {
        return (
            <UpgradeNotice
                featureName="Real-time Team Chat"
                onUpgrade={navigateToSettings}
            />
        );
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
                className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col scrollbar-hide"
            >
                {messages.map((msg) => {
                    const member = teamMembersById[msg.memberId];
                    const isCurrentUser = msg.memberId === CURRENT_USER_ID;

                    return (
                        <div
                            key={msg.id}
                            className={`flex items-start gap-2.5 ${isCurrentUser ? "justify-end" : ""
                                }`}
                        >
                            {/* Avatar for other users */}
                            {!isCurrentUser && member && (
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full"
                                />
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`flex flex-col w-full max-w-xs leading-1.5 p-3 border-mercury dark:border-dark-border ${isCurrentUser
                                    ? "rounded-s-xl rounded-ee-xl bg-primary text-night"
                                    : "rounded-e-xl rounded-es-xl bg-mercury text-night dark:bg-dark-background dark:text-dark-text"
                                    }`}
                            >
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span
                                        className={`text-sm font-semibold ${isCurrentUser
                                            ? "text-night"
                                            : "text-night dark:text-dark-text"
                                            }`}
                                    >
                                        {member?.name || "Unknown"}
                                    </span>
                                    <span
                                        className={`text-xs font-normal ${isCurrentUser
                                            ? "text-night/70"
                                            : "text-night/60 dark:text-dark-textMuted"
                                            }`}
                                    >
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm font-normal py-2.5">{msg.text}</p>
                            </div>

                            {/* Avatar for current user */}
                            {isCurrentUser && member && (
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full"
                                />
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