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
 * Response Interceptor: Handle Token Refreshing, Data Unwrapping, and Global Toasts
 */
api.interceptors.response.use(
  (response) => {
    // 1. Destructure the envelope: success, message, and the rest (payload)
    const { success, message, ...payload } = response.data;

    // 2. Automated Success Toasts
    // We only show toasts for mutations (POST, PATCH, DELETE)
    const isMutation = ["post", "patch", "delete"].includes(
      response.config.method || ""
    );
    const skipToast = response.config.headers?.["x-skip-toast"] === "true";

    if (success && isMutation && message && !skipToast) {
      toast.success(message);
    }

    // 3. Clean Return Logic
    // If the payload only has a 'data' key (e.g. for arrays or single primitives), return that value.
    const payloadKeys = Object.keys(payload);
    if (payloadKeys.length === 1 && payloadKeys[0] === "data") {
      return payload.data;
    }

    // Otherwise, return the whole payload (e.g. { data: [], meta: {} })
    // This ensures pagination 'meta' is preserved and returned.
    return payload;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const skipToast = originalRequest?.headers?.["x-skip-toast"] === "true";

    // 1. Handle 401 Unauthorized (Token Refresh Logic)
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const userUuid = getUserIdFromToken();

        if (!refreshToken || !userUuid) {
          logout();
          return Promise.reject(error);
        }

        // Standard Axios call (not 'api' instance) to avoid infinite loops
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { userUuid, refreshToken }
        );

        // Note: Access tokens now arrive in res.data.data.accessToken due to backend changes
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    // 2. Global Error Handling (Standardized)
    if (
      !originalRequest?._retry ||
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // We don't toast if it's a 401 being retried or if the request explicitly asks to skip toasts
      if ((status === 401 && !originalRequest._retry) || skipToast) {
        return Promise.reject(error);
      }

      let errorMessage = "An unexpected error occurred";

      if (status === 429) {
        errorMessage = "Too many requests. Please try again in a minute.";
      } else if (error.response?.data?.message) {
        // Capture the standard message from our GlobalExceptionFilter
        const backendMessage = error.response.data.message;
        errorMessage = Array.isArray(backendMessage)
          ? backendMessage[0]
          : backendMessage;

        // Final safety check for technical strings if the backend missed them
        if (errorMessage.includes("should not exist")) {
          errorMessage = "Invalid data submitted. Please check the form.";
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Connection timed out. Please check your internet.";
      } else if (status >= 500) {
        errorMessage = "Server is currently unavailable. Please try later.";
      }

      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
