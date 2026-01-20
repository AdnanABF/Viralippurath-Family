import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GuestGuard = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for auth to finish loading to prevent false redirects
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  // 2. If the user is already authenticated, don't let them see the login page.
  // Redirect them to where they were trying to go, or the dashboard.
  if (isAuthenticated) {
    const redirectUrl = location.state?.from?.pathname || "/admin/dashboard";
    return <Navigate to={redirectUrl} replace />;
  }

  // 3. If no user, allow them to proceed to the login page (Outlet)
  return <Outlet />;
};

export default GuestGuard;
