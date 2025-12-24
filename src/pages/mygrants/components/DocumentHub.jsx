// import React, { useState, useRef } from "react";
// import PropTypes from "prop-types";
// import { motion, AnimatePresence } from "framer-motion";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   DocumentTextIcon,
//   TrashIcon,
//   UploadIcon,
// } from "../../../components/icons/Icons";
// import FileDetailModal from "../../../components/modals/FileDetailModal";
// import {
//   deleteDocument,
//   getDocuments,
//   uploadDocument,
// } from "../../../api/endpoints/documents";
// import { message } from "antd";
// import { IoEyeOutline } from "react-icons/io5";

// // 1. Mock Type Definitions
// const UserPlan = {
//   STARTER: "Starter",
//   PRO: "Pro",
//   ENTERPRISE: "Enterprise",
// };

// const UploadedFilePropType = PropTypes.shape({
//   id: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   size: PropTypes.string,
//   comments: PropTypes.arrayOf(PropTypes.object),
// });

// // 2. Mock Components
// const UpgradeNotice = ({ featureName, onUpgrade }) => (
//   <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-300 text-center">
//     <p className="font-semibold mb-2">Upgrade Required</p>
//     <p className="text-sm">
//       The **{featureName}** feature is unavailable on your current Starter plan.
//       Upgrade to unlock this and more features.
//     </p>
//     <button
//       onClick={onUpgrade}
//       className="mt-3 px-4 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
//     >
//       Go to Settings
//     </button>
//   </div>
// );
// UpgradeNotice.propTypes = {
//   featureName: PropTypes.string.isRequired,
//   onUpgrade: PropTypes.func.isRequired,
// };

// export const DocumentHub = ({
//   onUploadFile,
//   plan,
//   isDemoMode,
//   navigateToSettings,
//   grantId,
// }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const queryClient = useQueryClient();

//   const hasAccess = plan !== UserPlan.STARTER || isDemoMode;

//   //Get all files
//   const { data } = useQuery({
//     queryKey: ["documents", grantId],
//     queryFn: () => getDocuments(grantId),
//   });

//   console.log("Fetched documents:", data);

//   //Delete file function
//   const handleDeleteFile = useMutation({
//     mutationFn: async (documentId) => {
//       return deleteDocument(documentId);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["documents", grantId] });
//       message.success("Document deleted successfully");
//     },
//     onError: (error) => {
//       console.error("Error deleting document:", error);
//     },
//   });

//   // Upload document mutation
//   const uploadMutation = useMutation({
//     mutationFn: async (file) => {
//       const formData = new FormData();
//       formData.append("document", file);
//       formData.append("name", file.name);
//       formData.append("size", file.size.toString());

//       return uploadDocument(grantId, formData);
//     },
//     onSuccess: (data) => {
//       // Invalidate and refetch documents list
//       queryClient.invalidateQueries({ queryKey: ["documents", grantId] });

//       // Call the onUploadFile callback if provided
//       if (onUploadFile) {
//         onUploadFile(data);
//       }

//       message.success("Document uploaded successfully");
//     },
//     onError: (error) => {
//       console.error("Error uploading document:", error);
//       // You can add toast notification here
//     },
//   });

//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileSelect = (event) => {
//     const selectedFiles = event.target.files;
//     if (selectedFiles && selectedFiles.length > 0) {
//       // Handle multiple files by uploading each one
//       Array.from(selectedFiles).forEach((file) => {
//         uploadMutation.mutate(file);
//       });
//     }
//     // Reset the input value so the same file can be selected again if needed
//     event.target.value = "";
//   };

//   if (!hasAccess) {
//     return (
//       <UpgradeNotice
//         featureName="Shared Document Hub"
//         onUpgrade={navigateToSettings}
//       />
//     );
//   }

//   return (
//     <>
//       <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
//         {/* Header and Upload Button */}
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold text-night dark:text-dark-text font-heading">
//             Document Hub
//           </h3>
//           <div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
//               multiple
//               onChange={handleFileSelect}
//               className="hidden"
//             />
//             <motion.button
//               onClick={handleUploadClick}
//               disabled={uploadMutation.isPending}
//               className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
//                 uploadMutation.isPending
//                   ? "bg-gray-400 text-gray-600 cursor-not-allowed"
//                   : "bg-primary text-night hover:bg-secondary"
//               }`}
//               aria-label="Upload a new document for this application"
//               whileHover={uploadMutation.isPending ? {} : { scale: 1.05 }}
//               whileTap={uploadMutation.isPending ? {} : { scale: 0.95 }}
//             >
//               <UploadIcon className="w-4 h-4" />
//               {uploadMutation.isPending ? "Uploading..." : "Upload"}
//             </motion.button>
//           </div>
//         </div>

