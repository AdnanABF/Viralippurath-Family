import { useState } from "react";
import type { AdminUser, AdminUserDraft } from "../../types/admin.management";
import { adminManagementService } from "../../services/admin.management.service";
import { useAdminData } from "../../hooks/admin/useAdminData";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Event specific components
import AdminsTable from "../../components/admin/admin-management/AdminsTable";
import AdminUserForm from "../../components/admin/admin-management/AdminUserForm";

// Reusable UI Components
import {
  Modal,
  ConfirmModal,
  EmptyState,
  AdminHeader,
  PrimaryButton,
  AdminLoading,
  AdminError,
  Pagination,
  AdminControlGroup,
  ResetButton,
  AdminSelect,
  AdminMultiSearch,
} from "../../components/ui";

const ROLE_OPTIONS = [
  { label: "All Roles", value: "ALL" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Disabled", value: "DISABLED" },
];

const defaultAdminValues = {
  uuid: "",
  username: "",
  fullName: "",
  role: "ADMIN",
  isActive: true,
};

const AdminManagement = () => {
  const { user } = useAuth();

  const {
    data: admins,
    loading,
    isRefreshing,
    error,
    meta,
    currentPage,
    pageSize,
    setPageSize,
    handlePageChange,
    filters,
    setFilters,
    reset,
    refresh,
  } = useAdminData<AdminUser>(
    "admin-management",
    adminManagementService.getAll,
    { role: "ALL" }
  );

  // 2. Action States
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    fullName: string;
  } | null>(null);

  // 3. Handlers
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
      refresh(); // Reload data via TanStack Query
    } catch {
      // Handled globally by api.ts interceptor
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminManagementService.remove(deleteTarget.uuid);
      refresh(); // Reload data via TanStack Query
    } catch {
      // Handled globally
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <AdminHeader
        title="Manage Administrators"
        description="Create and manage access for family portal admins."
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      >
        <AdminMultiSearch
          value={filters.search || ""}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          placeholder="Search name, username..."
        />
        <AdminControlGroup>
          <AdminSelect
            value={filters.role || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, role: val }))}
            options={ROLE_OPTIONS}
          />
          <AdminSelect
            value={filters.status || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={STATUS_OPTIONS}
          />
          <ResetButton onClick={reset} />
        </AdminControlGroup>

        <PrimaryButton
          label="Add New Admin"
          onClick={() => setEditing(defaultAdminValues as AdminUser)}
          className="w-full sm:w-auto"
        />
      </AdminHeader>

      {/* Main Content Area */}
      {loading ? (
        <AdminLoading message="Loading administrator list..." />
      ) : error ? (
        <AdminError
          title="Access Denied or Connection Error"
          message="Please ensure you have Super Admin privileges."
          onRetry={refresh}
        />
      ) : admins.length === 0 ? (
        <EmptyState
          title="No admins found"
          description="Adjust your filters or create a new admin."
        />
      ) : (
        <>
          <AdminsTable
            admins={admins}
            currentUserUuid={user?.uuid}
            onEdit={(admin) => setEditing(admin)}
            onDelete={(uuid) => {
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

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => !isSaving && setEditing(null)}>
        {editing && (
          <AdminUserForm
            initial={editing.uuid ? editing : undefined}
            currentUserUuid={user?.uuid}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isLoading={isSaving}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Remove Admin Access?"
        description={
          deleteTarget && (
            <span>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.fullName}
              </span>
              ? They will lose all access to the portal immediately.
            </span>
          )
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
