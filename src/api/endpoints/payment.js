import axiosInstance from "../axios/axiosInstance";


// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getSubscriptionStatus = async () => {
  const organizationId = localStorage.getItem('orgId');
  const response = await axiosInstance.post("/subscription", { organizationId }, getAuthHeaders());
  return response.data;
};

export const createCheckoutSession = async (plan) => {
  // Plan should be 'starter' or 'pro'
  const organizationId = localStorage.getItem('orgId');
  const response = await axiosInstance.post(`/subscription/create-checkout`, { plan, organizationId }, getAuthHeaders());
  return response.data; // Returns { url: "https://checkout.stripe.com/..." }
};

export const cancelSubscription = async () => {
  const organizationId = localStorage.getItem('orgId');
  const response = await axiosInstance.post(`/subscription/cancel`, { organizationId }, getAuthHeaders());
  return response.data;
};