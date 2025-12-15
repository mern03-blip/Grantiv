import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon } from '../../../components/icons/Icons';


// 1. UserPlan Type equivalent
const UserPlan = {
    STARTER: 'Starter',
    PRO: 'Pro',
    ENTERPRISE: 'Enterprise',
};

// 2. Mock Team Data
const MOCK_TEAM = [
    { id: 'm1', name: 'Alice', avatar: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=A' },
    { id: 'm2', name: 'Bob', avatar: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=B' },
    { id: 'm3', name: 'Charlie', avatar: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=C' },
];

// 3. Task PropType Definition
const TaskPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    deadline: PropTypes.string, // ISO string date
    assigneeId: PropTypes.string, // Member ID
});


// --- Utility Functions ---

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }); // e.g., 'Jul 05'
};


export const TaskItem = ({ task, onRequestToggle, onAssign, plan, isDemoMode }) => {
    
    const assignee = MOCK_TEAM.find(m => m.id === task.assigneeId);
    
    // Permission check: True if not 'Starter' or if in Demo Mode
    const hasAssignPermission = plan !== UserPlan.STARTER || isDemoMode;

    const isOverdue = (() => {
        if (!task.deadline || task.completed) return false;
        const deadlineDate = new Date(task.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        return deadlineDate < today;
    })();

    return (
        <div className="flex items-center gap-3 py-2 border-b border-mercury/30 dark:border-dark-border/50 last:border-b-0">
            
            {/* 1. Toggle Button */}
            <button
                onClick={() => onRequestToggle(task.id)}
                className="flex-shrink-0"
                aria-label={task.completed ? `Mark task as incomplete: ${task.text}` : `Mark task as complete: ${task.text}`}
            >
                {task.completed ? (
                    <CheckCircleIcon className="w-6 h-6 text-primary" />
                ) : (
                    <div className="w-6 h-6 border-2 border-mercury/80 dark:border-dark-border rounded-full hover:border-primary transition"></div>
                )}
            </button>
            
            {/* 2. Task Text and Deadline */}
            <div className="flex-1 flex items-center gap-2">
                <span className={`text-sm transition-colors ${task.completed ? 'line-through text-night/50 dark:text-dark-textMuted/60' : 'text-night dark:text-dark-text'}`}>
                    {task.text}
                </span>
                {task.deadline && !task.completed && (
                    <span className={`text-xs font-medium ${isOverdue ? 'text-red-600 dark:text-red-500' : 'text-night/60 dark:text-dark-textMuted'}`}>
                        {formatDate(task.deadline)}
                    </span>
                )}
            </div>
            
            {/* 3. Assignment/Team Controls */}
            <div className="flex items-center gap-2">
                {assignee && hasAssignPermission && (
                    <img 
                        src={assignee.avatar} 
                        alt={assignee.name} 
                        title={assignee.name} 
                        className="w-6 h-6 rounded-full object-cover" 
                    />
                )}
                <select
                    value={task.assigneeId || ''}
                    onChange={(e) => onAssign(task.id, e.target.value)}
                    disabled={!hasAssignPermission}
                    className="text-xs border border-mercury/50 dark:border-dark-border rounded-md focus:ring-primary focus:border-primary text-night bg-white dark:bg-dark-surface dark:text-dark-text py-1 pl-2 pr-7 disabled:bg-mercury/50 dark:disabled:bg-dark-border disabled:text-night/60"
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

TaskItem.propTypes = {
    task: TaskPropType.isRequired,
    onRequestToggle: PropTypes.func.isRequired,
    onAssign: PropTypes.func.isRequired,
    plan: PropTypes.oneOf(Object.values(UserPlan)).isRequired,
    isDemoMode: PropTypes.bool.isRequired,
};

export default TaskItem;