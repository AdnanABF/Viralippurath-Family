import { useState } from "react";

// Types and services
import type { AdminGalleryItem } from "../../types/gallery.admin";
import { galleryAdminService } from "../../services/gallery.admin.service";
import { useAdminData } from "../../hooks/admin/useAdminData";

// Gallery specific components
import GalleryTable from "../../components/admin/gallery/GalleryTable";
import GalleryForm from "../../components/admin/gallery/GalleryForm";

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

const defaultGalleryValues = {
  uuid: "",
  imageUrl: "",
  caption: "",
  album: "",
  year: new Date().getFullYear(),
  status: "DRAFT",
};

const GalleryAdmin = () => {
  // 1. Logic & Data Hook
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
  } = useAdminData<AdminGalleryItem>(galleryAdminService.getAll, {
    status: "ALL",
    album: "ALL",
    search: "",
    startDate: "",
    endDate: "",
  });

  // 2. Local UI States
  const [editing, setEditing] = useState<AdminGalleryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    caption: string;
  } | null>(null);

  // 3. Handlers
  const handleSave = async (formData: FormData) => {
    setIsSaving(true);
    try {
      const uuid = editing?.uuid;
      if (uuid && uuid !== "") {
        // Success toast is now handled globally by api.ts interceptor
        await galleryAdminService.update(uuid, formData);
      } else {
        // Success toast is now handled globally by api.ts interceptor
        await galleryAdminService.create(formData);
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
      // Success toast is now handled globally by api.ts interceptor
      await galleryAdminService.remove(deleteTarget.uuid);
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
        title="Manage Gallery"
        description="Organize family photos and albums."
      >
        <AdminMultiSearch
          value={filters.search || ""}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          placeholder="Search caption, album..."
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
            label="Add New Image"
            onClick={() => setEditing(defaultGalleryValues as AdminGalleryItem)}
          />
        </AdminControlGroup>
      </AdminHeader>

      {/* Content Area */}
      {loading ? (
        <AdminLoading message="Loading Gallery..." />
      ) : error ? (
        <AdminError title="Unable to load gallery" onRetry={refresh} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No images found"
          description="Try adjusting your filters or add a new photo."
        />
      ) : (
        <>
          <GalleryTable
            items={items}
            onEdit={setEditing}
            onDelete={(uuid) => {
              const item = items.find((i) => i.uuid === uuid);
              if (item)
                setDeleteTarget({ uuid: item.uuid, caption: item.caption });
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

      {/* Form Modal */}
      <Modal open={!!editing} onClose={() => !isSaving && setEditing(null)}>
        {editing && (
          <GalleryForm
            initial={editing.uuid ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isLoading={isSaving}
          />
        )}
      </Modal>

      {/* Deletion Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Photo?"
        description={
          deleteTarget && (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.caption}
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

export default GalleryAdmin;
