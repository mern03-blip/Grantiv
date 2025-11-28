import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateApplicationChecklist, } from '../api/endpoints/geminiService';
import { TaskItem, DocumentHub, TeamChat } from './collaborationtools/CollaborationTools';
import { ChevronLeftIcon, DocumentTextIcon, ChatBubbleOvalLeftEllipsisIcon, UsersIcon, } from './icons/Icons';
import { TeamAssignment } from './TeamAssignment';
import { MOCK_TASKS, MOCK_UPLOADED_FILES, MOCK_TEAM, MOCK_TEAM_CHAT_MESSAGES } from '../../constants';


export const ApplicationDetail = ({ grant, onBack, businessProfile, userPlan, isDemoMode, navigateTo, onUpdateGrant }) => {
    const [tasks, setTasks] = useState([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [files, setFiles] = useState(MOCK_UPLOADED_FILES);
    const [chatMessages, setChatMessages] = useState(MOCK_TEAM_CHAT_MESSAGES);
    const [rightColumnTab, setRightColumnTab] = useState('documents');

    useEffect(() => {
        const fetchChecklist = async () => {
            setIsLoadingTasks(true);
            const generatedTasks = await generateApplicationChecklist(grant, businessProfile);
            setTasks(generatedTasks.length > 0 ? generatedTasks : MOCK_TASKS); // Fallback
            setIsLoadingTasks(false);
        };
        fetchChecklist();
    }, [grant, businessProfile]);

    const handleToggleTask = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleAssignTask = (taskId, assigneeId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, assigneeId: assigneeId || undefined } : task
            )
        );
    };

    const handleDeleteFile = (fileId) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    };

    const handleAddComment = (fileId, text) => {
        const newComment = {
            id: `c${Date.now()}`,
            memberId: 't1', // Mocking current user
            text,
            timestamp: new Date().toISOString(),
        };
        setFiles(prevFiles => prevFiles.map(file =>
            file.id === fileId ? { ...file, comments: [...(file.comments || []), newComment] } : file
        ));
    };

    const handleSendMessage = (text) => {
        const newMessage = {
            id: `msg${Date.now()}`,
            memberId: 't1', // Mocking current user
            text,
            timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, newMessage]);
    };

    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    const tabItems = [
        { id: 'documents', label: 'Documents', icon: <DocumentTextIcon className="w-5 h-5" /> },
        { id: 'chat', label: 'Chat', icon: <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /> },
        { id: 'team', label: 'Team', icon: <UsersIcon className="w-5 h-5" /> },
    ];


    return (
        <div className="space-y-8">
            <div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-night/60 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text font-semibold mb-4"
                    aria-label="Return to My Grants list"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    Back to My Grants
                </button>
                <h2 className="text-3xl font-bold text-night dark:text-dark-text font-heading">{grant.title}</h2>
                <p className="text-night/60 dark:text-dark-textMuted">Manage your application progress, documents, and team collaboration below.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
                        <h3 className="text-lg font-bold text-night dark:text-dark-text mb-1 font-heading">Application Tasklist</h3>
                        <p className="text-sm text-night/60 dark:text-dark-textMuted mb-4">A tailored checklist based on this grant and your profile.</p>
                        <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2.5 mb-4">
                            <motion.div
                                className="bg-primary h-2.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                        </div>
                        {isLoadingTasks ? (
                            <div className="space-y-4 animate-pulse pt-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-mercury/80 dark:bg-dark-border"></div>
                                        <div className="h-4 bg-mercury/80 dark:bg-dark-border rounded flex-1"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {tasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={handleToggleTask}
                                        onAssign={handleAssignTask}
                                        plan={userPlan}
                                        isDemoMode={isDemoMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="p-1 bg-mercury/50 dark:bg-dark-background rounded-lg flex gap-1">
                        {tabItems.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setRightColumnTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors ${rightColumnTab === tab.id ? 'bg-white dark:bg-dark-surface text-secondary dark:text-dark-secondary' : 'text-night/60 dark:text-dark-textMuted hover:bg-white/50 dark:hover:bg-dark-surface/50'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {rightColumnTab === 'documents' && (
                        <DocumentHub
                            files={files}
                            onDeleteFile={handleDeleteFile}
                            onAddComment={handleAddComment}
                            plan={userPlan}
                            isDemoMode={isDemoMode}
                            navigateToSettings={() => navigateTo('settings')}
                        />
                    )}
                    {rightColumnTab === 'chat' && (
                        <TeamChat
                            messages={chatMessages}
                            onSendMessage={handleSendMessage}
                            plan={userPlan}
                            isDemoMode={isDemoMode}
                            navigateToSettings={() => navigateTo('settings')}
                        />
                    )}
                    {rightColumnTab === 'team' && (
                        <TeamAssignment
                            grant={grant}
                            allTeamMembers={MOCK_TEAM}
                            onUpdateGrant={onUpdateGrant}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};