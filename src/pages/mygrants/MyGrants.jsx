import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/progressbar/ProgressBar";
import { PlusIcon } from "../../components/icons/Icons";
import AddGrantModal from "../../components/modals/AddGrantModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyGrants,
  updateGrantStatus,
} from "../../api/endpoints/customGrant";
import GrantDetailModal from "../../components/modals/GrantsDetail";

// 1. GrantStatus Enum equivalent
const GrantStatus = {
  DRAFTING: "DRAFTING",
  SUBMITTED: "SUBMITTED",
  IN_REVIEW: "IN_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  AWARDED: "AWARDED",
};

// Map API status to GrantStatus enum
const mapApiStatusToEnum = (apiStatus) => {
  const statusMap = {
    drafting: GrantStatus.DRAFTING,
    submitted: GrantStatus.SUBMITTED,
    in_review: GrantStatus.IN_REVIEW,
    approved: GrantStatus.APPROVED,
    rejected: GrantStatus.REJECTED,
    awarded: GrantStatus.AWARDED,
  };
  return statusMap[apiStatus?.toLowerCase()] || GrantStatus.DRAFTING;
};

// 4. Mock Grant Structure for PropTypes
const GrantPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  funder: PropTypes.string,
  status: PropTypes.oneOf(Object.values(GrantStatus)).isRequired,
});

// --- Main Component ---

const MyGrantsView = ({ myGrants = [], onAddGrant }) => {
  // Note: TypeScript enum values are used as string keys in useState
  const [activeTab, setActiveTab] = useState("All");
  const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["myGrants"],
    queryFn: getMyGrants,
  });

  // Mutation for updating grant status
  const updateStatusMutation = useMutation({
    mutationFn: ({ grantId, status }) => updateGrantStatus(grantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGrants"] });
    },
    onError: (error) => {
      console.error("Error updating grant status:", error);
    },
  });

  // Use mock data for now, fallback to props if needed
  const grantsArray =
    data && data.length > 0
      ? data?.map((grant) => ({
          ...grant,
          id: grant._id, // Map _id to id for consistency
          status: mapApiStatusToEnum(grant.status), // Convert API status to enum
          funder: grant.agency, // Map agency to funder for consistency
        }))
      : Array.isArray(myGrants)
      ? myGrants
      : [];

  // Tabs array. Ensure the string literals match the GrantStatus values or 'All'.
  const tabs = [
    "All",
    GrantStatus.DRAFTING,
    GrantStatus.SUBMITTED,
    GrantStatus.AWARDED,
  ];

  // Handle opening the Add Grant modal
  const handleAddGrantClick = () => {
    setIsAddGrantModalOpen(true);
    if (onAddGrant) onAddGrant();
  };

  // Handle closing the Add Grant modal
  const handleCloseModal = () => {
    setIsAddGrantModalOpen(false);
  };

  const handleAddFromText = async (grantText) => {
    try {
      console.log("Processing grant text:", grantText);
      setIsAddGrantModalOpen(false);
    } catch (error) {
      console.error("Error processing grant text:", error);
      throw error;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const filteredGrants =
    activeTab === "All"
      ? grantsArray
      : grantsArray.filter((g) => g.status === activeTab);

  // Helper function to count grants for a given status/tab
  const getCountForTab = (tab) => {
    if (!grantsArray || grantsArray.length === 0) return 0;
    return tab === "All"
      ? grantsArray.length
      : grantsArray.filter((g) => g.status === tab).length;
  };

  return (
    <>
      <div className="space-y-8 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-night dark:text-dark-text font-heading">
              My Grants
            </h1>
            <p className="text-night/60 dark:text-dark-textMuted">
              Track and manage your grant applications.
            </p>
          </div>
          <motion.button
            onClick={handleAddGrantClick}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon className="w-5 h-5" />
            Add Grant Project
          </motion.button>
        </div>

        <div>
          {/* Tab Navigation */}
          <div className="border-b border-mercury/50 dark:border-dark-border">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  disabled={updateStatusMutation.isPending}
                  className={`${
                    activeTab === tab
                      ? "border-primary dark:border-dark-primary text-primary dark:text-dark-primary"
                      : "border-transparent text-night/60 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text hover:border-mercury dark:hover:border-dark-border"
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    updateStatusMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {tab}
                  <span className="ml-2 bg-mercury/80 dark:bg-dark-border text-night/70 dark:text-dark-textMuted text-xs font-semibold px-2 py-0.5 rounded-full">
                    {getCountForTab(tab)}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Grant List / Empty State */}
        {filteredGrants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrants.map((grant) => (
              <div
                key={grant.id}
                className="bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border p-5 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow"
              >
                <div>
                  <h3 className="font-bold font-heading text-lg text-night dark:text-dark-text">
                    {grant.title}
                  </h3>
                  <p className="text-sm text-night/60 dark:text-dark-textMuted mb-3">
                    {grant.agency || "N/A"}
                  </p>
                  <ProgressBar
                    status={grant.status}
                    grantId={grant._id || grant.id}
                    onStatusUpdate={(grantId, status) =>
                      updateStatusMutation.mutate({ grantId, status })
                    }
                  />
                </div>
                <div className="mt-5 flex gap-2">
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
                    className="w-full py-2 bg-primary text-night font-semibold rounded-md hover:bg-secondary transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Application
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setSelectedGrant(grant);
                      setIsModalOpen(true);
                    }}
                    className="w-full py-2 bg-mercury/50 dark:bg-dark-border text-night dark:text-dark-text font-semibold rounded-md hover:bg-mercury dark:hover:bg-dark-border/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Details
                  </motion.button>              
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-lg border-2 border-dashed border-mercury dark:border-dark-border">
            <p className="font-semibold text-lg text-night dark:text-dark-text">
              No grants in this category
            </p>
            <p className="text-night/60 dark:text-dark-textMuted">
              You have no grant applications with the status "{activeTab}".
            </p>
          </div>
        )}
      </div>

      {/* ✅ Move Modal Outside the Map Loop - Single Instance */}
      {isModalOpen && selectedGrant && (
        <GrantDetailModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGrant(null);
          }}
          grant={selectedGrant}
        />
      )}

      <div>
        {/* Add Grant Modal */}
        {isAddGrantModalOpen && (
          <AddGrantModal
            onClose={handleCloseModal}
            onAddFromText={handleAddFromText}
          />
        )}
      </div>
    </>
  );
};

MyGrantsView.propTypes = {
  myGrants: PropTypes.arrayOf(GrantPropType),
  onSelectGrant: PropTypes.func.isRequired,
  onViewApplication: PropTypes.func.isRequired,
  onAddGrant: PropTypes.func.isRequired,
};

MyGrantsView.defaultProps = {
  myGrants: [],
};

export default MyGrantsView;
