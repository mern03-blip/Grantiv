import axiosInstance from "../axios/axiosInstance";

//Create Personal Tasks
export const createtasks = async (name, dueDate) => {
  const response = await axiosInstance.post("/tasks", {
    name,
    dueDate,
  });
  return response;
};

//get Personal Tasks
export const gettasks = async () => {
  const response = await axiosInstance.get("/tasks");
  return response;
};

//mark Complete Tasks
export const completetasks = async (taskId) => {
  const response = await axiosInstance.patch(`/tasks/${taskId}/toggle`);
  return response;
};

//delete Personal Tasks
export const deletetasks = async (taskId) => {
  const response = await axiosInstance.delete(`/tasks/${taskId}`);
  return response;
};
