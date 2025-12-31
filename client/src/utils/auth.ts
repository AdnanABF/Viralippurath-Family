import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
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
