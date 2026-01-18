import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { isTokenValid } from "../utils/auth";
import { authService } from "../services/auth.service";
import type { AuthUser } from "../types/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = () => {
    setLoading(true);
    const isValid = isTokenValid();
    setIsAuthenticated(isValid);

    if (isValid) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded = jwtDecode<{
            sub: string;
            username: string;
            role: string;
            fullName: string;
          }>(token);

          setUser({
            uuid: decoded.sub,
            username: decoded.username,
            role: decoded.role,
            fullName: decoded.fullName || "Admin User",
          });
        } catch {
          logout();
        }
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = () => initAuth();

  /**
   * Enhanced Logout:
   * 1. Calls the backend to invalidate the session.
   * 2. Clears local storage.
   * 3. Resets local state.
   * 4. Redirects to login with a full refresh for security.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
