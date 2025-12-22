import axios from "axios";

const axiosInstance = axios.create({

  baseURL: `${import.meta.env.VITE_API_URL}/api`
  // baseURL: "https://vm5ctv6w-5000.asse.devtunnels.ms/api"

 
});

// Request interceptor to add token and organization ID to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const orgId = localStorage.getItem('orgId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (orgId) {
      config.headers['X-Organization-ID'] = orgId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;