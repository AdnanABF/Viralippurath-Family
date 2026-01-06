import { useEffect, useState, useCallback } from "react";
import {
  Filter,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import type { ActivityLog } from "../../types/activity-log.admin";
import { activityAdminService } from "../../services/activity-log.admin.service";
import ActivityTable from "../../components/admin/activity-log/ActivityLogsTable";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const ActivityLogAdmin = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [entityFilter, setEntityFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const loadLogs = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(false);
      try {
        const response = await activityAdminService.getAll({
          page,
          limit: 10,
          type: entityFilter,
          action: actionFilter,
        });

        setLogs(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.totalItems);
        setCurrentPage(response.meta.currentPage);
      } catch {
        setError(true);
        toast.error("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    },
    [entityFilter, actionFilter]
  );

  // Reset to page 1 whenever filters change
  useEffect(() => {
    loadLogs(1);
  }, [loadLogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadLogs(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900">
            System Activity Log
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Track all administrative actions across the platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
          {/* Entity Filter */}
          <div className="relative w-full sm:w-44">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All Entities</option>
              <option value="EVENT">Events</option>
              <option value="GALLERY">Gallery</option>
              <option value="NOTIFICATION">Notifications</option>
              <option value="MAGAZINE">Magazines</option>
            </select>
          </div>

          {/* Action Filter */}
          <div className="relative w-full sm:w-44">
            <Activity
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>

          <button
            onClick={() => loadLogs(currentPage)}
            disabled={loading}
            className="w-full sm:w-auto p-2.5 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-all active:scale-95 disabled:opacity-50 border border-stone-200 shadow-sm flex justify-center"
          >
            <RotateCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* States (Loading/Error/Empty) */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          <p className="mt-4 text-stone-500 font-medium">Fetching logs...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center shadow-sm">
          <p className="text-stone-800 font-serif text-lg mb-1">
            Unable to load logs
          </p>
          <button
            onClick={() => loadLogs(1)}
            className="text-amber-700 font-medium hover:underline flex items-center gap-2 mx-auto"
          >
            <RotateCw size={14} /> Try again
          </button>
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <EmptyState
          title="No activity found"
          description="Adjust your filters or check back later."
        />
      )}

      {/* Table & Pagination */}
      {!loading && !error && logs.length > 0 && (
        <>
          <ActivityTable logs={logs} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-stone-400 text-[11px] uppercase tracking-widest font-bold">
              Total {totalItems} Activities
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1 mx-2">
                <span className="text-sm font-semibold text-stone-900">
                  {currentPage}
                </span>
                <span className="text-sm text-stone-400">of</span>
                <span className="text-sm font-semibold text-stone-900">
                  {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogAdmin;
