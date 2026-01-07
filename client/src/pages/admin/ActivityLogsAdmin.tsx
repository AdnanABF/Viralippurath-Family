import { useEffect, useState, useCallback } from "react";
import {
  Filter,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Activity,
  List,
  Calendar,
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
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [entityFilter, setEntityFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadLogs = useCallback(
    async (page: number, limit: number) => {
      setLoading(true);
      setError(false);
      try {
        const response = await activityAdminService.getAll({
          page,
          limit,
          type: entityFilter,
          action: actionFilter,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
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
    [entityFilter, actionFilter, startDate, endDate]
  );

  useEffect(() => {
    loadLogs(1, pageSize);
  }, [loadLogs, pageSize]);

  const resetFilters = () => {
    setEntityFilter("ALL");
    setActionFilter("ALL");
    setStartDate("");
    setEndDate("");
    loadLogs(1, pageSize);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      loadLogs(newPage, pageSize);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Generates pagination with fixed-multiple milestones (e.g., 10, 20, 30)
   */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // 1. Determine fixed increment based on total pages
    let increment = 10;
    if (totalPages <= 10) increment = 3;
    else if (totalPages <= 30) increment = 5;
    else if (totalPages <= 60) increment = 10;
    else if (totalPages <= 100) increment = 20;
    else increment = 50;

    const leftNeighbor = currentPage - 1;
    const rightNeighbor = currentPage + 1;

    // 2. Start with Page 1
    pages.push(1);

    // 3. Add Milestones BEFORE focus (Multiples of increment)
    for (let i = increment; i < leftNeighbor; i += increment) {
      if (i > 1 && !pages.includes(i)) {
        pages.push(i);
      }
    }

    // 4. Add Bridge before focus if a gap exists
    const lastBeforeFocus = pages[pages.length - 1] as number;
    if (leftNeighbor > 1 && leftNeighbor - lastBeforeFocus > 1) {
      pages.push("...");
    }

    // 5. Add Active Focus (Neighbors + Current)
    for (
      let i = Math.max(1, leftNeighbor);
      i <= Math.min(totalPages, rightNeighbor);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // 6. Add Bridge after focus if a gap exists before the next milestone
    const firstPossibleNextMilestone =
      Math.ceil((rightNeighbor + 1) / increment) * increment;
    if (
      totalPages > rightNeighbor &&
      firstPossibleNextMilestone - rightNeighbor > 1 &&
      firstPossibleNextMilestone <= totalPages
    ) {
      pages.push("...");
    }

    // 7. Add Milestones AFTER focus (Multiples of increment)
    for (let i = firstPossibleNextMilestone; i < totalPages; i += increment) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // 8. Add Final Page Anchor
    if (!pages.includes(totalPages)) {
      const lastAdded = pages[pages.length - 1];
      if (typeof lastAdded === "number" && totalPages - lastAdded > 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
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
            Track all administrative actions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
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

          <div className="relative w-full md:w-96 flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Calendar size={14} className="text-stone-400" />
            <span className="text-xs font-medium text-stone-500">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs font-bold text-stone-700 outline-none bg-transparent"
            />
            <span className="text-stone-300 mx-1">|</span>
            <span className="text-xs font-medium text-stone-500">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs font-bold text-stone-700 outline-none bg-transparent"
            />
          </div>

          <button
            onClick={resetFilters}
            disabled={loading}
            className="w-full sm:w-auto p-2 bg-stone-100 text-stone-600 rounded-lg hover:text-amber-700 hover:bg-stone-200 transition-all active:scale-95 disabled:opacity-50 border border-stone-200 shadow-sm flex justify-center"
          >
            <RotateCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* States */}
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
            onClick={() => loadLogs(1, pageSize)}
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

      {/* Table & Advanced Pagination */}
      {!loading && !error && logs.length > 0 && (
        <>
          <ActivityTable logs={logs} />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-4 border-t border-stone-100">
            <div className="flex flex-row gap-4 sm:gap-6 justify-between w-full sm:w-auto">
              <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold border-r border-stone-200 pr-4">
                Total {totalItems} Activities
              </p>

              <div className="flex items-center gap-2">
                <List size={14} className="text-stone-400" />
                <span className="text-xs text-stone-500 font-medium">
                  Show:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-stone-700 outline-none cursor-pointer hover:text-amber-700 transition-colors"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 max-w-full">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) => (
                  <button
                    key={idx}
                    disabled={pageNum === "..." || loading}
                    onClick={() =>
                      typeof pageNum === "number" && handlePageChange(pageNum)
                    }
                    className={`min-w-9 h-9 px-2 rounded-lg text-xs font-bold transition-all ${
                      pageNum === currentPage
                        ? "bg-amber-700 text-white shadow-md shadow-amber-900/10"
                        : pageNum === "..."
                        ? "text-stone-400 cursor-default"
                        : "bg-white border border-stone-200 text-stone-600 hover:border-amber-700 hover:text-amber-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogAdmin;
