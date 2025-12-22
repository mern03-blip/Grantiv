import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { SpinnerIcon, XIcon } from '../icons/Icons';
import { extractMyGrants, createMyGrants } from '../../api/endpoints/customGrant';


// 3. Mock useFocusTrap (Basic implementation)
const useFocusTrap = (ref) => {
    // In a real application, this would manage tabbing focus within the modal.
    useEffect(() => {
        if (!ref.current) return;
        const focusableElements = ref.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus(); // Focus the first focusable element
        }
    }, [ref]);
};

// 4. Mock useKeydown (Escape functionality)
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

// --- Main Component ---

const AddGrantModal = ({ onClose, onAddFromText }) => {
    const modalRef = useRef(null);
    const [grantText, setGrantText] = useState('');
    
    useFocusTrap(modalRef);
    useKeydown('Escape', onClose);
    
    // Extract grants mutation
    const extractMutation = useMutation({
        mutationFn: extractMyGrants,
        onSuccess: (extractResponse) => {
            console.log("Grant extraction response:", extractResponse);
            // Trigger create mutation with extract response
            createMutation.mutate(extractResponse);
        },
        onError: (error) => {
            console.error("Error extracting grant:", error);
        }
    });
    
    // Create grants mutation
    const createMutation = useMutation({
        mutationFn: createMyGrants,
        onSuccess: async (createResponse) => {
            console.log("Grant creation response:", createResponse);
            
            // Call the parent callback if provided
            if (onAddFromText) {
                await onAddFromText(createResponse);
            }
            
            // Close the modal upon successful submission
            onClose();
        },
        onError: (error) => {
            console.error("Error creating grant:", error);
        }
    });
    
    const handleSubmit = () => {
        if (!grantText.trim()) return;
        extractMutation.mutate(grantText);
    };
    
    // Combined loading state
    const isLoading = extractMutation.isPending || createMutation.isPending;


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
                ref={modalRef}
                className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-2xl w-full border border-mercury dark:border-dark-border"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
            >
                {/* Header */}
                <div className="p-6 border-b border-mercury dark:border-dark-border flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text">Add New Grant Project</h3>
                    <button onClick={onClose} aria-label="Close modal" className="text-night dark:text-dark-text hover:text-primary transition-colors"><XIcon className="w-6 h-6"/></button>
                </div>
                
                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-night/70 dark:text-dark-textMuted mb-4">Paste the text from a grant website or document below. Our AI will automatically extract the key details to create a new project for you.</p>
                    <textarea
                        value={grantText}
                        onChange={e => setGrantText(e.target.value)}
                        rows={10}
                        className="w-full p-3 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:bg-dark-background dark:text-dark-text"
                        placeholder="Paste grant details here..."
                        disabled={isLoading}
                    />
                </div>
                
                {/* Footer / Actions */}
                <div className="px-6 py-4 bg-mercury/30 dark:bg-dark-background/50 flex justify-end gap-3 rounded-b-lg">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-semibold bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-background text-night dark:text-dark-text"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isLoading || !grantText.trim()} 
                        className="px-4 py-2 text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary disabled:bg-mercury dark:disabled:bg-dark-border dark:text-night disabled:text-night/50 flex items-center justify-center min-w-[120px]"
                    >
                        {isLoading ? <SpinnerIcon className="w-5 h-5"/> : 'Create Project'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

AddGrantModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onAddFromText: PropTypes.func.isRequired,
};

export default AddGrantModal;