import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminGuard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for auth to finish loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  // 2. Check if authenticated
  // We pass the current location in 'state' so we can redirect back after login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Allow both ADMIN and SUPER_ADMIN to enter the Admin Panel
  const allowedRoles = ["ADMIN", "SUPER_ADMIN"];

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
