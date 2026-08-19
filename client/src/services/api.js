import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

  (response) => {
    return response;
  },

  (error) => {

    if (error.response?.status === 401) {

      const url = error.config?.url || "";

      // Don't immediately remove token during login
      if (!url.includes("/auth/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  }
);

export default api;