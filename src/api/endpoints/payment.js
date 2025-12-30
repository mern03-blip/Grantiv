import axiosInstance from "../axios/axiosInstance";


export const getSubscriptionStatus = async () => {
  const response = await axiosInstance.get("/subscription");
  return response.data;
};

export const createCheckoutSession = async (plan) => {
  // Plan should be 'starter' or 'pro'
  const organizationId = localStorage.getItem('orgId');
  const response = await axiosInstance.post(`/subscription/create-checkout`, { plan, organizationId });
  return response.data; // Returns { url: "https://checkout.stripe.com/..." }
};

export const cancelSubscription = async () => {
  const organizationId = localStorage.getItem('orgId');
  const response = await axiosInstance.post(`/subscription/cancel`, { organizationId });
  return response.data;
};