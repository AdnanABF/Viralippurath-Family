import { useEffect, useState } from "react";
import { Filter, RotateCw } from "lucide-react";
import type { ActivityLog } from "../../types/activity-log.admin";
import { activityAdminService } from "../../services/activity-log.admin.service";
import ActivityTable from "../../components/admin/activity-log/ActivityLogsTable";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const ActivityLogAdmin = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("ALL");

  const loadLogs = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await activityAdminService.getAll();
      setLogs(data);
    } catch {
      setError(true);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs =
    filter === "ALL" ? logs : logs.filter((log) => log.entityType === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900">
            System Activity Log
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Track all administrative actions across the platform.
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-48">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 outline-none transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All Entities</option>
              <option value="EVENT">Events</option>
              <option value="GALLERY">Gallery</option>
              <option value="NOTIFICATION">Notifications</option>
              <option value="MAGAZINE">Magazines</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={loadLogs}
            disabled={loading}
            className="p-2.5 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-all active:scale-95 disabled:opacity-50 border border-stone-200 shadow-sm"
            title="Refresh Logs"
          >
            <RotateCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          <p className="mt-4 text-stone-500 font-medium">
            Fetching system logs...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center shadow-sm">
          <p className="text-stone-800 font-serif text-lg mb-1">
            Something went wrong
          </p>
          <p className="text-stone-500 text-sm mb-4">
            We couldn't load the activity logs. Please try again later.
          </p>
          <button
            onClick={loadLogs}
            className="text-amber-700 font-medium hover:underline flex items-center gap-2 mx-auto"
          >
            <RotateCw size={14} /> Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredLogs.length === 0 && (
        <EmptyState
          title={
            filter === "ALL"
              ? "No activity yet"
              : `No ${filter.toLowerCase()} activity`
          }
          description="Actions performed by admins will appear here automatically."
        />
      )}

      {/* Data Table */}
      {!loading && !error && filteredLogs.length > 0 && (
        <ActivityTable logs={filteredLogs} />
      )}

      {/* Footer Info */}
      {!loading && !error && filteredLogs.length > 0 && (
        <p className="text-center text-stone-400 text-[11px] uppercase tracking-widest font-bold">
          {filteredLogs.length} Activities Logged
        </p>
      )}
    </div>
  );
};

export default ActivityLogAdmin;
