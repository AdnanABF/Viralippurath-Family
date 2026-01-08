import api from "./api";
import type { LoginCredentials, LoginResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // The cast 'as any' is a temporary bridge because our api.ts
    // returns a generic AxiosResponse, but the interceptor
    // has already turned it into LoginResponse.
    return (await api.post<LoginResponse>("/auth/login", credentials)) as any;
  },

  // You might also want a logout or refresh method here later
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
