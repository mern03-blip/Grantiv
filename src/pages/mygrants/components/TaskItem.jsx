import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, TrashIcon } from "../../../components/icons/Icons";
import { toggleTask, deleteTask } from "../../../api/endpoints/grantTask";
import DeleteUserModal from "../../../components/modals/DeleteUserModal";

const TaskItem = ({ grantId, onRequestToggle, tasks = [] }) => {
  const queryClient = useQueryClient();

  // Mutation for toggling task status
  const toggleTaskMutation = useMutation({
    mutationFn: toggleTask,
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["grantTasks", grantId] });
    },
    onError: (error) => {
      console.error("Error toggling task:", error);
    },
  });

  // Mutation for deleting task
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["grantTasks", grantId] });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
    },
  });

  // Handle task toggle
  const handleTaskToggle = (taskId) => {
    toggleTaskMutation.mutate(taskId);
    // Also call the parent callback if provided
    if (onRequestToggle) {
      onRequestToggle(taskId);
    }
  };

  // Use tasks passed as props
  const taskArray = Array.isArray(tasks) ? tasks : [];

  // Handle empty tasks
  if (taskArray.length === 0) {
    return (
      <div className="text-center py-4">
        <span className="text-sm text-night/60 dark:text-dark-textMuted">
          No tasks found
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {taskArray.map((task, index) => (
        <TaskItemRow
          key={task.id || task._id || `task-${index}`}
          task={task}
          onRequestToggle={handleTaskToggle}
          isLoading={toggleTaskMutation.isPending}
          deleteTaskMutation={deleteTaskMutation}
        />
      ))}
    </div>
  );
};

// Separate component for individual task row
const TaskItemRow = ({
  task,
  onRequestToggle,
  isLoading,
  deleteTaskMutation,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Trigger delete mutation
    deleteTaskMutation.mutate(task.id || task._id);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 py-2 border-b border-mercury/30 dark:border-dark-border/50 last:border-b-0">
        {/* 1. Toggle Button */}
        <button
          onClick={() => onRequestToggle(task.id || task._id)}
          disabled={isLoading}
          className={`flex-shrink-0 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={
            task.isCompleted
              ? `Mark task as incomplete: ${task.name || task.text}`
              : `Mark task as complete: ${task.name || task.text}`
          }
        >
          {task.isCompleted ? (
            <CheckCircleIcon className="w-6 h-6 text-primary" />
          ) : (
            <div className="w-6 h-6 border-2 border-mercury/80 dark:border-dark-border rounded-full hover:border-primary transition"></div>
          )}
        </button>

        {/* 2. Task Text*/}
        <div className="flex-1 flex items-center gap-2">
          <span
            className={`text-sm transition-colors ${
              task.isCompleted
                ? "line-through text-night/50 dark:text-dark-textMuted/60"
                : "text-night dark:text-dark-text"
            }`}
          >
            {task.name || task.text || "Untitled Task"}
          </span>
        </div>

        {/* 3. Task Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDeleteClick}
            className="text-night/40 dark:text-dark-textMuted/60 hover:text-red-500 transition-colors"
            aria-label="Delete task"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <span
            className={`text-xs px-2 py-1 rounded ${
              task.isCompleted === true
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}
          >
            {task.isCompleted === true ? "Completed" : "Incomplete"}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        handleOk={handleDeleteConfirm}
        handleCancel={handleDeleteCancel}
        text={`Are you sure you want to delete the task "${
          task.name || task.text || "Untitled Task"
        }"?`}
      />
    </>
  );
};

// PropTypes for TaskItemRow
TaskItemRow.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    text: PropTypes.string,
    isCompleted: PropTypes.bool,
    deadline: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onRequestToggle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  deleteTaskMutation: PropTypes.object.isRequired,
};

TaskItem.propTypes = {
  grantId: PropTypes.string.isRequired,
  onRequestToggle: PropTypes.func.isRequired,
  tasks: PropTypes.array,
};

export default TaskItem;
