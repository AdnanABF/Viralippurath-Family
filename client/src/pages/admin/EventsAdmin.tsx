import { useEffect, useState } from "react";
import type { AdminEvent, AdminEventDraft } from "../../types/event.admin";
import { eventsAdminService } from "../../services/events.admin.service";
import EventsTable from "../../components/admin/events/EventsTable";
import EventForm from "../../components/admin/events/EventForm";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const EventsAdmin = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    title: string;
  } | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await eventsAdminService.getAll();
      setEvents(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSave = async (event: AdminEvent | AdminEventDraft) => {
    setIsSaving(true);

    try {
      if ("uuid" in event && event.uuid) {
        const { uuid, ...payload } = event;
        await eventsAdminService.update(uuid, payload);
        toast.success("Event updated successfully");
      } else {
        await eventsAdminService.create(event as AdminEventDraft);
        toast.success("Event created successfully");
      }

      setEditing(null);
      loadEvents();
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
      await eventsAdminService.remove(deleteTarget.uuid);
      toast.success("Event deleted successfully");
      loadEvents();
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
        <h1 className="text-2xl font-serif text-stone-900">Manage Events</h1>
        <button
          onClick={() =>
            setEditing({
              uuid: "",
              title: "",
              description: "",
              type: "Gathering",
              startDateTime: "",
              endDateTime: "",
              status: "DRAFT",
            } as AdminEvent)
          }
          className="w-full sm:w-auto bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-800 transition-all active:scale-95"
        >
          Add New Event
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => !isSaving && setEditing(null)}>
        {editing && (
          <EventForm
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
            Loading family events...
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

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <EmptyState
          title="No events yet"
          description="Create your first event to get started."
        />
      )}

      {/* Data Table */}
      {!loading && !error && events.length > 0 && (
        <EventsTable
          events={events}
          onEdit={(event) => setEditing(event)}
          onDelete={(uuid) => {
            const event = events.find((e) => e.uuid === uuid);
            if (event) {
              setDeleteTarget({ uuid: event.uuid, title: event.title });
            }
          }}
          disabled={isDeleting || isSaving}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Event?"
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

export default EventsAdmin;
