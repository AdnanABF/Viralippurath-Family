import { useState } from "react";
import type { AdminEvent, EventStatus } from "../../../types/event.admin";

interface Props {
  initial?: AdminEvent;
  onSave: (event: AdminEvent) => void;
  onCancel: () => void;
}

const EventForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [status, setStatus] = useState<EventStatus>(initial?.status ?? "DRAFT");

  const handleSubmit = () => {
    onSave({
      id: initial?.id ?? Date.now().toString(),
      title,
      date,
      status,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
      <h2 className="font-bold text-stone-800">
        {initial ? "Edit Event" : "Create Event"}
      </h2>

      <input
        className="w-full border rounded-lg px-3 py-2"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="w-full border rounded-lg px-3 py-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        className="w-full border rounded-lg px-3 py-2"
        value={status}
        onChange={(e) => setStatus(e.target.value as EventStatus)}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="text-stone-600">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EventForm;
