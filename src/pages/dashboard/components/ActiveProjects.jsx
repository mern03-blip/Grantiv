// ActiveProjectsCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { CalendarDaysIcon } from '../../../components/icons/Icons'; // Assuming this icon path is correct


const ActiveProjects = ({ inProgressGrants, tasks, onViewApplication }) => {

    
    // Component for a single project item
    const ProjectItem = ({ grant, tasks, onViewApplication }) => {
        // Calculate progress
        const grantTasks = tasks.filter(t => t.grantId === grant?.id);
        const completedGrantTasks = grantTasks.filter(t => t.completed).length;
        const totalGrantTasks = grantTasks.length;
        const progressPercent = totalGrantTasks > 0 ? (completedGrantTasks / totalGrantTasks) * 100 : 0;

        // Calculate urgency
        const nextDeadline = new Date(grant?.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysUntilDeadline = (nextDeadline.getTime() - today.getTime()) / (1000 * 3600 * 24);
        const isUrgent = daysUntilDeadline < 14 && daysUntilDeadline >= 0;

        // Format date
        const formattedDeadline = nextDeadline.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' });

        return (
            <motion.div
                key={grant?.id}
                className="bg-alabaster dark:bg-dark-background/60 p-4 rounded-xl border border-mercury/50 dark:border-dark-border/50 flex items-center gap-4 transition-colors"
                whileHover={{ borderColor: 'rgba(168, 221, 107, 0.5)' }}
            >
                <div className="flex-1">
                    <h4 className="font-bold text-night dark:text-dark-text">{grant.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-night/60 dark:text-dark-textMuted mt-1">
                        {/* Funder */}
                        <span>{grant?.funder}</span>
                        
                        {/* Deadline */}
                        <span className={`flex items-center gap-1.5 font-semibold ${isUrgent ? 'text-red-600 dark:text-red-400' : ''}`}>
                            <CalendarDaysIcon className="w-3.5 h-3.5"/>
                            {formattedDeadline}
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-night/80 dark:text-dark-text/90">Task Progress</span>
                            <span className="text-night/60 dark:text-dark-textMuted">{completedGrantTasks}/{totalGrantTasks}</span>
                        </div>
                        <div className="w-full bg-mercury dark:bg-dark-border rounded-full h-1.5">
                            <motion.div 
                                className="h-1.5 rounded-full bg-primary" 
                                initial={{ width: 0 }} 
                                animate={{ width: `${progressPercent}%` }} 
                                transition={{ duration: 0.5 }} 
                            />
                        </div>
                    </div>
                </div>
                
                {/* Action Button */}
                <motion.button 
                    onClick={() => onViewApplication(grant)} 
                    className="px-4 py-2 text-sm font-semibold bg-primary/80 text-night dark:text-dark-text rounded-lg hover:bg-primary transition-colors flex-shrink-0"
                    whileTap={{ scale: 0.95 }}
                >
                    View
                </motion.button>
            </motion.div>
        );
    };

    // Main component rendering
    return (
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-mercury/50 dark:border-dark-border/50 shadow-sm">
            <h2 className="text-xl font-bold font-heading mb-4 text-night dark:text-dark-text">Active Projects</h2>
            {inProgressGrants?.length > 0 ? (
                <div className="space-y-4">
                    {inProgressGrants.map(grant => (
                        <ProjectItem 
                            key={grant?.id} 
                            grant={grant} 
                            tasks={tasks} 
                            onViewApplication={onViewApplication}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-mercury dark:border-dark-border rounded-lg">
                    <p className="font-semibold text-night dark:text-dark-text">No active projects</p>
                    <p className="text-sm mt-1 text-night/60 dark:text-dark-textMuted">Start an application from "Find Grants" or by adding a project.</p>
                </div>
            )}
        </div>
    );
};

// PropTypes for Grant structure (simplified for example)
const grantShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    funder: PropTypes.string,
    deadline: PropTypes.string.isRequired,
    // Add other relevant grant properties here
});

// PropTypes for Task structure (simplified for example)
const taskShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    grantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    completed: PropTypes.bool.isRequired,
    // Add other relevant task properties here
});


ActiveProjects.propTypes = {
    inProgressGrants: PropTypes.arrayOf(grantShape).isRequired,
    tasks: PropTypes.arrayOf(taskShape).isRequired,
    onViewApplication: PropTypes.func.isRequired,
};

export default ActiveProjects;