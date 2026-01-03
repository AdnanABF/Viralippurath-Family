import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  username: string; // Updated to match your NestJS payload
  role: string;
  exp: number;
};

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now + 10; // Add a 10-second buffer to prevent race conditions
  } catch {
    return false;
  }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

/**
 * Specifically extracts the userId (sub) for the refresh call
 */
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch {
    return null;
  }
};
