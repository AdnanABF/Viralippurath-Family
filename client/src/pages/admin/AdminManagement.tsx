import { useEffect, useState } from "react";
import type { AdminUser, AdminUserDraft } from "../../types/admin.management";
import { adminManagementService } from "../../services/admin.management.service";
import AdminsTable from "../../components/admin/admin-management/AdminsTable";
import AdminUserForm from "../../components/admin/admin-management/AdminUserForm";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const AdminManagement = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    fullName: string;
  } | null>(null);

  const loadAdmins = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await adminManagementService.getAll();
      setAdmins(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSave = async (admin: AdminUser | AdminUserDraft) => {
    setIsSaving(true);
    try {
      if ("uuid" in admin && admin.uuid) {
        const { uuid, ...payload } = admin;
        await adminManagementService.update(uuid, payload);
      } else {
        await adminManagementService.create(admin as AdminUserDraft);
      }
      setEditing(null);
      loadAdmins();
    } catch {
      // Global interceptor handles error reporting
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminManagementService.remove(deleteTarget.uuid);
      loadAdmins();
    } catch {
      // Handled globally
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header aligned with Events style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900">
            Manage Administrators
          </h1>
          <p className="text-stone-500 text-sm">
            Create and manage access for family portal admins
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              uuid: "",
              username: "",
              fullName: "",
              role: "ADMIN",
              isActive: true,
            } as AdminUser)
          }
          className="w-full sm:w-auto bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-800 transition-all active:scale-95"
        >
          Add New Admin
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => !isSaving && setEditing(null)}>
        {editing && (
          <AdminUserForm
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
            Loading administrator list...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center shadow-sm">
          <p className="text-stone-800 font-serif text-lg mb-1">
            Access Denied or Connection Error
          </p>
          <p className="text-stone-500 text-sm">
            Please ensure you have Super Admin privileges.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && admins.length === 0 && (
        <EmptyState
          title="No other admins"
          description="You are currently the only administrator."
        />
      )}

      {/* Data Table */}
      {!loading && !error && admins.length > 0 && (
        <AdminsTable
          admins={admins}
          currentUserUuid={user?.uuid}
          onEdit={(admin) => setEditing(admin)}
          onDelete={(uuid) => {
            // Keep manual toast for client-side validation
            if (uuid === user?.uuid) {
              toast.error("You cannot delete your own account");
              return;
            }
            const admin = admins.find((a) => a.uuid === uuid);
            if (admin)
              setDeleteTarget({ uuid: admin.uuid, fullName: admin.fullName });
          }}
          disabled={isDeleting || isSaving}
        />
      )}

      {/* Delete Confirmation aligned with Events Modal style */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Remove Admin Access?"
        description={
          deleteTarget ? (
            <span>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.fullName}
              </span>
              ? They will lose all access to the portal immediately.
            </span>
          ) : undefined
        }
        confirmText="Remove Access"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminManagement;
