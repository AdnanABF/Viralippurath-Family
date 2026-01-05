import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminGuard = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // 1. Wait for auth to finish loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  // 2. Check if authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Allow both ADMIN and SUPER_ADMIN to enter the Admin Panel
  const allowedRoles = ["ADMIN", "SUPER_ADMIN"];

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
