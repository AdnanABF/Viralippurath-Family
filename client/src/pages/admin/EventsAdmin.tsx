import { useEffect, useState } from "react";
import type { AdminEvent, AdminEventDraft } from "../../types/event.admin";
import { eventsAdminService } from "../../services/events.admin.service";
import EventsTable from "../../components/admin/events/EventsTable";
import EventForm from "../../components/admin/events/EventForm";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import toast from "react-hot-toast";

const EventsAdmin = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsAdminService.getAll();
      setEvents(data);
    } catch {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSave = async (event: AdminEvent | AdminEventDraft) => {
    try {
      if ("id" in event) {
        const { id, ...payload } = event;
        await eventsAdminService.update(id, payload);
        toast.success("Event updated successfully");
      } else {
        await eventsAdminService.create(event);
        toast.success("Event created successfully");
      }

      setEditing(null);
      loadEvents();
    } catch {
      toast.error("Failed to save event");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await eventsAdminService.remove(deleteTarget.id);
      toast.success("Event deleted successfully");
      loadEvents();
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif">Manage Events</h1>
        <button
          onClick={() =>
            setEditing({
              id: "",
              title: "",
              description: "",
              type: "",
              date: "",
              status: "DRAFT",
            })
          }
          className="bg-amber-700 text-white px-4 py-2 rounded-lg"
        >
          + New Event
        </button>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <EventForm
            initial={editing.id ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {loading && <p className="text-stone-500">Loading events…</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <EventsTable
          events={events}
          onEdit={(event) => setEditing(event)}
          onDelete={(id) => {
            const event = events.find((e) => e.id === id);
            if (event) {
              setDeleteTarget({ id: event.id, title: event.title });
            }
          }}
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
      />
    </div>
  );
};

export default EventsAdmin;
