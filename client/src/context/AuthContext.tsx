import { createContext, useContext, useState } from "react";

type Role = "SUPER_ADMIN" | "ADMIN" | "PUBLIC";

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("PUBLIC");

  const login = (newRole: Role) => {
    setIsAuthenticated(true);
    setRole(newRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole("PUBLIC");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
