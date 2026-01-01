import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Vision from "../pages/public/Vision";
import Gallery from "../pages/public/Gallery";
import Events from "../pages/public/Events";
import Magazine from "../pages/public/Magazine";
import Notifications from "../pages/public/Notifications";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Login from "../pages/public/Login";
import AdminRouter from "./admin-router";
import GuestGuard from "../components/admin/GuestGuard";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vision" element={<Vision />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/events" element={<Events />} />
      <Route path="/magazine" element={<Magazine />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* 2. Guest-Only Routes (Redirects to Admin if logged in) */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/*" element={<AdminRouter />} />

      {/* fallback */}
      <Route path="*" element={<div className="p-10">Page not found</div>} />
    </Routes>
  );
};

export default AppRouter;
