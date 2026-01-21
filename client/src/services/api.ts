import axios from "axios";
import toast from "react-hot-toast";
import { logout } from "../utils/logout";
import { getUserIdFromToken } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  // CRITICAL: Allows browser to send and receive cookies for cross-origin requests
  withCredentials: true,
});

/**
 * Request Interceptor
 * We no longer manually attach the Bearer token because it's now in an HttpOnly cookie.
 */
api.interceptors.request.use((config) => {
  return config;
});

/**
 * Response Interceptor
 */
api.interceptors.response.use(
  (response) => {
    // correlationId is now part of the envelope
    const { success, message, correlationId, ...payload } = response.data;

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
    const backendMessage = error.response?.data?.message;

    // 1. Handle 401 Unauthorized (Token Refresh Logic OR Forced Logout)
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // Check if the 401 is specifically due to deactivation
      const isDeactivated =
        typeof backendMessage === "string" &&
        backendMessage.toLowerCase().includes("deactivated");

      if (isDeactivated) {
        toast.error(backendMessage, { duration: 5000 });
        logout(); // Force immediate logout for deactivated accounts
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const userUuid = getUserIdFromToken();

        if (!userUuid) {
          logout();
          return Promise.reject(error);
        }

        /**
         * We call the refresh endpoint.
         * The backend validateUserActive check also runs here.
         * If the user is disabled, this call will fail and throw to the catch block.
         */
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { userUuid },
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError: any) {
        // If the refresh call returns 401 due to deactivation, show that message
        const refreshMsg = refreshError.response?.data?.message;
        if (refreshMsg?.toLowerCase().includes("deactivated")) {
          toast.error(refreshMsg);
        }

        logout();
        return Promise.reject(refreshError);
      }
    }

    // 2. Global Error Handling with Correlation ID support
    if (
      !originalRequest?._retry ||
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if ((status === 401 && !originalRequest._retry) || skipToast) {
        return Promise.reject(error);
      }

      let errorMessage = "An unexpected error occurred";
      const correlationId = error.response?.data?.correlationId;

      if (status === 429) {
        errorMessage = "Too many requests. Please try again in a minute.";
      } else if (backendMessage) {
        errorMessage = Array.isArray(backendMessage)
          ? backendMessage[0]
          : backendMessage;

        if (errorMessage.includes("should not exist")) {
          errorMessage = "Invalid data submitted. Please check the form.";
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Connection timed out. Please check your internet.";
      } else if (status >= 500) {
        errorMessage = "Server is currently unavailable. Please try later.";
      }

      let finalToastMessage = errorMessage;

      if (correlationId && status >= 500) {
        finalToastMessage = `${errorMessage}\nRequest ID: ${correlationId}`;
      }

      toast.error(finalToastMessage, {
        duration: status >= 500 ? 6000 : 4000,
        style:
          status >= 500 ? { border: "1px solid #ff4b4b", padding: "16px" } : {},
      });
    }

    return Promise.reject(error);
  }
);

export default api;
