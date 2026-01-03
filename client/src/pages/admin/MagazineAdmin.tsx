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
  const [error, setError] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    title: string;
  } | null>(null);

  const loadMagazines = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await magazineAdminService.getAll();
      setItems(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagazines();
  }, []);

  const handleSave = async (data: AdminMagazine | AdminMagazineDraft) => {
    try {
      if ("uuid" in data && data.uuid) {
        const { uuid, ...payload } = data;
        await magazineAdminService.update(uuid, payload);
        toast.success("Magazine updated successfully");
      } else {
        await magazineAdminService.create(data as AdminMagazineDraft);
        toast.success("Magazine created successfully");
      }

      setEditing(null);
      loadMagazines();
    } catch {
      // Handled globally in api.ts
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await magazineAdminService.remove(deleteTarget.uuid);
      toast.success("Magazine deleted successfully");
      loadMagazines();
    } catch {
      // Handled globally in api.ts
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif text-stone-900">Manage Magazines</h1>
        <button
          onClick={() =>
            setEditing({
              title: "",
              publishedDate: new Date().toISOString(),
              flipbookUrl: "",
              status: "DRAFT",
            } as AdminMagazine)
          }
          className="w-full sm:w-auto bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-800 transition-all active:scale-95"
        >
          Create New Magazine
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <MagazineForm
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
          <p className="mt-4 text-stone-500 font-medium">Loading archives...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center shadow-sm">
          <p className="text-stone-800 font-serif text-lg mb-1">
            Something went wrong
          </p>
          <p className="text-stone-500 text-sm">
            We couldn't load the magazines. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No magazines yet"
          description="Create your first magazine to get started."
        />
      )}

      {/* Data Table */}
      {!loading && !error && items.length > 0 && (
        <MagazineTable
          items={items}
          onEdit={(m) => setEditing(m)}
          onDelete={(uuid) => {
            const m = items.find((x) => x.uuid === uuid);
            if (m) {
              setDeleteTarget({ uuid: m.uuid, title: m.title });
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
