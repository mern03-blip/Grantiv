// ConfirmationModal.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// --- Mock Utility Hooks and Imports (Replace with your actual imports) ---

// 1. Mock useFocusTrap (Basic implementation for demonstration)
const useFocusTrap = (ref, isActive) => {
    useEffect(() => {
        if (!isActive || !ref.current) return;
        const focusableElements = ref.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            // Focus the close/cancel button or the first focusable element
            const cancelButton = focusableElements[focusableElements.length - 2];
            cancelButton && cancelButton.focus(); 
        }
    }, [ref, isActive]);
};

// 2. Mock useKeydown (Escape functionality)
const useKeydown = (key, callback, isActive) => {
    useEffect(() => {
        if (!isActive) return;
        const handleKeydown = (event) => {
            if (event.key === key) {
                callback();
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [key, callback, isActive]);
};

// --- Main Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText = 'Confirm' }) => {
    const modalRef = useRef(null);
    
    // Always call hooks - move conditional logic inside the hooks
    useFocusTrap(modalRef, isOpen);
    useKeydown('Escape', onClose, isOpen);
    
    if (!isOpen) return null;


    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            onClick={onClose} 
            aria-modal="true" 
            role="dialog" 
            aria-labelledby="confirmation-title"
        >
            <motion.div
                ref={modalRef}
                className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-md w-full border border-mercury dark:border-dark-border"
                onClick={(e) => e.stopPropagation()}
                // These motions are for the ENTER animation
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                // The EXIT animation MUST be handled by the parent's AnimatePresence
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
                <div className="p-6">
                    <h3 id="confirmation-title" className="text-lg font-bold font-heading text-night dark:text-dark-text">{title}</h3>
                    <p className="mt-2 text-sm text-night/70 dark:text-dark-textMuted">{message}</p>
                </div>
                <div className="px-6 py-4 bg-mercury/30 dark:bg-dark-background/50 flex justify-end gap-3 rounded-b-lg">
                    {/* Cancel Button */}
                    <motion.button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-background text-night dark:text-dark-text"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Cancel
                    </motion.button>
                    
                    {/* Confirm Button */}
                    <motion.button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {confirmButtonText}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirmButtonText: PropTypes.string,
};

export default ConfirmationModal;