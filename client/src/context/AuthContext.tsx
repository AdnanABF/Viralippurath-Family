import { createContext, useContext, useEffect, useState } from "react";
import { isTokenValid } from "../utils/auth";
import { logout as logoutUtil } from "../utils/logout";

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutUtil();
    setIsAuthenticated(false);
  };

  // Sync auth state on refresh / token change
  useEffect(() => {
    setIsAuthenticated(isTokenValid());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
