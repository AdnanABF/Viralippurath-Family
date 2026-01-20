import { useState } from "react";

// Types and services
import type {
  AdminNotification,
  AdminNotificationDraft,
} from "../../types/notification.admin";
import { notificationsAdminService } from "../../services/notifications.admin.service";
import { useAdminData } from "../../hooks/admin/useAdminData";

// Notification specific components
import NotificationsTable from "../../components/admin/notifications/NotificationsTable";
import NotificationForm from "../../components/admin/notifications/NotificationForm";

// UI Components
import {
  Modal,
  ConfirmModal,
  EmptyState,
  Pagination,
  AdminHeader,
  AdminDateRange,
  AdminSelect,
  AdminMultiSearch,
  PrimaryButton,
  ResetButton,
  AdminLoading,
  AdminError,
  AdminControlGroup,
} from "../../components/ui";

const STATUS_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
];

const CATEGORY_OPTIONS = [
  { label: "All Category", value: "ALL" },
  { label: "General", value: "GENERAL" },
  { label: "Magazine", value: "MAGAZINE" },
  { label: "Event", value: "EVENT" },
  { label: "Urgent", value: "URGENT" },
];

const defaultNotificationValues = {
  uuid: "",
  title_en: "",
  title_ml: "",
  content_en: "",
  content_ml: "",
  date: "",
  status: "DRAFT",
  category: "GENERAL",
  isPinned: false,
};

const NotificationsAdmin = () => {
  // 1. Data Logic Hook
  const {
    data: items,
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
  } = useAdminData<AdminNotification>(
    "notification-admin",
    notificationsAdminService.getAll,
    {
      status: "ALL",
      category: "ALL",
      search: "",
      startDate: "",
      endDate: "",
    }
  );

  // 2. Local Action States
  const [editing, setEditing] = useState<AdminNotification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    title: string;
  } | null>(null);

  // 3. Handlers
  const handleSave = async (
    data: AdminNotification | AdminNotificationDraft
  ) => {
    setIsSaving(true);
    try {
      if ("uuid" in data && data.uuid) {
        const { uuid, ...payload } = data;
        await notificationsAdminService.update(uuid, payload);
      } else {
        await notificationsAdminService.create(data as AdminNotificationDraft);
      }
      setEditing(null);
      refresh();
    } catch {
      /* api.ts handles global error reporting */
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await notificationsAdminService.remove(deleteTarget.uuid);
      refresh();
    } catch {
      /* api.ts handles global error reporting */
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  /**
   * Helper to convert local date selection (YYYY-MM-DD)
   * to exact UTC ISO strings for the API filter.
   */
  const handleDateFilterChange = (type: "start" | "end", dateVal: string) => {
    if (!dateVal) {
      setFilters((prev) => ({
        ...prev,
        [type === "start" ? "startDate" : "endDate"]: "",
      }));
      return;
    }

    const date = new Date(dateVal);
    if (type === "start") {
      date.setHours(0, 0, 0, 0); // Start of local day
    } else {
      date.setHours(23, 59, 59, 999); // End of local day
    }

    setFilters((prev) => ({
      ...prev,
      [type === "start" ? "startDate" : "endDate"]: date.toISOString(),
    }));
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Manage Notifications"
        description="Broadcast updates and alerts to the family."
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      >
        <AdminMultiSearch
          value={filters.search || ""}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          placeholder="Search title, content..."
        />

        <AdminDateRange
          // Display only the date part in the picker (YYYY-MM-DD)
          start={filters.startDate ? filters.startDate.split("T")[0] : ""}
          end={filters.endDate ? filters.endDate.split("T")[0] : ""}
          onStartChange={(val) => handleDateFilterChange("start", val)}
          onEndChange={(val) => handleDateFilterChange("end", val)}
        />

        <AdminControlGroup>
          <AdminSelect
            value={filters.status || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={STATUS_OPTIONS}
          />

          <AdminSelect
            value={filters.category || "ALL"}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, category: val }))
            }
            options={CATEGORY_OPTIONS}
          />

          <ResetButton onClick={reset} />
        </AdminControlGroup>

        <PrimaryButton
          label="Add Notification"
          className="w-full sm:w-auto"
          onClick={() =>
            setEditing(defaultNotificationValues as AdminNotification)
          }
        />
      </AdminHeader>

      {/* Main Table Area */}
      {loading ? (
        <AdminLoading message="Loading notifications..." />
      ) : error ? (
        <AdminError title="Unable to load notifications" onRetry={refresh} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No notifications found"
          description="Adjust your filters or create a new one."
        />
      ) : (
        <>
          <NotificationsTable
            items={items}
            onEdit={setEditing}
            onDelete={(uuid) => {
              const item = items.find((n) => n.uuid === uuid);
              if (item)
                setDeleteTarget({ uuid: item.uuid, title: item.title_en });
            }}
            disabled={isDeleting || isSaving}
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
      <Modal open={!!editing} onClose={() => !isSaving && setEditing(null)}>
        {editing && (
          <NotificationForm
            initial={editing.uuid ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isLoading={isSaving}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Notification?"
        description={
          deleteTarget && (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </span>
          )
        }
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default NotificationsAdmin;
