import { useState } from "react";
import type {
  AdminMagazine,
  AdminMagazineDraft,
  MagazineStatus,
} from "../../../types/magazine.admin";

interface Props {
  initial?: AdminMagazine;
  onSave: (data: AdminMagazine | AdminMagazineDraft) => void;
  onCancel: () => void;
}

const MagazineForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  // Sync state with uuid and publishedDate architecture
  const [title, setTitle] = useState(initial?.title ?? "");
  const [publishedDate, setPublishedDate] = useState(
    initial?.publishedDate
      ? new Date(initial.publishedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initial?.coverImageUrl ?? ""
  );
  const [flipbookUrl, setFlipbookUrl] = useState(initial?.flipbookUrl ?? "");
  const [downloadUrl, setDownloadUrl] = useState(initial?.downloadUrl ?? "");
  const [status, setStatus] = useState<MagazineStatus>(
    initial?.status ?? "DRAFT"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      publishedDate: new Date(publishedDate).toISOString(),
      coverImageUrl: coverImageUrl || undefined,
      flipbookUrl,
      downloadUrl: downloadUrl || undefined,
      status,
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid } as AdminMagazine);
    } else {
      onSave(payload as AdminMagazineDraft);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-xl font-serif text-stone-800">
        {initial?.uuid ? "Edit Magazine Issue" : "Create New Magazine Issue"}
      </h2>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Magazine Title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., The Family Chronicle - Summer Edition"
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        />
      </div>

      {/* Date Selection */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Publication Date
        </label>
        <input
          required
          type="date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        />
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Cover Image URL
          </label>
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://cloudinary.com/..."
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Flipbook URL (Required)
          </label>
          <input
            required
            value={flipbookUrl}
            onChange={(e) => setFlipbookUrl(e.target.value)}
            placeholder="https://heyzine.com/..."
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Download PDF URL (Optional)
          </label>
          <input
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="Direct link to PDF file"
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
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
          onChange={(e) => setStatus(e.target.value as MagazineStatus)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        >
          <option value="DRAFT">Draft (Hidden from Archives)</option>
          <option value="PUBLISHED">Published (Visible in Archives)</option>
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
          {initial?.uuid ? "Update Issue" : "Create Issue"}
        </button>
      </div>
    </form>
  );
};

export default MagazineForm;
