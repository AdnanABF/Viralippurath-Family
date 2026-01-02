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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsAdminService.getAll();
      setItems(data);
    } catch {
      // handled globally in api.ts
      setError("Failed to load notifications");
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
    try {
      if ("id" in data) {
        const { id, ...payload } = data;
        await notificationsAdminService.update(id, payload);
        toast.success("Notification updated successfully");
      } else {
        await notificationsAdminService.create(data);
        toast.success("Notification created successfully");
      }

      setEditing(null);
      loadNotifications();
    } catch {
      // ❌ no toast here — api.ts already handled it
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await notificationsAdminService.remove(deleteTarget.id);
      toast.success("Notification deleted successfully");
      loadNotifications();
    } catch {
      // ❌ no toast here — api.ts already handled it
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif">Manage Notifications</h1>
        <button
          onClick={() =>
            setEditing({
              id: "",
              title: "",
              content: "",
              date: "",
              priority: "NORMAL",
              status: "DRAFT",
            })
          }
          className="bg-amber-700 text-white px-4 py-2 rounded-lg"
        >
          Create New Notification
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <NotificationForm
            initial={editing.id ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {loading && <p className="text-stone-500">Loading notifications…</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No notifications yet"
          description="Create your first notification to get started."
        />
      )}

      {!loading && !error && items.length > 0 && (
        <NotificationsTable
          items={items}
          onEdit={(item) => setEditing(item)}
          onDelete={(id) => {
            const item = items.find((n) => n.id === id);
            if (item) {
              setDeleteTarget({ id: item.id, title: item.title });
            }
          }}
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
      />
    </div>
  );
};

export default NotificationsAdmin;
