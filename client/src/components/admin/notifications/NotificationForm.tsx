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
}

const NotificationForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
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

  const handleSubmit = () => {
    const payload = {
      title,
      content,
      priority,
      date,
      status,
    };

    if (initial?.id) {
      onSave({ ...payload, id: initial.id });
    } else {
      onSave(payload);
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6">
      <h2 className="text-lg font-serif text-stone-800">
        {initial ? "Edit Notification" : "Create Notification"}
      </h2>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          placeholder="Notification title"
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          placeholder="Notification message"
        />
      </div>

      {/* Priority + Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Priority</label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as NotificationPriority)
            }
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          >
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </select>
        </div>

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
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as NotificationStatus)}
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
          Save Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationForm;
