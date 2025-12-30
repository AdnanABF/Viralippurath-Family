import { useEffect, useState } from "react";
import type { AdminEvent } from "../../types/event.admin";
import { eventsAdminService } from "../../services/events.admin.service";
import EventsTable from "../../components/admin/events/EventsTable";
import EventForm from "../../components/admin/events/EventForm";

const EventsAdmin = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsAdminService.getAll();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSave = async (event: AdminEvent) => {
    try {
      if (event.id) {
        await eventsAdminService.update(event.id, event);
      } else {
        const { id, ...payload } = event;
        await eventsAdminService.create(payload);
      }
      setEditing(null);
      loadEvents();
    } catch {
      alert("Failed to save event");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event permanently?")) return;
    try {
      await eventsAdminService.remove(id);
      loadEvents();
    } catch {
      alert("Failed to delete event");
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

      {editing && (
        <EventForm
          initial={editing.id ? editing : undefined}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading && <p className="text-stone-500">Loading events…</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <EventsTable
          events={events}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EventsAdmin;
