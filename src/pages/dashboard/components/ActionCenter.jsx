import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import AddGrantModal from "../../../components/modals/AddGrantModal";
import DeleteUserModal from "../../../components/modals/DeleteUserModal";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import AddTaskModal from "../../../components/modals/AddTaskModal";
import {
  SearchIcon,
  PlusCircleIcon,
  SparklesIcon,
  ChevronRightIcon,
  TrashIcon,
  CheckIcon,
} from "../../../components/icons/Icons";
import { Button } from "antd";
import {
  completetasks,
  createtasks,
  deletetasks,
  gettasks,
} from "../../../api/endpoints/personaltask";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
      <p className="text-sm text-night/60 dark:text-dark-textMuted">
        {description}
      </p>
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
const ActionCenter = ({ onAddGrant, myGrants = [] }) => {
  // Modal state management
  const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToConfirm, setTaskToConfirm] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => gettasks(),
  });

  const tasks = data?.data || [];

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

  // Handle opening the Add Task modal
  const handleAddTaskClick = () => {
    setIsAddTaskModalOpen(true);
  };

  // Handle closing the Add Task modal
  const handleCloseTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  // Handle adding a new task
  const handleAddTask = async (newTask) => {
    try {
      await createtasks(newTask.name, newTask.dueDate);
      queryClient.invalidateQueries(["tasks"]);
      setIsAddTaskModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      throw error; // Re-throw to let the modal handle it
    }
  };

  // Handle task completion button click (shows confirmation)
  const handleTaskToggleClick = (task) => {
    setTaskToConfirm(task);
  };

  // Handle confirmed task completion
  const handleConfirmToggleTask = async () => {
    if (!taskToConfirm) return;
    try {
      await completetasks(taskToConfirm._id);
      queryClient.invalidateQueries(["tasks"]);
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    } finally {
      setTaskToConfirm(null);
    }
  };

  const handleAddFromText = async (grantText) => {
    try {
      console.log("Processing grant text:", grantText);

      setIsAddGrantModalOpen(false);
    } catch (error) {
      console.error("Error processing grant text:", error);
      throw error; // Re-throw to let the modal handle it
    }
  };

  // Filter and sort incomplete tasks (max 4 for the urgent list)
  const incompleteTasks = tasks
    .filter((task) => !task.completed)
    .sort(
      (a, b) =>
        new Date(a.deadline || "9999").getTime() -
        new Date(b.deadline || "9999").getTime()
    )
    .slice(0, 4);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-mercury/50 dark:border-dark-border/50 shadow-sm h-full">
        {/* Action Links Section */}
        <h3 className="text-xl font-bold font-heading text-night dark:text-dark-text mb-4">
          Action Center
        </h3>
        <div className="space-y-1">
          <ActionLinkCard
            icon={SearchIcon}
            title="Find New Grants"
            description="Explore funding opportunities."
            onClick={() => navigate("/find-grants")}
          />
          <ActionLinkCard
            icon={PlusCircleIcon}
            title="Add a Grant Project"
            description="Manually add an application."
            onClick={handleAddGrantClick}
          />
          <ActionLinkCard
            icon={SparklesIcon}
            title="Chat with AI Assistant"
            description="Get help with your writing."
            onClick={() => navigate("/ai-assistant")}
          />
        </div>

        {/* Urgent Tasks Section */}
        <div className="mt-6 pt-6 border-t border-mercury/50 dark:border-dark-border/50">
          {/* Header Section - Always Visible */}
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-night dark:text-dark-text">
              Urgent Tasks ({incompleteTasks.length})
            </h4>
            <Button
              onClick={handleAddTaskClick}
              className="!border !border-mercury/50 dark:border-dark-border/50 !text-night dark:hover:text-dark-text hover:border-mercury/30"
            >
              Add Task
            </Button>
          </div>

          {/* Conditional Task List */}
          {incompleteTasks.length > 0 ? (
            <div className="space-y-2">
              {incompleteTasks.map((task) => {
                const deadlineDate = new Date(task.dueDate);
                const isPastDue = deadlineDate < new Date();

                return (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 py-2 border-b border-mercury/30 dark:border-dark-border/50 last:border-b-0"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => handleTaskToggleClick(task)}
                      className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition flex-shrink-0
                ${
                  task.isCompleted
                    ? "bg-primary border-primary text-white"
                    : "border-mercury/80 dark:border-dark-border hover:border-primary"
                }`}
                      aria-label={`Mark task as complete: ${task.name}`}
                    >
                      {task.isCompleted && (
                        <CheckIcon className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Task content */}
                    <div className="flex-1">
                      <span
                        className={`text-sm ${
                          task.isCompleted
                            ? "line-through text-night/40 dark:text-dark-textMuted"
                            : "text-night dark:text-dark-text"
                        }`}
                      >
                        {task.name}
                      </span>

                      {task.dueDate && !task.isCompleted && (
                        <p
                          className={`text-xs font-bold ${
                            isPastDue
                              ? "text-red-600 dark:text-red-400"
                              : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          Due: {deadlineDate.toLocaleDateString("en-AU")}
                        </p>
                      )}
                    </div>

                    {/* Trash icon */}
                    <button
                      onClick={() => {
                        setTaskToDeleteId(task._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-night/40 dark:text-dark-textMuted hover:text-red-600 dark:hover:text-red-400 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State - Shown when tasks length is 0 */
            <div className="text-center py-4">
              <p className="text-sm text-night/60 dark:text-dark-textMuted">
                {myGrants && myGrants.length > 0
                  ? "All tasks completed! ✨"
                  : "No tasks yet  add your task."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Grant Modal */}
      {isAddGrantModalOpen && (
        <AddGrantModal
          onClose={handleCloseModal}
          onAddFromText={handleAddFromText}
        />
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={handleCloseTaskModal}
          onAddTask={handleAddTask}
        />
      )}

      {/* Task Completion Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!taskToConfirm}
        onClose={() => setTaskToConfirm(null)}
        onConfirm={handleConfirmToggleTask}
        title="Complete Task?"
        message={
          taskToConfirm
            ? `Are you sure you want to mark "${taskToConfirm.name}" as complete?`
            : "Are you sure you want to mark this task as complete?"
        }
        confirmButtonText="Yes, Complete"
      />

      {/* Delete Task Confirmation Modal */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        handleCancel={() => {
          setIsDeleteModalOpen(false);
          setTaskToDeleteId(null);
        }}
        handleOk={async () => {
          if (!taskToDeleteId) return;
          try {
            await deletetasks(taskToDeleteId);
            queryClient.invalidateQueries(["tasks"]);
          } catch (err) {
            console.error("Error deleting task:", err);
          } finally {
            setIsDeleteModalOpen(false);
            setTaskToDeleteId(null);
          }
        }}
        text={"Are you sure you want to delete this task?"}
      />
    </div>
  );
};

ActionCenter.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onAddGrant: PropTypes.func.isRequired,
  onRequestToggleTask: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      deadline: PropTypes.string,
      completed: PropTypes.bool.isRequired,
    })
  ),
  myGrants: PropTypes.array,
};

ActionCenter.defaultProps = {
  myGrants: [],
};

export default ActionCenter;
