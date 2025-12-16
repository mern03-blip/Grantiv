import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { SpinnerIcon, XIcon } from "../icons/Icons";

// 3. Mock useFocusTrap
const useFocusTrap = (ref) => {
  useEffect(() => {
    if (!ref.current) return;
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [ref]);
};

// 4. Mock useKeydown
const useKeydown = (key, callback) => {
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === key) {
        callback();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [key, callback]);
};

// --- Main Component ---
const AddTaskModal = ({ onClose, onAddTask }) => {
  const modalRef = useRef(null);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useFocusTrap(modalRef);
  useKeydown("Escape", onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    setIsLoading(true);
    try {
      const newTask = {
        id: Date.now(), 
        name: taskName.trim(),
        dueDate: dueDate,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await onAddTask(newTask);
      onClose();
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = taskName.trim() && dueDate;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-md w-full border border-mercury dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-mercury dark:border-dark-border flex justify-between items-center">
          <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text">
            Add New Task
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-night dark:text-dark-text hover:text-primary transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-semibold text-night dark:text-dark-text mb-2">
              Task
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:bg-dark-background dark:text-dark-text"
              placeholder="Enter task name"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-night dark:text-dark-text mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:bg-dark-background dark:text-dark-text"
              disabled={isLoading}
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-mercury/30 dark:bg-dark-background/50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-semibold bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-background text-night dark:text-dark-text"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={isLoading || !isFormValid}
            className="px-4 py-2 text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary disabled:bg-mercury dark:disabled:bg-dark-border dark:text-night disabled:text-night/50 flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : "Add Task"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

AddTaskModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
};

export default AddTaskModal;
