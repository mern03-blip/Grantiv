import axiosInstance from "../axios/axiosInstance";

// Get Chat History (REST API)
export const getChatHistory = async (projectId) => {
  const response = await axiosInstance.get(`/my-grants/${projectId}/chat`);
  return response.data;
};
