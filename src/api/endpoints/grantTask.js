import axiosInstance from "../axios/axiosInstance";


export const AddTask = async (projectId, taskData) => {
  const response = await axiosInstance.post(`/my-grants/${projectId}/tasks`, taskData);
  return response.data;
};


export const getTask = async (projectId) => {
  const response = await axiosInstance.get(`/my-grants/${projectId}/tasks`);
  return response.data;
};

export const toggleTask = async (taskId) => {
  const response = await axiosInstance.patch(`/my-grants/tasks/${taskId}`, {});
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axiosInstance.delete(`/my-grants/tasks/${taskId}`, {});
  return response.data;
};