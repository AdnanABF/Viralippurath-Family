import { useState } from "react";
import type {
  AdminEvent,
  AdminEventDraft,
  EventStatus,
} from "../../../types/event.admin";
import {
  toDateTimeInputValue,
  nowDateTimeInputValue,
} from "../../../utils/date";

interface Props {
  initial?: AdminEvent;
  onSave: (event: AdminEvent | AdminEventDraft) => void;
  onCancel: () => void;
}

const EventForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [date, setDate] = useState(
    initial?.date ? toDateTimeInputValue(initial.date) : nowDateTimeInputValue()
  );
  const [status, setStatus] = useState<EventStatus>(initial?.status ?? "DRAFT");

  const handleSubmit = () => {
    const payload = {
      title,
      description,
      type,
      location: location || undefined,
      date,
      status,
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid });
    } else {
      onSave(payload as AdminEventDraft);
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6">
      <h2 className="text-lg font-serif text-stone-800">
        {initial?.uuid ? "Edit Event" : "Create New Event"}
      </h2>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          placeholder="Event title"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          placeholder="Short description of the event"
        />
      </div>

      {/* Type + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Type</label>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            placeholder="Gathering, Ceremony, Meeting"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            placeholder="Kerala, Dubai, Online…"
          />
        </div>
      </div>

      {/* Date */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
        />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as EventStatus)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-stone-600 border border-stone-300
                     hover:bg-stone-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-amber-700 text-white
                     hover:bg-amber-800 transition font-medium"
        >
          Save Event
        </button>
      </div>
    </div>
  );
};

export default EventForm;
