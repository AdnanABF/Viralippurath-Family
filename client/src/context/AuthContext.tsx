import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { isTokenValid } from "../utils/auth";
import { clearAuthData } from "../utils/logout";
import type { AuthUser } from "../types/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
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

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
    window.location.href = "/login";
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
