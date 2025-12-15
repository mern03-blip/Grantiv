// ActionCenterCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AddGrantModal from '../../../components/modals/AddGrantModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';

// Assuming these icons are available via the standard path
import { 
    SearchIcon,
    PlusCircleIcon,
    SparklesIcon,
    ChevronRightIcon
} from '../../../components/icons/Icons';

// --- Mock Data for demonstration ---
// Replace this with your actual Redux state or API data flow
const mockTasks = [
    { id: 't1', text: 'Submit budget draft for Innovation Fund', deadline: '2025-12-15T00:00:00Z', completed: false, grantId: 'g1' },
    { id: 't2', text: 'Review feedback on Small Business grant', deadline: '2025-12-08T00:00:00Z', completed: false, grantId: 'g2' }, // Past due
    { id: 't3', text: 'Finalize documents for Research grant', deadline: '2025-12-24T00:00:00Z', completed: false, grantId: 'g1' },
    { id: 't4', text: 'Follow up with Funder X', deadline: '2025-12-20T00:00:00Z', completed: false, grantId: 'g3' },
    { id: 't5', text: 'Completed Onboarding Task', deadline: '2025-11-01T00:00:00Z', completed: true, grantId: 'g1' },
];

// --- ActionLinkCard Component (Moved and Converted to JSX) ---
const ActionLinkCard = ({ icon: Icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-mercury/50 dark:hover:bg-dark-background/80 transition-colors text-left group"
    >
        <div className="w-10 h-10 flex items-center justify-center bg-primary/20 text-primary rounded-lg shrink-0">
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-night dark:text-dark-text">{title}</h4>
            <p className="text-sm text-night/60 dark:text-dark-textMuted">{description}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 ml-auto text-night/30 dark:text-dark-textMuted/50 group-hover:translate-x-1 transition-transform" />
    </button>
);

ActionLinkCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

// --- Main ActionCenterCard Component ---

const ActionCenter = ({ 
    onNavigate, 
    onAddGrant, 
    tasks = mockTasks, // Use mock tasks as default
    onRequestToggleTask,
    myGrants = [], // Required for the "All tasks completed" check
}) => {
    // Modal state management
    const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(false);
    const [taskToConfirm, setTaskToConfirm] = useState(null);
    
    const navigate = useNavigate();
    
    // Handle opening the Add Grant modal
    const handleAddGrantClick = () => {
        setIsAddGrantModalOpen(true);
        // Also call the original onAddGrant prop if needed for other logic
        if (onAddGrant) onAddGrant();
    };
    
    // Handle closing the Add Grant modal
    const handleCloseModal = () => {
        setIsAddGrantModalOpen(false);
    };
    
    // Handle task completion button click (shows confirmation)
    const handleTaskToggleClick = (task) => {
        setTaskToConfirm(task);
    };
    
    // Handle confirmed task completion
    const handleConfirmToggleTask = () => {
        if (taskToConfirm && onRequestToggleTask) {
            onRequestToggleTask(taskToConfirm.id);
        }
        setTaskToConfirm(null);
    };
    
    // Handle adding grant from text (implement your logic here)
    const handleAddFromText = async (grantText) => {
        try {
            // Add your logic to process the grant text
            console.log('Processing grant text:', grantText);
            // You can call an API or dispatch a Redux action here
            // Example: await processGrantText(grantText);
            
            // Close the modal after successful processing
            setIsAddGrantModalOpen(false);
        } catch (error) {
            console.error('Error processing grant text:', error);
            // Handle error (show notification, etc.)
            throw error; // Re-throw to let the modal handle it
        }
    };
    
    // Filter and sort incomplete tasks (max 4 for the urgent list)
    const incompleteTasks = tasks
        .filter(task => !task.completed)
        .sort((a, b) => new Date(a.deadline || '9999').getTime() - new Date(b.deadline || '9999').getTime())
        .slice(0, 4);

    return (
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-mercury/50 dark:border-dark-border/50 shadow-sm h-full">
                
                {/* Action Links Section */}
                <h3 className="text-xl font-bold font-heading text-night dark:text-dark-text mb-4">Action Center</h3>
                <div className="space-y-1">
                    <ActionLinkCard icon={SearchIcon} title="Find New Grants" description="Explore funding opportunities." onClick={() => navigate('/find-grants')} />
                    <ActionLinkCard icon={PlusCircleIcon} title="Add a Grant Project" description="Manually add an application." onClick={handleAddGrantClick} />
                    <ActionLinkCard icon={SparklesIcon} title="Chat with AI Assistant" description="Get help with your writing." onClick={() => navigate('/ai-assistant')} />
                </div>

                {/* Urgent Tasks Section */}
                {incompleteTasks.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-mercury/50 dark:border-dark-border/50">
                        <h4 className="font-bold text-night dark:text-dark-text mb-3">Urgent Tasks ({incompleteTasks.length})</h4>
                        <div className="space-y-2">
                            {incompleteTasks.map(task => {
                                const deadlineDate = new Date(task.deadline);
                                const isPastDue = deadlineDate < new Date();

                                return (
                                    <div key={task.id} className="flex items-center gap-3 py-2 border-b border-mercury/30 dark:border-dark-border/50 last:border-b-0">
                                        <button
                                            onClick={() => handleTaskToggleClick(task)}
                                            className="w-5 h-5 border-2 border-mercury/80 dark:border-dark-border rounded-full hover:border-primary transition flex-shrink-0"
                                            aria-label={`Mark task as complete: ${task.text}`}
                                        ></button>
                                        <div className="flex-1">
                                            <span className="text-sm text-night dark:text-dark-text">{task.text}</span>
                                            {task.deadline && (
                                                <p className={`text-xs font-bold ${isPastDue ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                    Due: {deadlineDate.toLocaleDateString('en-AU')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                {/* All Tasks Complete Message */}
                {incompleteTasks.length === 0 && myGrants.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-mercury/50 dark:border-dark-border/50 text-center">
                        <p className="text-sm text-night/60 dark:text-dark-textMuted">All tasks completed! ✨</p>
                    </div>
                )}
            </div>
            
            {/* Add Grant Modal */}
            {isAddGrantModalOpen && (
                <AddGrantModal 
                    onClose={handleCloseModal}
                    onAddFromText={handleAddFromText}
                />
            )}
            
            {/* Task Completion Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!taskToConfirm}
                onClose={() => setTaskToConfirm(null)}
                onConfirm={handleConfirmToggleTask}
                title="Complete Task?"
                message={taskToConfirm ? `Are you sure you want to mark "${taskToConfirm.text}" as complete?` : "Are you sure you want to mark this task as complete?"}
                confirmButtonText="Yes, Complete"
            />
        </div>
    );
};

ActionCenter.propTypes = {
    onNavigate: PropTypes.func.isRequired,
    onAddGrant: PropTypes.func.isRequired,
    onRequestToggleTask: PropTypes.func.isRequired,
    tasks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        text: PropTypes.string.isRequired,
        deadline: PropTypes.string,
        completed: PropTypes.bool.isRequired,
    })),
    myGrants: PropTypes.array,
};

ActionCenter.defaultProps = {
    tasks: mockTasks,
    myGrants: [],
};

export default ActionCenter;