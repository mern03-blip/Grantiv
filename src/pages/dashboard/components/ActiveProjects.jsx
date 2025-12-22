import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { CalendarDaysIcon } from "../../../components/icons/Icons";
import { useQuery } from "@tanstack/react-query";
import { getMyGrants } from "../../../api/endpoints/customGrant";
import { getTask } from "../../../api/endpoints/grantTask";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loading/Loader";

const ActiveProjects = () => {
  const navigate = useNavigate();
  // Fetch grants data from API
  const { data: grantsData = [], isLoading } = useQuery({
    queryKey: ["myGrants"],
    queryFn: getMyGrants,
  });

  // Map API data to required format
  const mappedGrants = grantsData.map((grant) => ({
    id: grant._id,
    _id: grant._id,
    title: grant.title,
    funder: grant.agency, 
    agency: grant.agency,
    deadline: grant.deadline,
    status: grant.status,
    amount: grant.amount,
    description: grant.description,
    eligibility: grant.eligibility,
    createdAt: grant.createdAt,
    updatedAt: grant.updatedAt,
    organization: grant.organization,
  }));

  // Filter active/in-progress grants (drafting, submitted, in_review)
  const activeGrants = mappedGrants.filter((grant) =>
    ["drafting", "submitted", "in_review"].includes(grant.status?.toLowerCase())
  );

  // Component for a single project item
  const ProjectItem = ({ grant }) => {
    // Fetch tasks for this specific grant
    const { data: grantTasks = [] } = useQuery({
      queryKey: ["grantTasks", grant._id],
      queryFn: () => getTask(grant._id),
      enabled: !!grant._id,
    });

    // Process tasks data
    let tasksArray = [];
    if (grantTasks) {
      if (Array.isArray(grantTasks)) {
        tasksArray = grantTasks;
      } else if (typeof grantTasks === "object") {
        tasksArray = [grantTasks];
      }
    }

    // Calculate progress based on real tasks
    const completedTasks = tasksArray.filter(
      (task) => task.isCompleted === true || task.completed === true
    ).length;
    const totalTasks = tasksArray.length;
    const progressPercent =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate urgency
    const nextDeadline = new Date(grant?.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntilDeadline =
      (nextDeadline.getTime() - today.getTime()) / (1000 * 3600 * 24);
    const isUrgent = daysUntilDeadline < 14 && daysUntilDeadline >= 0;

    // Format date
    const formattedDeadline = nextDeadline.toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
    });

    return (
      <motion.div
        key={grant?.id}
        className="bg-alabaster dark:bg-dark-background/60 p-4 rounded-xl border border-mercury/50 dark:border-dark-border/50 flex items-center gap-4 transition-colors"
        whileHover={{ borderColor: "rgba(168, 221, 107, 0.5)" }}
      >
        <div className="flex-1">
          <h4 className="font-bold text-night dark:text-dark-text">
            {grant?.title}
          </h4>
          <div className="flex items-center gap-4 text-xs text-night/60 dark:text-dark-textMuted mt-1">
            {/* Funder - using agency field */}
            <span>{grant?.agency || grant?.funder}</span>

            {/* Deadline */}
            <span
              className={`flex items-center gap-1.5 font-semibold ${
                isUrgent ? "text-red-600 dark:text-red-400" : ""
              }`}
            >
              <CalendarDaysIcon className="w-3.5 h-3.5" />
              {formattedDeadline}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-night/80 dark:text-dark-text/90">
                Task Progress
              </span>
              <span className="text-night/60 dark:text-dark-textMuted">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <div className="w-full bg-mercury/80 dark:bg-dark-border rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={() =>
            navigate("/grant-application", {
              state: {
                grant: {
                  id: grant._id || grant.id,
                  title: grant.title,
                  agency: grant.agency,
                  status: grant.status,
                  amount: grant.amount,
                  deadline: grant.deadline,
                  description: grant.description,
                  eligibility: grant.eligibility,
                },
              },
            })
          }
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
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border overflow-y-auto h-[330px] no-scrollbar border-mercury/50 dark:border-dark-border/50 shadow-sm">
      <h2 className="text-xl font-bold font-heading mb-4 text-night dark:text-dark-text">
        Active Projects
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : activeGrants?.length > 0 ? (
        <div className="space-y-4">
          {activeGrants.map((grant) => (
            <ProjectItem key={grant?._id} grant={grant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-mercury dark:border-dark-border rounded-lg">
          <p className="font-semibold text-night dark:text-dark-text">
            No active projects
          </p>
          <p className="text-sm mt-1 text-night/60 dark:text-dark-textMuted">
            Start an application from "Find Grants" or by adding a project.
          </p>
        </div>
      )}
    </div>
  );
};

ActiveProjects.propTypes = {
  // Currently no props needed as component fetches its own data
};

// PropTypes for Grant structure
const GrantPropType = PropTypes.shape({
  id: PropTypes.string,
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  funder: PropTypes.string,
  agency: PropTypes.string,
  deadline: PropTypes.string,
  status: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  eligibility: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  organization: PropTypes.string,
});



// PropTypes for ProjectItem component
const ProjectItem = () => {
  // ... component implementation
};

ProjectItem.propTypes = {
  grant: GrantPropType.isRequired,
};

export default ActiveProjects;
