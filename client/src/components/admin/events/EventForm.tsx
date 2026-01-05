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
  isLoading?: boolean;
}

const EventForm: React.FC<Props> = ({
  initial,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");

  const [startDateTime, setStartDateTime] = useState(
    initial?.startDateTime
      ? toDateTimeInputValue(initial.startDateTime)
      : nowDateTimeInputValue()
  );
  const [endDateTime, setEndDateTime] = useState(
    initial?.endDateTime
      ? toDateTimeInputValue(initial.endDateTime)
      : nowDateTimeInputValue()
  );

  const [status, setStatus] = useState<EventStatus>(initial?.status ?? "DRAFT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      type,
      location,
      startDateTime,
      endDateTime,
      status,
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid } as AdminEvent);
    } else {
      onSave(payload as AdminEventDraft);
    }
  };

  const handleStartChange = (val: string) => {
    setStartDateTime(val);
    if (endDateTime < val) {
      setEndDateTime(val);
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
          disabled={isLoading}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
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
          disabled={isLoading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all resize-none"
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
            disabled={isLoading}
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            placeholder="Gathering, Ceremony, etc."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Location
          </label>
          <input
            required
            value={location}
            disabled={isLoading}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            placeholder="Kerala, Dubai, Online..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Start Date & Time
          </label>
          <input
            required
            disabled={isLoading}
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            End Date & Time
          </label>
          <input
            required
            disabled={isLoading}
            type="datetime-local"
            value={endDateTime}
            min={startDateTime} // Validates end is not before start
            onChange={(e) => setEndDateTime(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Visibility Status
        </label>
        <select
          value={status}
          disabled={isLoading}
          onChange={(e) => setStatus(e.target.value as EventStatus)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        >
          <option value="DRAFT">Draft (Hidden from Public)</option>
          <option value="PUBLISHED">Published (Visible on Site)</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          disabled={isLoading}
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-stone-600 border border-stone-300
                     hover:bg-stone-100 disabled:bg-stone-400 transition disabled:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition font-bold shadow-md active:scale-95 disabled:bg-stone-400 flex items-center justify-center gap-2 min-w-35"
        >
          {isLoading ? (
            <>
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              </span>
              <span>{initial?.uuid ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <span>{initial?.uuid ? "Update Event" : "Save Event"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
