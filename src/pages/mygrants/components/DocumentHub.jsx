import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  TrashIcon,
  UploadIcon,
} from "../../../components/icons/Icons";
import FileDetailModal from "../../../components/modals/FileDetailModal";

// 1. Mock Type Definitions
const UserPlan = {
  STARTER: "Starter",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

const UploadedFilePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.string, 
  comments: PropTypes.arrayOf(PropTypes.object), 
});

// 2. Mock Components
const UpgradeNotice = ({ featureName, onUpgrade }) => (
  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-300 text-center">
    <p className="font-semibold mb-2">Upgrade Required</p>
    <p className="text-sm">
      The **{featureName}** feature is unavailable on your current Starter plan.
      Upgrade to unlock this and more features.
    </p>
    <button
      onClick={onUpgrade}
      className="mt-3 px-4 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
    >
      Go to Settings
    </button>
  </div>
);
UpgradeNotice.propTypes = {
  featureName: PropTypes.string.isRequired,
  onUpgrade: PropTypes.func.isRequired,
};

export const DocumentHub = ({
  files,
  onDeleteFile,
  onAddComment,
  plan,
  isDemoMode,
  navigateToSettings,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const hasAccess = plan !== UserPlan.STARTER || isDemoMode;

  if (!hasAccess) {
    return (
      <UpgradeNotice
        featureName="Shared Document Hub"
        onUpgrade={navigateToSettings}
      />
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
        {/* Header and Upload Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-night dark:text-dark-text font-heading">
            Document Hub
          </h3>
          <motion.button
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-night font-semibold rounded-md hover:bg-secondary transition-colors"
            aria-label="Upload a new document for this application"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UploadIcon className="w-4 h-4" />
            Upload
          </motion.button>
        </div>

        {/* File List */}
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-mercury/30 dark:hover:bg-dark-background/50 group"
            >
              <DocumentTextIcon className="w-6 h-6 text-night/50 dark:text-dark-textMuted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setSelectedFile(file)}
                  className="text-sm font-medium text-night dark:text-dark-text truncate text-left hover:underline"
                >
                  {file.name}
                </button>
                <p className="text-xs text-night/60 dark:text-dark-textMuted">
                  {file.size} - {(file.comments || []).length} comments
                </p>
              </div>
              <button
                onClick={() => onDeleteFile(file.id)}
                className="text-night/40 dark:text-dark-textMuted/60 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete file: ${file.name}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          {/* Empty State */}
          {files.length === 0 && (
            <p className="text-sm text-center text-night/50 dark:text-dark-textMuted py-4">
              No documents uploaded.
            </p>
          )}
        </div>
      </div>

      {/* File Detail Modal */}
      <AnimatePresence>
        {selectedFile && (
          <FileDetailModal
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onAddComment={onAddComment}
          />
        )}
      </AnimatePresence>
    </>
  );
};

DocumentHub.propTypes = {
  files: PropTypes.arrayOf(UploadedFilePropType).isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  plan: PropTypes.oneOf(Object.values(UserPlan)).isRequired,
  isDemoMode: PropTypes.bool.isRequired,
  navigateToSettings: PropTypes.func.isRequired,
};

export default DocumentHub;
