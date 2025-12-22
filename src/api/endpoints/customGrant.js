import axiosInstance from "../axios/axiosInstance";

export const extractMyGrants = async (grantText) => {
  const response = await axiosInstance.post("/my-grants/extract", {
    text: grantText,
  });
  return response.data;
};

export const createMyGrants = async (extractedGrantData) => {
  const response = await axiosInstance.post("/my-grants", extractedGrantData);
  return response.data;
};

export const getMyGrants = async () => {
  const response = await axiosInstance.get("/my-grants");
  return response.data;
};

export const updateGrantStatus = async (grantId, status) => {
  const response = await axiosInstance.patch(`my-grants/${grantId}/status`, {
    status: status.toLowerCase(), 
  });
  return response.data;
};



//Add Fav Custom grant
const ownerId = localStorage.getItem("userId");

export const addFavMyGrants = async (grantId) => {
  const response = await axiosInstance.patch(`/my-grants/${grantId}/favorite`, {
    ownerId,
    grantId
  });
  return response.data;
};

