import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminGuard from "../components/admin/AdminGuard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EventsAdmin from "../pages/admin/EventsAdmin";
import GalleryAdmin from "../pages/admin/GalleryAdmin";
import MagazineAdmin from "../pages/admin/MagazineAdmin";
import NotificationsAdmin from "../pages/admin/NotificationsAdmin";
import AdminManagement from "../pages/admin/AdminManagement";
import ActivityLogAdmin from "../pages/admin/ActivityLogsAdmin";
import { useAuth } from "../context/AuthContext";
import SystemLogAdmin from "../pages/admin/SystemLogsAdmin";

const AdminRouter = () => {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="magazine" element={<MagazineAdmin />} />
          <Route path="notifications" element={<NotificationsAdmin />} />
          <Route path="activity-log" element={<ActivityLogAdmin />} />
          <Route path="system-log" element={<SystemLogAdmin />} />

          <Route
            path="manage-admins"
            element={
              isSuperAdmin ? (
                <AdminManagement />
              ) : (
                <Navigate to="/admin/dashboard" replace />
              )
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRouter;
