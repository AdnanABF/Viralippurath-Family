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

const PRIORITY_OPTIONS = [
  { label: "All Priority", value: "ALL" },
  { label: "High", value: "HIGH" },
  { label: "Normal", value: "NORMAL" },
];

const defaultNotificationValues = {
  uuid: "",
  title: "",
  content: "",
  date: "",
  priority: "NORMAL",
  status: "DRAFT",
};

const NotificationsAdmin = () => {
  // 1. Data Logic Hook
  const {
    data: items,
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
  } = useAdminData<AdminNotification>(notificationsAdminService.getAll, {
    status: "ALL",
    priority: "ALL",
    search: "",
    startDate: "",
    endDate: "",
  });

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
      /* api.ts handles global error reporting via toast.error */
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
      /* api.ts handles global error reporting via toast.error */
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Manage Notifications"
        description="Broadcast updates and alerts to the family."
      >
        <AdminMultiSearch
          value={filters.search || ""}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          placeholder="Search title, content..."
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
            value={filters.status || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={STATUS_OPTIONS}
          />

          <AdminSelect
            value={filters.priority || "ALL"}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, priority: val }))
            }
            options={PRIORITY_OPTIONS}
          />

          <ResetButton onClick={reset} />
          <PrimaryButton
            label="Add Notification"
            onClick={() =>
              setEditing(defaultNotificationValues as AdminNotification)
            }
          />
        </AdminControlGroup>
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
              if (item) setDeleteTarget({ uuid: item.uuid, title: item.title });
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
