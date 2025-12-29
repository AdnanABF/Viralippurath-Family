import { useState } from "react";
import { adminEvents } from "../../components/admin/events/events.admin.mock";
import type { AdminEvent } from "../../types/event.admin";
import EventsTable from "../../components/admin/events/EventsTable";
import EventForm from "../../components/admin/events/EventForm";

const EventsAdmin = () => {
  const [events, setEvents] = useState(adminEvents);
  const [editing, setEditing] = useState<AdminEvent | null>(null);

  const handleSave = (event: AdminEvent) => {
    setEvents((prev) =>
      prev.some((e) => e.id === event.id)
        ? prev.map((e) => (e.id === event.id ? event : e))
        : [...prev, event]
    );
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif">Manage Events</h1>
        <button
          onClick={() => setEditing({} as AdminEvent)}
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

      <EventsTable
        events={events}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EventsAdmin;
