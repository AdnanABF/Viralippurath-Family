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
      className={`
        /* Base styles for Mobile: Bottom Bar */
        fixed bottom-0 left-0 w-full h-16 bg-white border-t border-stone-200 flex flex-row items-center justify-around z-50
        
        /* Styles for Desktop: Sidebar */
         lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:flex-col lg:border-t-0 lg:border-r lg:transition-all lg:duration-300 lg:ease-in-out
         ${isCollapsed ? "lg:w-20" : "lg:w-64"}
      `}
    >
      {/* Header & Toggle Button - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-full p-6 items-center justify-between overflow-hidden min-h-21">
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

      {/* Navigation Links - Horizontal on Mobile, Vertical on Desktop */}
      <nav
        className={`
        flex flex-row items-center justify-around w-full px-2
        lg:flex-col lg:space-y-2 lg:flex-1 lg:px-4 lg:justify-start
      `}
      >
        {loading ? (
          <div className="flex gap-4 lg:flex-col lg:w-full lg:px-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-10 lg:w-full bg-stone-50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.label}
                className={({ isActive }) =>
                  `flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group 
                  ${
                    isActive
                      ? "text-amber-700 lg:bg-amber-700 lg:text-white lg:shadow-md lg:shadow-amber-700/20"
                      : "text-stone-500 lg:text-stone-600 hover:bg-stone-50 lg:hover:text-amber-800"
                  } 
                  ${isCollapsed ? "lg:justify-center" : ""} 
                  flex-1 lg:flex-none lg:w-full`
                }
              >
                <Icon
                  size={24} /* Slightly larger for thumb-tapping on mobile */
                  className={`shrink-0 lg:w-5 lg:h-5 ${
                    isCollapsed
                      ? ""
                      : "group-hover:scale-110 transition-transform"
                  }`}
                />

                {/* Labels: Hidden on mobile, shown on desktop (unless collapsed) */}
                <span
                  className={`
                  text-[10px] lg:text-sm whitespace-nowrap transition-opacity duration-300
                  ${isCollapsed ? "lg:hidden" : "hidden lg:block"}
                `}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })
        )}
      </nav>

      {/* Version Footer - Hidden on Mobile */}
      <div
        className={`hidden lg:block p-6 border-t border-stone-100 ${
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
