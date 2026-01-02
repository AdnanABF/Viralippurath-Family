import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GuestGuard = () => {
  const { isAuthenticated } = useAuth();

  // If the user already has a valid token, don't let them see the login page
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If no token, allow them to proceed to the login page
  return <Outlet />;
};

export default GuestGuard;
