import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminNav } from "./admin.nav";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const { user, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredNav = adminNav.filter((item) => {
    if (loading) return false;
    if (!item.roles || item.roles.length === 0) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <aside
      className={`bg-white border-r border-stone-200 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header & Toggle Button */}
      <div className="p-6 flex items-center justify-between overflow-hidden min-h-21">
        {!isCollapsed && (
          <h2 className="text-xl font-serif font-bold text-stone-800 whitespace-nowrap animate-in fade-in duration-500">
            Admin Panel
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 hover:text-amber-700 hover:border-amber-200 transition-all ${
            isCollapsed ? "mx-auto" : ""
          }`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1 px-4">
        {loading ? (
          <div className="space-y-4 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 bg-stone-50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          filteredNav.map((item) => {
            const Icon = item.icon; // Extract the component
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-amber-700 text-white shadow-md shadow-amber-700/20"
                      : "text-stone-600 hover:bg-stone-50 hover:text-amber-800"
                  } ${isCollapsed ? "justify-center" : ""}`
                }
              >
                <Icon
                  size={20}
                  className={`shrink-0 ${
                    isCollapsed
                      ? ""
                      : "group-hover:scale-110 transition-transform"
                  }`}
                />
                {!isCollapsed && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })
        )}
      </nav>

      {/* Version Footer */}
      <div
        className={`p-6 border-t border-stone-100 ${
          isCollapsed ? "flex justify-center" : ""
        }`}
      >
        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold whitespace-nowrap">
          {isCollapsed ? "V1" : "Viralippurath Portal v1.0"}
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
