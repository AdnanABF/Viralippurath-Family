import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  BookOpen,
  Bell,
  Image as ImageIcon,
  Clock,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../utils/date";
import { activityAdminService } from "../../../services/activity-log.admin.service";

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();
  // 1. Fetch activities from the service
  const { data: activities, isLoading } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: () => activityAdminService.getRecent(5), // We fetch the last 5 for the dashboard
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "EVENT":
        return <Calendar size={16} className="text-blue-600" />;
      case "MAGAZINE":
        return <BookOpen size={16} className="text-stone-600" />;
      case "NOTIFICATION":
        return <Bell size={16} className="text-amber-600" />;
      case "GALLERY":
        return <ImageIcon size={16} className="text-purple-600" />;
      default:
        return <User size={16} className="text-stone-600" />;
    }
  };

  const getAction = (action: string) => {
    switch (action) {
      case "create":
        return "created";
      case "update":
        return "updated";
      default:
        return "deleted";
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-stone-100 flex justify-between items-center">
        <h3 className="text-lg font-serif text-stone-800">Recent Activity</h3>
        <button
          onClick={() => navigate("/admin/activity-log")}
          className="text-xs font-bold text-amber-700 uppercase tracking-widest hover:text-amber-800"
        >
          View All
        </button>
      </div>

      <div className="divide-y divide-stone-50">
        {/* 2. Loading State */}
        {isLoading && (
          <div className="p-8 text-center text-stone-400 text-sm animate-pulse">
            Loading activities...
          </div>
        )}

        {/* 3. Data List */}
        {!isLoading &&
          activities?.map((activity) => {
            return (
              <div
                key={activity.uuid}
                className="p-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                    {getIcon(activity.entityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-900 font-medium truncate">
                      <span className="font-bold">
                        {activity.adminUserName.split("@")[0]}
                      </span>{" "}
                      {getAction(activity.action.toLowerCase())}{" "}
                      <span className="font-semibold">
                        {activity.entityType}
                        {" - "}
                      </span>
                      <span className="italic">"{activity.entityTitle}"</span>
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
            );
          })}
      </div>

      {/* 4. Empty State */}
      {!isLoading && (!activities || activities.length === 0) && (
        <div className="p-10 text-center text-stone-400 text-sm">
          No recent activity to show.
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
