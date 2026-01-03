import { useEffect, useState } from "react";
import type {
  AdminGalleryItem,
  AdminGalleryDraft,
} from "../../types/gallery.admin";
import { galleryAdminService } from "../../services/gallery.admin.service";
import GalleryTable from "../../components/admin/gallery/GalleryTable";
import GalleryForm from "../../components/admin/gallery/GalleryForm";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const GalleryAdmin = () => {
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [editing, setEditing] = useState<AdminGalleryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    caption: string;
  } | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await galleryAdminService.getAll();
      setItems(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSave = async (payload: AdminGalleryItem | AdminGalleryDraft) => {
    try {
      if ("uuid" in payload && payload.uuid) {
        const { uuid, ...data } = payload;
        await galleryAdminService.update(uuid, data);
        toast.success("Image updated successfully");
      } else {
        await galleryAdminService.create(payload as AdminGalleryDraft);
        toast.success("Image added to gallery");
      }

      setEditing(null);
      loadGallery();
    } catch {
      // handled globally in api.ts
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await galleryAdminService.remove(deleteTarget.uuid);
      toast.success("Image deleted successfully");
      loadGallery();
    } catch {
      // handled globally
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif text-stone-900">Manage Gallery</h1>
        <button
          onClick={() =>
            setEditing({
              uuid: "",
              imageUrl: "",
              caption: "",
              album: "",
              year: new Date().getFullYear(),
              status: "DRAFT",
            })
          }
          className="w-full sm:w-auto bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-800 transition-all active:scale-95"
        >
          Add New Image
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <GalleryForm
            initial={editing.uuid ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          <p className="mt-4 text-stone-500 font-medium">
            Loading gallery images...
          </p>
        </div>
      )}

      {/* Generic Error State */}
      {error && !loading && (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center shadow-sm">
          <p className="text-stone-800 font-serif text-lg mb-1">
            Something went wrong
          </p>
          <p className="text-stone-500 text-sm">
            We couldn't load the events. Please try again later.
          </p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No images in gallery yet"
          description="Create your first image to get started."
        />
      )}

      {!loading && !error && items.length > 0 && (
        <GalleryTable
          items={items}
          onEdit={setEditing}
          onDelete={(uuid) => {
            const item = items.find((i) => i.uuid === uuid);
            if (item) {
              setDeleteTarget({ uuid: item.uuid, caption: item.caption });
            }
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Gallery Image?"
        description={
          deleteTarget ? (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.caption}
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

export default GalleryAdmin;
