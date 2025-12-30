import { NavLink } from "react-router-dom";
import { adminNav } from "./admin.nav";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-stone-200 p-6">
      <h2 className="text-xl font-serif font-bold text-stone-800 mb-10">
        Admin Panel
      </h2>

      <nav className="space-y-2">
        {adminNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-amber-700 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
