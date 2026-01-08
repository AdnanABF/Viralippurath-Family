import { useState } from "react";
import toast from "react-hot-toast";

// Types and services
import type {
  AdminMagazine,
  AdminMagazineDraft,
} from "../../types/magazine.admin";
import { magazineAdminService } from "../../services/magazine.admin.service";
import { cloudinaryUploadService } from "../../services/cloudinary.service";
import { useAdminData } from "../../hooks/admin/useAdminData";

// Magazine specific components
import MagazineTable from "../../components/admin/magazine/MagazineTable";
import MagazineForm from "../../components/admin/magazine/MagazineForm";

// UI Components
import {
  Modal,
  ConfirmModal,
  EmptyState,
  Pagination,
  AdminHeader,
  AdminMultiSearch,
  AdminDateRange,
  AdminSelect,
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

const defaultMagazineValues = {
  uuid: "",
  title: "",
  publishedDate: new Date().toISOString(),
  status: "DRAFT",
};

const MagazineAdmin = () => {
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
  } = useAdminData<AdminMagazine>(magazineAdminService.getAll, {
    status: "ALL",
    search: "",
    startDate: "",
    endDate: "",
  });

  // 2. Action States
  const [editing, setEditing] = useState<AdminMagazine | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    title: string;
  } | null>(null);

  // 3. Handlers
  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      let uploadResults = {};

      // Handle Cloudinary PDF upload (Client-side action - keep manual toasts)
      if (data.file) {
        toast.loading("Uploading PDF to cloud...", { id: "upload-toast" });
        uploadResults = await cloudinaryUploadService.uploadFile(
          data.file,
          "magazines"
        );
        toast.success("PDF uploaded successfully", { id: "upload-toast" });
      }

      const { file, ...formFields } = data;
      const finalPayload = { ...formFields, ...uploadResults };

      if (data.uuid) {
        await magazineAdminService.update(data.uuid, finalPayload);
      } else {
        await magazineAdminService.create(finalPayload as AdminMagazineDraft);
      }

      setEditing(null);
      refresh();
    } catch (err) {
      // If error occurs, we handle the toast cleanup here
      // (Global interceptor will show the error message toast)
      toast.dismiss("upload-toast");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await magazineAdminService.remove(deleteTarget.uuid);
      refresh();
    } catch {
      /* Handled globally by api.ts */
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Manage Magazines"
        description="Digital archive of family publications."
      >
        <AdminMultiSearch
          value={filters.search || ""}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          placeholder="Search by title..."
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
          <ResetButton onClick={reset} />
          <PrimaryButton
            label="Add New Magazine"
            onClick={() => setEditing(defaultMagazineValues as AdminMagazine)}
          />
        </AdminControlGroup>
      </AdminHeader>

      {/* Main Content Area */}
      {loading ? (
        <AdminLoading message="Loading Magazines..." />
      ) : error ? (
        <AdminError title="Unable to load magazines" onRetry={refresh} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No magazines found"
          description="Adjust your filters or upload a new issue."
        />
      ) : (
        <>
          <MagazineTable
            items={items}
            onEdit={setEditing}
            onDelete={(uuid) => {
              const m = items.find((x) => x.uuid === uuid);
              if (m) setDeleteTarget({ uuid: m.uuid, title: m.title });
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
          <MagazineForm
            initial={editing.uuid ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isLoading={isSaving}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Magazine Issue?"
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
        confirmText="Delete Issue"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MagazineAdmin;
