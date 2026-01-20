import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Home from "../pages/public/Home";
import Vision from "../pages/public/Vision";
import Gallery from "../pages/public/Gallery";
import Events from "../pages/public/Events";
import Magazine from "../pages/public/Magazine";
import Notifications from "../pages/public/Notifications";
import About from "../pages/public/About";
import Login from "../pages/public/Login";
import AdminRouter from "./admin-router";
import GuestGuard from "../components/admin/GuestGuard";
import Unauthorized from "../pages/common/Unauthorized";
import NotFound from "../pages/common/NotFound";
import MainLayout from "../components/layout/MainLayout";

const AppRouter = () => {
  return (
    <Routes>
      {/* GROUP 1: Public Pages (Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/events" element={<Events />} />
        <Route path="/magazine" element={<Magazine />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/about" element={<About />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* GROUP 2: Admin Pages (Navbar + Admin Panel, NO Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/admin/*" element={<AdminRouter />} />
      </Route>

      {/* GROUP 3: Guest-Only / Auth (Usually no Navbar/Footer) */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
