// import axios from "axios";

// const axiosInstance = axios.create({

//   baseURL: `${import.meta.env.VITE_API_URL}/api`

// });

// // Request interceptor to add token and organization ID to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     const orgId = localStorage.getItem('orgId');

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     if (orgId) {
//       config.headers['X-Organization-ID'] = orgId;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const orgId = localStorage.getItem("orgId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (orgId) {
      config.headers["X-Organization-ID"] = orgId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 🔴 Token expired / Unauthorized
    if (status === 401) {
      localStorage.clear();

      // redirect to auth
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
