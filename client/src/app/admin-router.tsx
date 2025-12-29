import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminGuard from "../components/admin/AdminGuard";
import AdminDashboard from "../pages/admin/Dashboard";
import EventsAdmin from "../pages/admin/EventsAdmin";
import GalleryAdmin from "../pages/admin/GalleryAdmin";
import MagazineAdmin from "../pages/admin/MagazineAdmin";
import NotificationsAdmin from "../pages/admin/NotificationsAdmin";

const AdminRouter = () => {
  return (
    <Routes>
      <Route
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="events" element={<EventsAdmin />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="magazine" element={<MagazineAdmin />} />
        <Route path="notifications" element={<NotificationsAdmin />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
