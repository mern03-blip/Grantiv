import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronLeftIcon, SpinnerIcon } from "../../components/icons/Icons";
import ProgressBar from "../../components/progressbar/ProgressBar";
import DocumentHub from "./components/DocumentHub";
import { TeamChat } from "../teams/components/TeamChat";
import TaskItem from "./components/TaskItem";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateGrantStatus } from "../../api/endpoints/customGrant";
import { getTask } from "../../api/endpoints/grantTask";
import AddChkTaskModal from "../../components/modals/AddChkTaskModal";
import GrantApproveModal from "../../components/modals/GrantApproveModal";

const GrantApplication = ({
  onRequestToggleTask = () => {},
  isChecklistLoading = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Get grant data from navigation state or use default
  const grant = location.state?.grant || {
    title: "Sample Grant",
    agency: "Sample Funder",
    status: "DRAFTING",
  };

  const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [localStatus, setLocalStatus] = useState(grant.status);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState(null);

  const organizationId = localStorage.getItem("orgId");

  // Mutation for updating grant status
  const updateStatusMutation = useMutation({
    mutationFn: ({ grantId, status }) => updateGrantStatus(grantId, status),

    onMutate: async ({ status }) => {
      setLocalStatus(status);
    },

    onError: () => {
      setLocalStatus(grant.status);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myGrants"] });
    },
  });

  // Handler for status updates coming from ProgressBar
  const handleStatusUpdate = (grantId, status) => {
    // If user clicked the Outcome step, show confirmation modal instead of immediate mutation
    if (status === "AWARDED") {
      setPendingOutcome(status);
      setShowApproveModal(true);
      return;
    }

    // For other statuses, proceed normally
    updateStatusMutation.mutate({ grantId, status });
  };

  // Fetch tasks for this grant
  const {
    data: fetchedTasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useQuery({
    queryKey: ["grantTasks", grant.id],
    queryFn: () => getTask(grant.id),
    enabled: !!grant.id,
  });

  // Process tasks data
  let realTasks = [];
  if (fetchedTasks) {
    if (Array.isArray(fetchedTasks)) {
      realTasks = fetchedTasks;
    } else if (typeof fetchedTasks === "object") {
      realTasks = [fetchedTasks];
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser({
        _id: decodedToken.id,
        name: decodedToken.name,
      });
    }
  }, []);

  // Calculate progress based on real tasks
  const tasksToUse = realTasks.length > 0 ? realTasks : [];
  const completedTasks = tasksToUse.filter(
    (task) => task.isCompleted === true || task.completed === true
  ).length;
  const totalTasks = tasksToUse.length;
  const progressPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleNavigate = () => {
    console.log("Navigating to settings/upgrade page.");
  };

  const handleAddTask = async (newTask) => {
    console.log("Adding new task:", newTask);
    return Promise.resolve();
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
        </div>

        {/* Grant Info Card with Progress Bar */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
          <h2 className="text-2xl font-bold text-night dark:text-dark-text font-heading mb-2">
            {grant.title}
          </h2>
          <p className="text-night/60 dark:text-dark-textMuted mb-4">
            {grant.agency}
          </p>

          {/* Reusable ProgressBar - Clickable to update status */}
          <ProgressBar
            status={localStatus}
            grantId={grant.id}
            onStatusUpdate={handleStatusUpdate}
            isClickable={true} // Enable clicking to change status
            disableOptimisticStatuses={["AWARDED"]} // Don't optimistically update AWARDED
            showTitle={true}
            showCurrentStatus={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {/* Tasks */}
            <div className="mb-8 bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-night dark:text-dark-text font-heading">
                  Application Checklist
                </h3>
                <div className="space-x-2">
                  <span className="text-sm font-medium text-night/60 dark:text-dark-textMuted">
                    {completedTasks} / {totalTasks} Tasks Complete
                  </span>
                  <Button
                    onClick={() => setShowAddTaskModal(true)}
                    className="!border !border-mercury/50 dark:border-dark-border/50 !text-night dark:hover:text-dark-text hover:border-mercury/30"
                  >
                    Add Task
                  </Button>
                </div>
              </div>
              <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2 mb-4">
                <motion.div
                  className="h-2 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              {isChecklistLoading || isTasksLoading ? (
                <div className="text-center py-4">
                  <SpinnerIcon className="w-6 h-6 mx-auto text-primary" />
                </div>
              ) : isTasksError ? (
                <div className="text-center py-4">
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Error loading tasks
                  </span>
                </div>
              ) : (
                <TaskItem
                  grantId={grant.id}
                  onRequestToggle={onRequestToggleTask}
                  tasks={realTasks}
                />
              )}
            </div>

            {/* Document Hub */}
            <DocumentHub
              grantId={grant.id}
              plan="Starter"
              isDemoMode={true}
              navigateToSettings={handleNavigate}
            />
          </div>

          {/* Team Chat */}
          <div className="lg:col-span-1 min-h-[500px]">
            <TeamChat
              currentUser={currentUser}
              selectedOrgId={organizationId}
              projectId={grant.id}
            />
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddChkTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onAddTask={handleAddTask}
          grantId={grant.id}
        />
      )}

      {/* Approve/Reject Outcome Modal */}
      <GrantApproveModal
        open={showApproveModal}
        grantTitle={grant.title}
        onCancel={() => setShowApproveModal(false)}
        onAccept={async () => {
          setShowApproveModal(false);
          updateStatusMutation.mutate({ grantId: grant.id, status: "AWARDED" });
        }}
        onReject={async () => {
          setShowApproveModal(false);
          updateStatusMutation.mutate({ grantId: grant.id, status: "REJECTED" });
        }}
      />
    </div>
  );
};

GrantApplication.propTypes = {
  onBack: PropTypes.func,
  tasks: PropTypes.array,
  onRequestToggleTask: PropTypes.func,
  isChecklistLoading: PropTypes.bool,
  userPlan: PropTypes.string,
  isDemoMode: PropTypes.bool,
};

export default GrantApplication;