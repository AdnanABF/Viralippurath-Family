import axios from "axios";
import toast from "react-hot-toast";
import { logout } from "../utils/logout";
import { getUserIdFromToken } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

/**
 * Request Interceptor: Attach the current Access Token to every outgoing request
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor: Handle Token Refreshing (401) and Global Errors (429, 500)
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Use optional chaining safely for status
    const status = error.response?.status;

    // 1. Handle 401 Unauthorized
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const userId = getUserIdFromToken(); // Decodes 'sub' from the current token

        if (!refreshToken || !userId) {
          logout(); // Redirects to login and clears storage
          return Promise.reject(error);
        }

        // Attempt to get a new token pair using userId and refreshToken
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { userId, refreshToken }
        );

        // Update local storage with new rotated tokens
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        // Optimization: Ensure the retry uses the fresh instance config
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    // 2. Global Error Toast Handling
    if (
      !originalRequest?._retry ||
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // Skip toast for 401s that are about to be retried
      if (status === 401 && !originalRequest._retry)
        return Promise.reject(error);

      if (status === 429 && originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      let message = "Something went wrong";

      if (status === 429) {
        message = "Too many requests. Please slow down.";
      } else if (status && status < 500) {
        const backendMessage = error?.response?.data?.message;

        if (backendMessage) {
          let finalMessage = Array.isArray(backendMessage)
            ? backendMessage[0]
            : backendMessage;

          if (finalMessage.includes("should not exist")) {
            finalMessage = "Invalid data submitted. Please check the form.";
          }

          message = finalMessage;
        }
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      } else if (error.code === "ECONNABORTED") {
        message = "Request timed out. Check your connection.";
      }

      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
