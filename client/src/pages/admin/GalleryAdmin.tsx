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
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    caption: string;
  } | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryAdminService.getAll();
      setItems(data);
    } catch {
      setError("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSave = async (payload: AdminGalleryItem | AdminGalleryDraft) => {
    try {
      if ("id" in payload) {
        const { id, ...data } = payload;
        await galleryAdminService.update(id, data);
        toast.success("Image updated successfully");
      } else {
        await galleryAdminService.create(payload);
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
      await galleryAdminService.remove(deleteTarget.id);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif">Manage Gallery</h1>
        <button
          onClick={() =>
            setEditing({
              id: "",
              imageUrl: "",
              caption: "",
              album: "",
              year: new Date().getFullYear(),
              status: "DRAFT",
            })
          }
          className="bg-amber-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Image
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <GalleryForm
            initial={editing.id ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {loading && <p className="text-stone-500">Loading gallery…</p>}
      {error && <p className="text-red-600">{error}</p>}

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
          onDelete={(id) => {
            const item = items.find((i) => i.id === id);
            if (item) {
              setDeleteTarget({ id: item.id, caption: item.caption });
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
