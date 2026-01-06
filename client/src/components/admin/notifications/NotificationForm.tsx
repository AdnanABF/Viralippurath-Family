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
        <button
          type="button"
          disabled={isLoading}
          onClick={onCancel}
          className="order-2 sm:order-1 px-6 py-3 rounded-xl text-stone-600 border border-stone-300 font-medium active:bg-stone-50
           hover:bg-stone-100 disabled:bg-stone-400 transition disabled:text-white disabled:opacity-50
           focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="order-1 sm:order-2 px-8 py-3 rounded-xl bg-amber-700 text-white font-bold shadow-lg shadow-amber-900/10
           hover:bg-amber-800 transition active:scale-[0.98] disabled:bg-stone-400 flex items-center justify-center gap-2
           focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
        >
          {isLoading ? (
            <>
              {/* Ensure the spinner is a span or has inline-block properties */}
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              </span>
              <span>{initial?.uuid ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <span>
              {initial?.uuid ? "Update Notification" : "Save Notification"}
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;