//         {/* File List */}
//         <div className="space-y-2">
//           {data?.map((file) => (
//             <div
//               key={file.id}
//               className="flex items-center gap-3 p-2 rounded-md hover:bg-mercury/30 dark:hover:bg-dark-background/50 group"
//             >
//               <DocumentTextIcon className="w-6 h-6 text-night/50 dark:text-dark-textMuted flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <button
//                   onClick={() => setSelectedFile(file)}
//                   className="text-sm font-medium text-night dark:text-dark-text truncate text-left hover:underline"
//                 >
//                   {file.name}
//                 </button>
//                 <p className="text-xs text-night/60 dark:text-dark-textMuted">
//                   {file.size} - {(file.comments || []).length} comments
//                 </p>
//               </div>
//               <button
               
//                 className="text-night/40 dark:text-dark-textMuted/60 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
//                 aria-label={`Delete file: ${file.name}`}
//               >
//                 <IoEyeOutline className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => handleDeleteFile.mutate(file._id)}
//                 className="text-night/40 dark:text-dark-textMuted/60 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
//                 aria-label={`Delete file: ${file.name}`}
//               >
//                 <TrashIcon className="w-5 h-5" />
//               </button>
//             </div>
//           ))}
//           {/* Empty State */}
//           {data?.length === 0 && (
//             <p className="text-sm text-center text-night/50 dark:text-dark-textMuted py-4">
//               No documents uploaded.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* File Detail Modal */}
//       <AnimatePresence>
//         {selectedFile && (
//           <FileDetailModal
//             file={selectedFile}
//             onClose={() => setSelectedFile(null)}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// DocumentHub.propTypes = {
//   files: PropTypes.arrayOf(UploadedFilePropType).isRequired,
//   onDeleteFile: PropTypes.func.isRequired,
//   onAddComment: PropTypes.func.isRequired,
//   onUploadFile: PropTypes.func,
//   plan: PropTypes.oneOf(Object.values(UserPlan)).isRequired,
//   isDemoMode: PropTypes.bool.isRequired,
//   navigateToSettings: PropTypes.func.isRequired,
//   grantId: PropTypes.string.isRequired,
// };

// export default DocumentHub;
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DocumentTextIcon,
  TrashIcon,
  UploadIcon,
} from "../../../components/icons/Icons";
import FileDetailModal from "../../../components/modals/FileDetailModal";
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "../../../api/endpoints/documents";
import { message } from "antd";
import { IoEyeOutline } from "react-icons/io5";

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
  onUploadFile,
  plan,
  isDemoMode,
  navigateToSettings,
  grantId,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const hasAccess = plan !== UserPlan.STARTER || isDemoMode;

  //Get all files
  const { data } = useQuery({
    queryKey: ["documents", grantId],
    queryFn: () => getDocuments(grantId),
  });

  console.log("Fetched documents:", data);

  //Delete file function
  const handleDeleteFile = useMutation({
    mutationFn: async (documentId) => {
      return deleteDocument(documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", grantId] });
      message.success("Document deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      message.error("Failed to delete document");
    },
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("name", file.name);
      formData.append("size", file.size.toString());

      return uploadDocument(grantId, formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents", grantId] });

      if (onUploadFile) {
        onUploadFile(data);
      }

      message.success("Document uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading document:", error);
      message.error("Failed to upload document");
    },
  });

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach((file) => {
        uploadMutation.mutate(file);
      });
    }
    event.target.value = "";
  };

  // ✅ NEW: Handle view document
  const handleViewDocument = (file) => {
    // Check if file has a URL to open
    if (file.url) {
      // Open in new tab
      window.open(file.url, '_blank', 'noopener,noreferrer');
    } else if (file.path) {
      // Alternative: use path if URL is not available
      window.open(file.path, '_blank', 'noopener,noreferrer');
    } else {
      // If no URL, show the file detail modal instead
      setSelectedFile(file);
      message.info("Opening document details");
    }
  };

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
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <motion.button
              onClick={handleUploadClick}
              disabled={uploadMutation.isPending}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                uploadMutation.isPending
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-primary text-night hover:bg-secondary"
              }`}
              aria-label="Upload a new document for this application"
              whileHover={uploadMutation.isPending ? {} : { scale: 1.05 }}
              whileTap={uploadMutation.isPending ? {} : { scale: 0.95 }}
            >
              <UploadIcon className="w-4 h-4" />
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </motion.button>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-2">
          {data?.map((file) => (
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
              
              {/* ✅ View Button - Updated with onClick handler */}
              <button
                onClick={() => handleViewDocument(file)}
                className="text-night/40 dark:text-dark-textMuted/60 hover:text-primary dark:hover:text-dark-primary opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`View file: ${file.name}`}
              >
                <IoEyeOutline className="w-5 h-5" />
              </button>
              
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteFile.mutate(file._id)}
                disabled={handleDeleteFile.isPending}
                className="text-night/40 dark:text-dark-textMuted/60 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Delete file: ${file.name}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {/* Empty State */}
          {data?.length === 0 && (
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
  onUploadFile: PropTypes.func,
  plan: PropTypes.oneOf(Object.values(UserPlan)).isRequired,
  isDemoMode: PropTypes.bool.isRequired,
  navigateToSettings: PropTypes.func.isRequired,
  grantId: PropTypes.string.isRequired,
};

export default DocumentHub;