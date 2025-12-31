import axios from "axios";
import toast from "react-hot-toast";
import { logout } from "../utils/logout";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach access token to every request
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Global response + error handling
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status =
      error.response?.status ||
      error.status ||
      (error.request && error.request.status);

    // ---------- 401: try refresh token ----------
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      (originalRequest as any)._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch {
        logout();
        return Promise.reject(error);
      }
    }

    if (!originalRequest?.url?.includes("/auth/refresh")) {
      let message = "Something went wrong";

      const status = error.response?.status;

      if (status && status < 500) {
        const backendMessage =
          error?.response?.data?.message ?? error?.response?.data?.error;

        if (backendMessage) {
          message = Array.isArray(backendMessage)
            ? backendMessage.join(", ")
            : backendMessage;
        }
      }

      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
