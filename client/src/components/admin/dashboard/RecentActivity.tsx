import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  BookOpen,
  Bell,
  Image as ImageIcon,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../utils/date";
import { activityAdminService } from "../../../services/activity-log.admin.service";

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  // 1. Fetch activities using the simplified service
  const { data: activities, isLoading } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: () => activityAdminService.getRecent(5),
  });

  const getIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "EVENT":
        return <Calendar size={16} className="text-blue-600" />;
      case "MAGAZINE":
        return <BookOpen size={16} className="text-stone-600" />;
      case "NOTIFICATION":
        return <Bell size={16} className="text-amber-600" />;
      case "GALLERY":
        return <ImageIcon size={16} className="text-purple-600" />;
      case "ADMIN":
        return <ShieldCheck size={16} className="text-emerald-600" />;
      default:
        return <User size={16} className="text-stone-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "text-emerald-700";
      case "update":
        return "text-amber-700";
      case "delete":
        return "text-red-700";
      default:
        return "text-stone-700";
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-stone-100 flex justify-between items-center">
        <h3 className="text-lg font-serif text-stone-800">Recent Activity</h3>
        <button
          onClick={() => navigate("/admin/activity-log")}
          className="text-xs font-bold text-amber-700 uppercase tracking-widest hover:text-amber-800 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="divide-y divide-stone-50">
        {/* 2. Loading State */}
        {isLoading && (
          <div className="p-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-8 h-8 bg-stone-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                  <div className="h-3 bg-stone-50 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Data List */}
        {!isLoading &&
          activities?.map((activity) => (
            <div
              key={activity.uuid}
              className="p-4 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                  {getIcon(activity.entityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <span className="font-bold text-stone-900">
                      {activity.adminUserName.split("@")[0]}
                    </span>{" "}
                    <span
                      className={`font-medium ${getActionColor(
                        activity.action
                      )}`}
                    >
                      {activity.action.toLowerCase()}d
                    </span>{" "}
                    {activity.entityType.toLowerCase()}{" "}
                    <span className="text-stone-900 font-semibold italic truncate inline-block max-w-37.5 align-bottom">
                      "{activity.entityTitle}"
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-stone-400" />
                    <span className="text-xs text-stone-500">
                      {formatDateTime(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* 4. Empty State */}
      {!isLoading && (!activities || activities.length === 0) && (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-50 text-stone-300 mb-3">
            <Clock size={24} />
          </div>
          <p className="text-stone-400 text-sm">No recent activity to show.</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
