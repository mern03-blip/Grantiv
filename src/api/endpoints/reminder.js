import axiosInstance from "../axios/axiosInstance";

const organizationId = localStorage.getItem("orgId");
// const userId = localStorage.getItem("userId");

export const setReminders = async (grantId, days) => {
  const response = await axiosInstance.post(`/reminders`, {
    organizationId,
    // userId,
    grantId,
    days,
  });
  return response.data;
};


export const getReminders = async (grantId) => {
  const response = await axiosInstance.get(`/reminders/${grantId}`);
  return response.data;
};

//Clear Reminder
export const clearReminder = async (grantId) => {
  const response = await axiosInstance.delete(`/reminders/${grantId}`);
  return response.data;
};