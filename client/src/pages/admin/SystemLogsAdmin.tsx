import { Filter } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Types and services
import api from "../../services/api";
import type { SystemLog } from "../../types/system-log.admin";
import { systemLogAdminService } from "../../services/system-log.admin.service";
import { useAdminData } from "../../hooks/admin/useAdminData";

// System specific components (We will create this next)
import SystemLogsTable from "../../components/admin/system-log/SystemLogsTable";
import SystemLogDetails from "../../components/admin/system-log/SystemLogDetails";

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
  ConfirmModal,
  Modal,
} from "../../components/ui";

const METHOD_OPTIONS = [
  { label: "All Methods", value: "ALL" },
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "PATCH", value: "PATCH" },
  { label: "DELETE", value: "DELETE" },
];

const SystemLogAdmin = () => {
  const {
    data: logs,
    loading,
    isRefreshing,
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
  } = useAdminData<SystemLog>("system-logs", systemLogAdminService.getAll, {
    method: "ALL",
    errorCode: "",
    startDate: "",
    endDate: "",
    correlationId: "",
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  const handleFilterTrace = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      correlationId: id,
      search: "",
    }));
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Success toast is now handled globally by api.ts interceptor
      await systemLogAdminService.cleanup();
      refresh(); // Reload data via hook
      refreshStatus;
    } catch {
      /* api.ts handles global error reporting via toast.error */
    } finally {
      setIsDeleting(false);
      setDeleteTarget(false);
    }
  };

  const { data: statusData, refetch: refreshStatus } = useQuery({
    queryKey: ["cleanup-status"],
    queryFn: async () => {
      const res = (await api.get("/admin/system-logs/cleanup-status")) as any;
      return {
        canDelete: res.canDelete,
        daysRemaining: res.daysRemaining,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="System Logs"
        description="Monitor server errors, status codes, and request traces."
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      >
        {/* Multi field Search */}
        <AdminMultiSearch
          value={filters.search || ""}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          placeholder="Search error code, message, path, method, userUuid.."
        />

        <AdminMultiSearch
          value={filters.correlationId || ""}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, correlationId: val }))
          }
          placeholder="Search by Request ID..."
        />

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

        <AdminControlGroup>
          <AdminSelect
            value={filters.method || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, method: val }))}
            options={METHOD_OPTIONS}
            icon={<Filter size={14} />}
            selectClassName="font-medium pl-9 pr-8 py-2.5"
          />
          <ResetButton
            onClick={reset}
            className="w-full sm:w-auto flex justify-center p-2.5"
          />
        </AdminControlGroup>
      </AdminHeader>

      {/* Main Content Area */}
      {loading ? (
        <AdminLoading message="Analyzing system logs..." />
      ) : error ? (
        <AdminError title="Unable to load system logs" onRetry={refresh} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="Clear Skies"
          description="No system errors found for the current filters."
        />
      ) : (
        <>
          <SystemLogsTable
            logs={logs}
            onDelete={() => setDeleteTarget(true)}
            onViewDetails={(log) => setSelectedLog(log)}
            onFilterTrace={handleFilterTrace}
            cleanupStatus={statusData || null}
          />

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

      {/* Modals */}
      <Modal open={!!selectedLog} onClose={() => setSelectedLog(null)}>
        {selectedLog && (
          <SystemLogDetails
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        open={deleteTarget}
        title="Delete Old Logs?"
        description={
          <span>
            Are you sure you want to delete system logs older than 30 days ?
            This action cannot be undone.
          </span>
        }
        confirmText="Delete"
        onCancel={() => setDeleteTarget(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SystemLogAdmin;
