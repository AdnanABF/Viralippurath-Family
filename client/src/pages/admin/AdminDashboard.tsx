import { useQuery } from "@tanstack/react-query";
import { Calendar, Image as ImageIcon, BookOpen, Bell } from "lucide-react";
import StatsCard from "../../components/admin/dashboard/StatsCard";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import RecentActivity from "../../components/admin/dashboard/RecentActivity";
import { dashboardAdminService } from "../../services/dashboard.service";
import { useAuth } from "../../context/AuthContext";
import { AdminError } from "../../components/ui";

const AdminDashboard = () => {
  const { user } = useAuth();

  // 1. Fetch data using React Query
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardAdminService.getDashboardStats,
  });

  // 2. Handle Error State
  if (isError) {
    return (
      <AdminError
        title="Unable to load overview"
        message="There was a connection error. Please refresh the page to try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">
            Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-stone-500 mt-1">
            Here is what's happening with Viralippurath today.
          </p>
        </div>
        <div className="text-sm text-stone-400 font-medium bg-stone-100 px-3 py-1 rounded-full w-fit">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          label="Upcoming Events"
          value={isLoading ? "..." : stats?.upcomingEvents.toString() || "0"}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          label="Magazine Issues"
          value={isLoading ? "..." : stats?.totalMagazines.toString() || "0"}
          icon={BookOpen}
          color="stone"
        />
        <StatsCard
          label="Gallery Photos"
          value={isLoading ? "..." : stats?.galleryPhotos.toString() || "0"}
          icon={ImageIcon}
          color="purple"
        />
        <StatsCard
          label="Active Alerts"
          value={isLoading ? "..." : stats?.activeAlerts.toString() || "0"}
          icon={Bell}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <RecentActivity />
        </div>
        <div className="lg:sticky lg:top-24 order-1 lg:order-2">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
