import axiosInstance from "../axios/axiosInstance";

// Get available contexts (General, Projects, Grants)
export const getCopilotContexts = async () => {
  const response = await axiosInstance.get("/copilot/contexts");
  return response.data;
};

// Initialize or Fetch a Session
export const initCopilotSession = async ({
  contextType,
  contextId,
  contextTitle,
}) => {
  const response = await axiosInstance.post("/copilot/session", {
    contextType,
    contextId,
    contextTitle,
  });
  return response.data;
};

// Send a Message
export const sendCopilotMessage = async ({ chatId, message }) => {
  const response = await axiosInstance.post("/copilot/message", {
    chatId,
    message,
  });
  return response.data;
};
