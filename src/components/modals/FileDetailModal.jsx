import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { XIcon } from '../icons/Icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDocumentComment, getDocumentComments } from '../../api/endpoints/documents';
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode';




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


const FileDetailModal = ({ file, onClose }) => {
    const [comment, setComment] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const queryClient = useQueryClient();
    
    // Get current user from token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setCurrentUser({
                    _id: decodedToken.id,
                    name: decodedToken.name
                });
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);
  

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

    // Fetch comments for this document
    const { data: comments = [], isLoading: isLoadingComments, error: commentsError } = useQuery({
        queryKey: ['documentComments', file._id],
        queryFn: () => getDocumentComments(file._id),
        enabled: !!file._id,
    });

    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: (commentData) => addDocumentComment(file._id, commentData),
        onSuccess: () => {
            message.success("Comment added successfully");
            setComment('');
            // Invalidate and refetch comments
            queryClient.invalidateQueries({ queryKey: ['documentComments', file._id] });
        },
        onError: (error) => {
            message.error("Failed to add comment");
            console.error('Error adding comment:', error);
        }
    });

    const handleAddComment = () => {
        if (comment.trim()) {
            addCommentMutation.mutate({
                text: comment.trim(),
            });
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
                        {isLoadingComments ? (
                            <p className="text-sm text-night/50 dark:text-dark-textMuted text-center py-4">Loading comments...</p>
                        ) : commentsError ? (
                            <p className="text-sm text-red-500 text-center py-4">Error loading comments</p>
                        ) : comments.length > 0 ? (
                            comments.map(c => {
                                // Use API data structure
                                const commentUser = c.user || c.author || {};
                                return (
                                    <div key={c._id || c.id} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                                            {commentUser.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 bg-mercury/50 dark:bg-dark-background p-3 rounded-lg">
                                            <div className="flex items-baseline gap-2">
                                                <p className="font-semibold text-sm text-night dark:text-dark-text">{commentUser.name || 'Unknown User'}</p>
                                                <p className="text-xs text-night/60 dark:text-dark-textMuted">{new Date(c.createdAt || c.timestamp).toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm text-night/90 dark:text-dark-text/90 mt-1">{c.text || c.content}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-night/50 dark:text-dark-textMuted text-center py-4">No comments yet.</p>
                        )}
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
                            disabled={!comment.trim() || addCommentMutation.isPending}
                            className="px-4 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary disabled:bg-mercury/80 dark:disabled:bg-dark-border disabled:text-night/50"
                        >
                            {addCommentMutation.isPending ? 'Sending...' : 'Send'}
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