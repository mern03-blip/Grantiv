import axiosInstance from "../axios/axiosInstance";


const orgId = localStorage.getItem("orgId");

// Update a specific notification setting for the organization
export const updateNotificationSetting = async (settingKey, isEnabled) => {
  const response = await axiosInstance.patch(
    `/organizations/${orgId}/notifications`,
    {
      settingKey,
      isEnabled,
    }
  );
  return response.data;
};