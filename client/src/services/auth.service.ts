import api from "./api";
import type { LoginCredentials, LoginResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // The cast 'as any' is a temporary bridge because our api.ts
    // returns a generic AxiosResponse, but the interceptor
    // has already turned it into LoginResponse.
    return (await api.post<LoginResponse>("/auth/login", credentials)) as any;
  },

  /**
   * Synchronized logout: Notifies the backend to invalidate the session
   * and then clears local storage.
   */
  logout: async (): Promise<void> => {
    try {
      // Notify backend to clear refreshTokenHash
      // We use the 'api' instance so the interceptor attaches the Access Token
      await api.post("/auth/logout");
    } catch (error) {
      // If the server is down, we still want the user to be logged out locally.
    } finally {
      // Always clear local storage regardless of API success
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
};
