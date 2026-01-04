import { useEffect, useState } from "react";
import type {
  AdminNotification,
  AdminNotificationDraft,
} from "../../types/notification.admin";
import { notificationsAdminService } from "../../services/notifications.admin.service";
import NotificationsTable from "../../components/admin/notifications/NotificationsTable";
import NotificationForm from "../../components/admin/notifications/NotificationForm";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const NotificationsAdmin = () => {
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [editing, setEditing] = useState<AdminNotification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    title: string;
  } | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await notificationsAdminService.getAll();
      setItems(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSave = async (
    data: AdminNotification | AdminNotificationDraft
  ) => {
    setIsSaving(true);

    try {
      if ("uuid" in data && data.uuid) {
        const { uuid, ...payload } = data;
        await notificationsAdminService.update(uuid, payload);
        toast.success("Notification updated successfully");
      } else {
        await notificationsAdminService.create(data as AdminNotificationDraft);
        toast.success("Notification created successfully");
      }

      setEditing(null);
      loadNotifications();
    } catch {
      // Handled globally in api.ts
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      await notificationsAdminService.remove(deleteTarget.uuid);
      toast.success("Notification deleted successfully");
      loadNotifications();
    } catch {
      // Handled globally in api.ts
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif text-stone-900">
          Manage Notifications
        </h1>
        <button
          onClick={() =>
            setEditing({
              title: "",
              content: "",
              date: "",
              priority: "NORMAL",
              status: "DRAFT",
            } as AdminNotification)
          }
          className="w-full sm:w-auto bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-800 transition-all active:scale-95"
        >
          Create New Notification
        </button>
      </div>

      {/* Create / Edit Modal */}
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

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          <p className="mt-4 text-stone-500 font-medium">
            Loading notifications...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center shadow-sm">
          <p className="text-stone-800 font-serif text-lg mb-1">
            Something went wrong
          </p>
          <p className="text-stone-500 text-sm">
            We couldn't load the notifications. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No notifications yet"
          description="Create your first notification to get started."
        />
      )}

      {/* Data Table */}
      {!loading && !error && items.length > 0 && (
        <NotificationsTable
          items={items}
          onEdit={(item) => setEditing(item)}
          onDelete={(uuid) => {
            const item = items.find((n) => n.uuid === uuid);
            if (item) {
              setDeleteTarget({ uuid: item.uuid, title: item.title });
            }
          }}
          disabled={isDeleting || isSaving}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Notification?"
        description={
          deleteTarget ? (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </span>
          ) : undefined
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
