import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { XIcon } from '../icons/Icons';


// 1. Mock Team Data and Types
const MOCK_TEAM = [
    { id: 'm1', name: 'Alice', avatar: 'https://via.placeholder.com/40/0000FF/FFFFFF?text=A' },
    { id: 'm2', name: 'Bob', avatar: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=B' },
];

const CommentPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    memberId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired, // ISO date string
});

const UploadedFilePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    uploadDate: PropTypes.string.isRequired, // ISO date string
    comments: PropTypes.arrayOf(CommentPropType),
});

// 2. Mock Utility Hooks and Icons
const useFocusTrap = (ref) => { 
    useEffect(() => {
        if (!ref.current) return;
        const focusableElements = ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus(); 
        }
    }, [ref]);
};
const useKeydown = (key, callback) => {
    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === key) {
                callback();
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [key, callback]);
};


const FileDetailModal = ({ file, onClose, onAddComment }) => {
    const [comment, setComment] = useState('');
    
    // Create a map for quick access to team member details
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
        if(comment.trim()){
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
                {/* Header */}
                <div className="p-4 border-b border-mercury dark:border-dark-border flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text">{file.name}</h3>
                        <p className="text-xs text-night/60 dark:text-dark-textMuted">
                            {file.size} - {file.type} - Uploaded on {new Date(file.uploadDate).toLocaleDateString()}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-night/50 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text" 
                        aria-label="Close file details"
                    >
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                {/* Comments Section (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="font-bold text-night dark:text-dark-text mb-3">Comments</h4>
                    <div className="space-y-4">
                        {(file.comments || []).map(c => {
                            const member = teamMembersById[c.memberId];
                            return (
                                <div key={c.id} className="flex items-start gap-3">
                                    <img src={member?.avatar} alt={member?.name || 'Unknown User'} className="w-8 h-8 rounded-full object-cover" />
                                    <div className="flex-1 bg-mercury/50 dark:bg-dark-background p-3 rounded-lg">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-semibold text-sm text-night dark:text-dark-text">{member?.name || 'Unknown User'}</p>
                                            <p className="text-xs text-night/60 dark:text-dark-textMuted">{new Date(c.timestamp).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-night/90 dark:text-dark-text/90 mt-1">{c.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Empty Comments State */}
                        {(!file.comments || file.comments.length === 0) && <p className="text-sm text-night/50 dark:text-dark-textMuted text-center py-4">No comments yet.</p>}
                    </div>
                </div>
                
                {/* Comment Input */}
                <div className="p-4 border-t border-mercury dark:border-dark-border">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:border-dark-border dark:text-dark-text"
                            aria-label="New comment text input"
                        />
                        <button 
                            onClick={handleAddComment} 
                            disabled={!comment.trim()}
                            className="px-4 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary disabled:bg-mercury/80 dark:disabled:bg-dark-border disabled:text-night/50"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

FileDetailModal.propTypes = {
    file: UploadedFilePropType.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddComment: PropTypes.func.isRequired,
};

export default FileDetailModal;