import { useState } from "react";
import type { AdminEvent, EventStatus } from "../../../types/event.admin";

interface Props {
  initial?: AdminEvent;
  onSave: (event: AdminEvent) => void;
  onCancel: () => void;
}

const EventForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [status, setStatus] = useState<EventStatus>(initial?.status ?? "DRAFT");

  const handleSubmit = () => {
    onSave({
      id: initial?.id ?? Date.now().toString(),
      title,
      description,
      type,
      date,
      status,
      location: initial?.location,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        placeholder="Type (Gathering, Ceremony)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as EventStatus)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default EventForm;
