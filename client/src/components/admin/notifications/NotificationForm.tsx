import { useState } from "react";
import { useFormDirty } from "../../../hooks/useFormDirty";
import type {
  AdminNotification,
  AdminNotificationDraft,
  NotificationStatus,
  NotificationCategory,
} from "../../../types/notification.admin";
import {
  toDateTimeInputValue,
  nowDateTimeInputValue,
  toUTCISO,
} from "../../../utils/date";
import { PrimaryButton, SecondaryButton } from "../../ui";

interface Props {
  initial?: AdminNotification;
  onSave: (data: AdminNotification | AdminNotificationDraft) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

const NotificationForm: React.FC<Props> = ({
  initial,
  onSave,
  onCancel,
  isLoading,
  onDirtyChange,
}) => {
  const getDefaultExpiry = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return toDateTimeInputValue(d.toISOString());
  };

  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [contentEn, setContentEn] = useState(initial?.content_en ?? "");

  const [titleMl, setTitleMl] = useState(initial?.title_ml ?? "");
  const [contentMl, setContentMl] = useState(initial?.content_ml ?? "");

  const [category, setCategory] = useState<NotificationCategory>(
    initial?.category ?? "GENERAL"
  );
  const [isPinned, setIsPinned] = useState(initial?.isPinned ?? false);

  const initialDate = initial?.date
    ? toDateTimeInputValue(initial.date)
    : nowDateTimeInputValue();
  const [date, setDate] = useState(initialDate);

  const initialExpiry = initial?.expiresAt
    ? toDateTimeInputValue(initial.expiresAt)
    : getDefaultExpiry();
  const [expiresAt, setExpiresAt] = useState(initialExpiry);

  const [status, setStatus] = useState<NotificationStatus>(
    initial?.status ?? "DRAFT"
  );

  // Dirty check logic
  const currentValues = {
    titleEn,
    contentEn,
    titleMl,
    contentMl,
    category,
    isPinned,
    date,
    expiresAt,
    status,
  };

  const initialValues = {
    titleEn: initial?.title_en ?? "",
    contentEn: initial?.content_en ?? "",
    titleMl: initial?.title_ml ?? "",
    contentMl: initial?.content_ml ?? "",
    category: initial?.category ?? "GENERAL",
    isPinned: initial?.isPinned ?? false,
    date: initialDate,
    expiresAt: initialExpiry,
    status: initial?.status ?? "DRAFT",
  };

  const isDirty = useFormDirty(currentValues, initialValues, onDirtyChange);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title_en: titleEn,
      title_ml: titleMl,
      content_en: contentEn,
      content_ml: contentMl,
      category,
      isPinned,
      date: toUTCISO(date),
      expiresAt: toUTCISO(expiresAt),
      status,
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid } as AdminNotification);
    } else {
      onSave(payload as AdminNotificationDraft);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close this form?"
        )
      ) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleDateChange = (val: string) => {
    setDate(val);
    if (expiresAt < val) {
      const d = new Date(val);
      d.setDate(d.getDate() + 30);
      setExpiresAt(toDateTimeInputValue(d.toISOString()));
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

      <div className="space-y-8">
        {/* --- TITLE SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex gap-1">
              Notification Title (English){" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              required
              disabled={isLoading}
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
              placeholder="e.g., Important Family Update"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Notification Title (Malayalam)
            </label>
            <input
              disabled={isLoading}
              value={titleMl}
              onChange={(e) => setTitleMl(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base font-ml"
              placeholder="ഉദാ: കുടുംബ അറിയിപ്പ്"
            />
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex gap-1">
              Message (English) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              disabled={isLoading}
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={6}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all resize-none text-base"
              placeholder="What is the notification about?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Message (Malayalam)
            </label>
            <textarea
              disabled={isLoading}
              value={contentMl}
              onChange={(e) => setContentMl(e.target.value)}
              rows={6}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all resize-none text-base font-ml"
              placeholder="അറിയിപ്പിന്റെ ഉള്ളടക്കം ഇവിടെ നൽകുക"
            />
          </div>
        </div>

        <div className="h-px bg-stone-200 my-2" />

        {/* Category + Pin Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Category
            </label>
            <select
              value={category}
              disabled={isLoading}
              onChange={(e) =>
                setCategory(e.target.value as NotificationCategory)
              }
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none"
            >
              <option value="GENERAL">General</option>
              <option value="MAGAZINE">Magazine</option>
              <option value="EVENT">Event</option>
              <option value="URGENT">Urgent (Red Alert)</option>
            </select>
          </div>

          <div className="flex items-center md:pt-6">
            <label className="pl-2 sm:pl-0 flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isPinned}
                disabled={isLoading}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-8 h-8 rounded border-stone-300 text-amber-600 focus:ring-amber-600 transition-all"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 group-hover:text-amber-800 transition-colors">
                Pin notification to top of the board
              </span>
            </label>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Publish Date & Time
            </label>
            <input
              required
              disabled={isLoading}
              type="datetime-local"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Archive After (Expiry)
            </label>
            <input
              required
              disabled={isLoading}
              type="datetime-local"
              value={expiresAt}
              min={date}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            />
          </div>
        </div>

        {/* Visibility Status */}
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
          onClick={handleCancel}
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
