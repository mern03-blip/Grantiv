import axiosInstance from "../axios/axiosInstance";

const organizationName = localStorage.getItem("orgName");


export const getAitext = async ({ myGrants, tasks }) => {
  const response = await axiosInstance.post("/aiGen/insights", {
    organizationName,
    myGrants,
    tasks,
  });
  return response.data;
};


//Quick fix for duplicate function name
const organizationId = localStorage.getItem("orgId");

export const quickAireview = async (grantId) => {
  const response = await axiosInstance.post("/aiGen/quick-review", {
    organizationId: organizationId,
    grantId: grantId,
  });
  return response.data.data;
};
