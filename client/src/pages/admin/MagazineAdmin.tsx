import { useEffect, useState } from "react";
import type {
  AdminMagazine,
  AdminMagazineDraft,
} from "../../types/magazine.admin";
import { magazineAdminService } from "../../services/magazine.admin.service";
import MagazineTable from "../../components/admin/magazine/MagazineTable";
import MagazineForm from "../../components/admin/magazine/MagazineForm";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const MagazineAdmin = () => {
  const [items, setItems] = useState<AdminMagazine[]>([]);
  const [editing, setEditing] = useState<AdminMagazine | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const loadMagazines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await magazineAdminService.getAll();
      setItems(data);
    } catch {
      // handled globally in api.ts
      setError("Failed to load magazines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagazines();
  }, []);

  const handleSave = async (data: AdminMagazine | AdminMagazineDraft) => {
    try {
      if ("id" in data) {
        const { id, ...payload } = data;
        await magazineAdminService.update(id, payload);
        toast.success("Magazine updated successfully");
      } else {
        await magazineAdminService.create(data);
        toast.success("Magazine created successfully");
      }

      setEditing(null);
      loadMagazines();
    } catch {
      // ❌ no toast here — api.ts handles errors
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await magazineAdminService.remove(deleteTarget.id);
      toast.success("Magazine deleted successfully");
      loadMagazines();
    } catch {
      // ❌ no toast here — api.ts handles errors
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif">Manage Magazines</h1>
        <button
          onClick={() =>
            setEditing({
              id: "",
              title: "",
              year: new Date().getFullYear(),
              flipbookUrl: "",
              status: "DRAFT",
            })
          }
          className="bg-amber-700 text-white px-4 py-2 rounded-lg"
        >
          Create New Magazine
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <MagazineForm
            initial={editing.id ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {loading && <p className="text-stone-500">Loading magazines…</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No magazines yet"
          description="Create your first magazine to get started."
        />
      )}

      {!loading && !error && items.length > 0 && (
        <MagazineTable
          items={items}
          onEdit={(m) => setEditing(m)}
          onDelete={(id) => {
            const m = items.find((x) => x.id === id);
            if (m) {
              setDeleteTarget({ id: m.id, title: m.title });
            }
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Magazine?"
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

export default MagazineAdmin;
