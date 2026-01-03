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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      type,
      location: location || undefined,
      date,
      status,
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid } as AdminEvent);
    } else {
      onSave(payload as AdminEventDraft);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-xl font-serif text-stone-800">
        {initial?.uuid ? "Edit Event" : "Create New Event"}
      </h2>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Event Title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          placeholder="e.g., Annual Family Reunion"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Description
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all resize-none"
          placeholder="What is happening during this event?"
        />
      </div>

      {/* Type + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Event Type
          </label>
          <input
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            placeholder="Gathering, Ceremony, etc."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            placeholder="Kerala, Dubai, Online..."
          />
        </div>
      </div>

      {/* Date */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Date & Time
        </label>
        <input
          required
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Visibility Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as EventStatus)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        >
          <option value="DRAFT">Draft (Hidden from Public)</option>
          <option value="PUBLISHED">Published (Visible on Site)</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-stone-600 border border-stone-300
                     hover:bg-stone-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-amber-700 text-white
                     hover:bg-amber-800 transition font-bold shadow-md active:scale-95"
        >
          {initial?.uuid ? "Update Event" : "Save Event"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
