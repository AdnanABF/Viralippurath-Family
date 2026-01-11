import { useState } from "react";
import type {
  AdminNotification,
  AdminNotificationDraft,
  NotificationPriority,
  NotificationStatus,
} from "../../../types/notification.admin";
import {
  toDateTimeInputValue,
  nowDateTimeInputValue,
} from "../../../utils/date";
import { PrimaryButton, SecondaryButton } from "../../ui";

interface Props {
  initial?: AdminNotification;
  onSave: (data: AdminNotification | AdminNotificationDraft) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NotificationForm: React.FC<Props> = ({
  initial,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [priority, setPriority] = useState<NotificationPriority>(
    initial?.priority ?? "NORMAL"
  );
  const [date, setDate] = useState(
    initial?.date ? toDateTimeInputValue(initial.date) : nowDateTimeInputValue()
  );
  const [status, setStatus] = useState<NotificationStatus>(
    initial?.status ?? "DRAFT"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      content,
      priority,
      date,
      status,
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid } as AdminNotification);
    } else {
      onSave(payload as AdminNotificationDraft);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white sm:bg-stone-50 border-x-0 sm:border border-stone-200 sm:rounded-2xl pt-0 p-4 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-white sm:bg-stone-50 pt-4 pb-4 sm:pt-0 z-10 border-b border-stone-100 mb-2">
        <h2 className="text-xl font-serif text-stone-800">
          {initial?.uuid ? "Edit Notification" : "Create New Notification"}
        </h2>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Notification Title
          </label>
          <input
            required
            disabled={isLoading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            placeholder="e.g., Important Family Update"
          />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Message Content
          </label>
          <textarea
            required
            disabled={isLoading}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all resize-none text-base"
            placeholder="What would you like to notify members about?"
          />
        </div>

        {/* Priority + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Priority Level
            </label>
            <select
              value={priority}
              disabled={isLoading}
              onChange={(e) =>
                setPriority(e.target.value as NotificationPriority)
              }
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none"
            >
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High (Urgent Alert)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Publish Date & Time
            </label>
            <input
              required
              disabled={isLoading}
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
            onChange={(e) => setStatus(e.target.value as NotificationStatus)}
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
          label={initial?.uuid ? "Update Notification" : "Save Notification"}
          isLoading={isLoading}
          loadingLabel={initial?.uuid ? "Updating..." : "Creating..."}
        />
      </div>
    </form>
  );
};

export default NotificationForm;
