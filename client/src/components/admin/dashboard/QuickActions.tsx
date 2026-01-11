import React from "react";
import {
  PlusCircle,
  Bell,
  Image as ImageIcon,
  BookOpen,
  UserPlus,
  Terminal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const actions = [
    {
      label: "New Event",
      icon: PlusCircle,
      path: "/admin/events",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Post Alert",
      icon: Bell,
      path: "/admin/notifications",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Add Photo",
      icon: ImageIcon,
      path: "/admin/gallery",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "New Magazine",
      icon: BookOpen,
      path: "/admin/magazine",
      color: "text-stone-600",
      bg: "bg-stone-50",
    },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-serif text-stone-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all group"
          >
            <div
              className={`p-3 rounded-full ${action.bg} ${action.color} mb-2 group-hover:scale-110 transition-transform`}
            >
              <action.icon size={20} />
            </div>
            <span className="text-xs font-bold text-stone-600 uppercase tracking-tight text-center">
              {action.label}
            </span>
          </button>
        ))}

        <div className="col-span-2 flex flex-col gap-2 mt-2">
          {/* System Logs Action */}
          <button
            onClick={() => navigate("/admin/system-log")}
            className="flex items-center justify-center gap-3 p-3 rounded-xl border border-stone-200 text-stone-700 
               hover:bg-stone-50 transition font-bold text-sm shadow-sm active:scale-[0.98]"
          >
            <Terminal size={18} className="text-stone-500" />
            <span>System Error Logs</span>
          </button>

          {/* Admin Management Action */}
          {isSuperAdmin && (
            <button
              onClick={() => navigate("/admin/management")}
              className="col-span-2 flex items-center justify-center gap-3 p-4 mt-2 rounded-xl bg-amber-700 text-white
           hover:bg-amber-800 transition font-bold shadow-lg shadow-amber-900/20 active:scale-[0.98] disabled:bg-stone-400
            focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            >
              <UserPlus size={18} />
              <span className="text-sm font-bold">Manage Admin Team</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
