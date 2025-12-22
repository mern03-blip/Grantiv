import axiosInstance from "../axios/axiosInstance";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload file to Firebase Storage and get download URL
const uploadToFirebase = async (file, projectId) => {
  try {
    // Create a reference to Firebase Storage with a unique filename
    const timestamp = Date.now();
    const fileName = `documents/${projectId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Upload file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading to Firebase:", error);
    throw new Error("Failed to upload file to storage");
  }
};

export const uploadDocument = async (projectId, documentData) => {
  try {
    // Check if documentData is FormData (from DocumentHub)
    if (documentData instanceof FormData) {
      const file = documentData.get("document");

      if (file && file instanceof File) {
        // Upload file to Firebase and get URL
        const docUrl = await uploadToFirebase(file, projectId);

        // Prepare data to send to API endpoint
        const apiData = {
          docUrl: docUrl,
          name: file.name,
          type: file.type,
          size: file.size,
        };

        // Send document metadata with Firebase URL to your API
        const response = await axiosInstance.post(
          `/my-grants/${projectId}/documents`,
          apiData
        );
        return response.data;
      }
    }
    // Check if documentData contains a file object
    else if (documentData.file && documentData.file instanceof File) {
      // Upload file to Firebase and get URL
      const docUrl = await uploadToFirebase(documentData.file, projectId);

      // Prepare data to send to API endpoint
      const apiData = {
        docUrl: docUrl,
        name: documentData.file.name,
        type: documentData.file.type,
        size: documentData.file.size,
        ...documentData, // Spread any additional properties
      };

      // Remove the file object before sending to API
      delete apiData.file;

      // Send document metadata with Firebase URL to your API
      const response = await axiosInstance.post(
        `/my-grants/${projectId}/documents`,
        apiData
      );
      return response.data;
    } else {
      // If no file, just send the data as is (for cases where URL already exists)
      const response = await axiosInstance.post(
        `/my-grants/${projectId}/documents`,
        documentData
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

//Get all documents for a grant
export const getDocuments = async (projectId) => {
  const response = await axiosInstance.get(`/my-grants/${projectId}/documents`);
  return response.data;
};

//Delete a document
export const deleteDocument = async (documentId) => {
  const response = await axiosInstance.delete(`/my-grants/documents/${documentId}`);
  return response.data;
}


//Add a comment to a document
export const addDocumentComment = async (documentId, commentData) => {
  const response = await axiosInstance.post(`/my-grants/documents/${documentId}/comments`, commentData);
  return response.data;
};

//Get All comments for a document
export const getDocumentComments = async (documentId) => {
  const response = await axiosInstance.get(`/my-grants/documents/${documentId}/comments`);
  return response.data;
};