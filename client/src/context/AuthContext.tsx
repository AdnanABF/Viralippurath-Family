import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  isTokenValid,
  getUserFromToken,
  saveUserToStorage,
  clearUserFromStorage,
} from "../utils/auth";
import { authService } from "../services/auth.service";
import api from "../services/api";
import type { AuthUser } from "../types/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: (userData: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state based on storage hint
  const hasHint = isTokenValid();
  const [loading, setLoading] = useState(hasHint);
  const [isAuthenticated, setIsAuthenticated] = useState(hasHint);
  const [user, setUser] = useState<AuthUser | null>(getUserFromToken());

  /**
   * Fetches the current user session from the server.
   */
  const refreshUser = useCallback(async () => {
    try {
      // api.ts returns unwrapped body { user: { userUuid, ... } }
      const response: any = await api.get("/auth/me");

      // Extract the user object (checking for nested or direct response)
      const userData: AuthUser = response.user || response;

      // Validation check using the standardized userUuid
      if (userData && userData.userUuid) {
        setIsAuthenticated(true);
        setUser(userData);
        saveUserToStorage(userData);
      } else {
        throw new Error("Invalid session data: userUuid missing");
      }
    } catch (error) {
      clearUserFromStorage();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial check on app mount
   */
  const initAuth = useCallback(async () => {
    if (isTokenValid()) {
      await refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  /**
   * Updated Login to expect the standardized AuthUser object
   */
  const login = (userData: AuthUser) => {
    if (userData && userData.userUuid) {
      saveUserToStorage(userData);
      setIsAuthenticated(true);
      setUser(userData);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
    } finally {
      clearUserFromStorage();
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout, refreshUser }}
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
