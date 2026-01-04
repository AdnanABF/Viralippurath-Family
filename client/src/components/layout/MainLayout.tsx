import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="grow flex flex-col">
      <Outlet />
    </main>
  </div>
);
export default MainLayout;
