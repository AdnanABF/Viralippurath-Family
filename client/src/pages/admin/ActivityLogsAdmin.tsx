import { Activity, Filter } from "lucide-react";

// Types and services
import type { ActivityLog } from "../../types/activity-log.admin";
import { activityAdminService } from "../../services/activity-log.admin.service";
import { useAdminData } from "../../hooks/admin/useAdminData";

// Activity specific components
import ActivityTable from "../../components/admin/activity-log/ActivityLogsTable";

// UI Components
import {
  EmptyState,
  Pagination,
  AdminHeader,
  AdminDateRange,
  AdminSelect,
  ResetButton,
  AdminLoading,
  AdminError,
  AdminMultiSearch,
  AdminControlGroup,
} from "../../components/ui";

const ENTITY_OPTIONS = [
  { label: "All Entities", value: "ALL" },
  { label: "Events", value: "EVENT" },
  { label: "Gallery", value: "GALLERY" },
  { label: "Notifications", value: "NOTIFICATION" },
  { label: "Magazines", value: "MAGAZINE" },
];

const ACTION_OPTIONS = [
  { label: "All Actions", value: "ALL" },
  { label: "Create", value: "CREATE" },
  { label: "Update", value: "UPDATE" },
  { label: "Delete", value: "DELETE" },
];

const ActivityLogAdmin = () => {
  const {
    data: logs,
    loading,
    error,
    meta,
    currentPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    handlePageChange,
    reset,
    refresh,
  } = useAdminData<ActivityLog>(activityAdminService.getAll, {
    type: "ALL",
    action: "ALL",
    startDate: "",
    endDate: "",
    correlationId: "",
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Activity Log"
        description="Track all administrative actions."
      >
        <AdminMultiSearch
          value={filters.correlationId || ""}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, correlationId: val }))
          }
          placeholder="Search by Request ID..."
        />

        <AdminControlGroup>
          <AdminSelect
            value={filters.type || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, type: val }))}
            options={ENTITY_OPTIONS}
            icon={<Filter size={14} />}
            selectClassName="font-medium pl-9 pr-8 py-2.5"
          />

          <AdminSelect
            value={filters.action || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, action: val }))}
            options={ACTION_OPTIONS}
            icon={<Activity size={14} />}
            selectClassName="font-medium pl-9 pr-8 py-2.5"
          />
        </AdminControlGroup>

        <AdminControlGroup>
          <AdminDateRange
            start={filters.startDate || ""}
            end={filters.endDate || ""}
            onStartChange={(val) =>
              setFilters((prev) => ({ ...prev, startDate: val }))
            }
            onEndChange={(val) =>
              setFilters((prev) => ({ ...prev, endDate: val }))
            }
          />

          <ResetButton
            onClick={reset}
            className="w-full sm:w-auto flex justify-center"
          />
        </AdminControlGroup>
      </AdminHeader>

      {/* Main Content Area */}
      {loading ? (
        <AdminLoading message="Fetching logs..." />
      ) : error ? (
        <AdminError title="Unable to load logs" onRetry={refresh} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No activity found"
          description="Adjust your filters or check back later."
        />
      ) : (
        <>
          <ActivityTable logs={logs} />

          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
            isLoading={loading}
          />
        </>
      )}
    </div>
  );
};

export default ActivityLogAdmin;
