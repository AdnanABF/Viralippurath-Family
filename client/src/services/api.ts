import axios from "axios";
import toast from "react-hot-toast";
import { logout } from "../utils/logout";
import { getUserIdFromToken } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
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
    const status = error.response?.status || error.status;

    // 1. Handle 401 Unauthorized (Expired Access Token)
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

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout(); // Refresh failed (likely expired refresh token)
        return Promise.reject(refreshError);
      }
    }

    // 2. Global Error Toast Handling
    // Skip toast if the error is from a refresh attempt (handled by the try/catch above)
    if (!originalRequest?.url?.includes("/auth/refresh")) {
      // Skip global toast for 429 errors on the login page
      // (The Login.tsx component handles this specifically in its own state)
      if (status === 429 && originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      let message = "Something went wrong";

      if (status === 429) {
        message = "Too many requests. Please slow down.";
      } else if (status && status < 500) {
        // Extract backend error message if available
        const backendMessage =
          error?.response?.data?.message ?? error?.response?.data?.error;

        if (backendMessage) {
          message = Array.isArray(backendMessage)
            ? backendMessage.join(", ")
            : backendMessage;
        }
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      }

      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
