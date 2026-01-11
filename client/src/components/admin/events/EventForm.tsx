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
import { PrimaryButton, SecondaryButton } from "../../ui";

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
      /* p-4 on mobile, p-8 on desktop to match the layout spacing */
      className="bg-white lg:bg-stone-50 border-x-0 sm:border border-stone-200 sm:rounded-2xl p-4 pt-0 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-white lg:bg-stone-50 pt-4 pb-4 sm:pt-0 z-10 border-b border-stone-100 mb-2">
        <h2 className="text-xl font-serif text-stone-800">
          {initial?.uuid ? "Edit Event" : "Create New Event"}
        </h2>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Event Title
          </label>
          <input
            required
            disabled={isLoading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            placeholder="e.g., Annual Family Reunion"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Description
          </label>
          <textarea
            required
            disabled={isLoading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all resize-none text-base"
            placeholder="What is happening during this event?"
          />
        </div>

        {/* Type + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Event Type
            </label>
            <input
              required
              disabled={isLoading}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
              placeholder="Gathering, Ceremony, etc."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Location
            </label>
            <input
              required
              value={location}
              disabled={isLoading}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
              placeholder="Kerala, Dubai, Online..."
            />
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Start Date & Time
            </label>
            <input
              required
              disabled={isLoading}
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => handleStartChange(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              End Date & Time
            </label>
            <input
              required
              disabled={isLoading}
              type="datetime-local"
              value={endDateTime}
              min={startDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Visibility Status
          </label>
          <select
            value={status}
            disabled={isLoading}
            onChange={(e) => setStatus(e.target.value as EventStatus)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none"
          >
            <option value="DRAFT">Draft (Hidden from Public)</option>
            <option value="PUBLISHED">Published (Visible on Site)</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-stone-200">
        <SecondaryButton
          variant="form"
          onClick={onCancel}
          disabled={isLoading}
          label="Cancel"
        />
        <PrimaryButton
          type="submit"
          variant="form"
          label={initial?.uuid ? "Update Event" : "Save Event"}
          isLoading={isLoading}
          loadingLabel={initial?.uuid ? "Updating..." : "Creating..."}
        />
      </div>
    </form>
  );
};

export default EventForm;
