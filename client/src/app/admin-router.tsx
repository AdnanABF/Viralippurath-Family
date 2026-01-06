import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminGuard from "../components/admin/AdminGuard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EventsAdmin from "../pages/admin/EventsAdmin";
import GalleryAdmin from "../pages/admin/GalleryAdmin";
import MagazineAdmin from "../pages/admin/MagazineAdmin";
import NotificationsAdmin from "../pages/admin/NotificationsAdmin";
import AdminManagement from "../pages/admin/AdminManagement";
import { useAuth } from "../context/AuthContext";

const AdminRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout border-stone-200 />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="magazine" element={<MagazineAdmin />} />
          <Route path="notifications" element={<NotificationsAdmin />} />

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
