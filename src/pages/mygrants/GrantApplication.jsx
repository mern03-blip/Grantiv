import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronLeftIcon, SpinnerIcon } from "../../components/icons/Icons";
import ProgressBar from "../../components/progressbar/ProgressBar";
import DocumentHub from "./components/DocumentHub";
import { TeamChat } from "../teams/components/TeamChat";
import TaskItem from "./components/TaskItem";
import { useNavigate } from "react-router-dom";

// Mock Data for testing
const mockFiles = [
  {
    id: "1",
    name: "Business Plan Q4.pdf",
    size: "1.2 MB",
    comments: [{ id: "c1" }, { id: "c2" }],
  },
  {
    id: "2",
    name: "Financial Statements 2023.xlsx",
    size: "0.8 MB",
    comments: [],
  },
  {
    id: "3",
    name: "Council Approval Letter.docx",
    size: "0.5 MB",
    comments: [{ id: "c3" }],
  },
];

// Mock tasks data
const mockTasks = [
  { id: "1", title: "Submit business plan", completed: true, assignedTo: null },
  {
    id: "2",
    title: "Upload financial statements",
    completed: false,
    assignedTo: null,
  },
  {
    id: "3",
    title: "Get council approval",
    completed: false,
    assignedTo: null,
  },
];

const GrantApplication = ({
  grant = {
    title: "Sample Grant",
    funder: "Sample Funder",
    status: "DRAFTING",
  },
  tasks = mockTasks,
  onRequestToggleTask = () => {},
  isChecklistLoading = false,
  userPlan = "Starter",
  isDemoMode = true,
}) => {
  const [currentFiles, setCurrentFiles] = React.useState(mockFiles);

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const navigate = useNavigate();

  const handleDelete = (fileId) => {
    console.log("Deleting file:", fileId);
    setCurrentFiles(currentFiles.filter((f) => f.id !== fileId));
    // Add API call here
  };

  const handleAddComment = (fileId, text) => {
    console.log(`Adding comment to ${fileId}: ${text}`);
    // Add API call and state update logic here
  };

  const handleNavigate = () => {
    console.log("Navigating to settings/upgrade page.");
    // Add navigation logic here
  };

  const handleAssignTask = (taskId, userId) => {
    console.log(`Assigning task ${taskId} to user ${userId}`);
    // Add task assignment logic here
  };

  return (
    <div className="min-h-screen bg-alabaster dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-night/60 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text font-semibold mb-4"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Back to My Grants
          </button>
          {/* <h2 className="text-3xl font-bold text-night dark:text-dark-text font-heading">{grant.title}</h2> */}
          {/* <p className="text-night/60 dark:text-dark-textMuted">{grant.funder}</p> */}
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
          <ProgressBar status={grant.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Tasks */}
            <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-night dark:text-dark-text font-heading">
                  Application Checklist
                </h3>
                <span className="text-sm font-medium text-night/60 dark:text-dark-textMuted">
                  {completedTasks} / {totalTasks} Tasks Complete
                </span>
              </div>
              <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2 mb-4">
                <motion.div
                  className="h-2 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              {isChecklistLoading ? (
                <div className="text-center py-4">
                  <SpinnerIcon className="w-6 h-6 mx-auto text-primary" />
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-1">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onRequestToggle={onRequestToggleTask}
                      onAssign={handleAssignTask}
                      plan={userPlan}
                      isDemoMode={isDemoMode}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-night/50 dark:text-dark-textMuted py-4">
                  No tasks for this grant yet.
                </p>
              )}
            </div>
            {/* Document Hub */}
            <DocumentHub
              files={currentFiles}
              onDeleteFile={handleDelete}
              onAddComment={handleAddComment}
              plan="Starter"
              isDemoMode={true}
              navigateToSettings={handleNavigate}
            />
          </div>
          {/* Team Chat */}
          <div className="lg:col-span-1 min-h-[500px]">
            <TeamChat />
          </div>
        </div>
      </div>
    </div>
  );
};

GrantApplication.propTypes = {
  grant: PropTypes.shape({
    title: PropTypes.string,
    funder: PropTypes.string,
    status: PropTypes.string,
  }),
  onBack: PropTypes.func,
  tasks: PropTypes.array,
  onRequestToggleTask: PropTypes.func,
  isChecklistLoading: PropTypes.bool,
  userPlan: PropTypes.string,
  isDemoMode: PropTypes.bool,
};

export default GrantApplication;
