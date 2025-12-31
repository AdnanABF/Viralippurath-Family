import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid, getUserFromToken } from "../../utils/auth";

const AdminGuard = () => {
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "SUPER_ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
