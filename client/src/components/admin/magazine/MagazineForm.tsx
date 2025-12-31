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
  const [title, setTitle] = useState(initial?.title ?? "");
  const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
  const [coverImageUrl, setCoverImageUrl] = useState(
    initial?.coverImageUrl ?? ""
  );
  const [flipbookUrl, setFlipbookUrl] = useState(initial?.flipbookUrl ?? "");
  const [downloadUrl, setDownloadUrl] = useState(initial?.downloadUrl ?? "");
  const [status, setStatus] = useState<MagazineStatus>(
    initial?.status ?? "DRAFT"
  );

  const handleSubmit = () => {
    const payload = {
      title,
      year,
      coverImageUrl: coverImageUrl || undefined,
      flipbookUrl,
      downloadUrl: downloadUrl || undefined,
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
        {initial ? "Edit Magazine" : "Create New Magazine"}
      </h2>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Magazine title"
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20
                     focus:border-amber-600"
        />
      </div>

      {/* Year */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20
                     focus:border-amber-600"
        />
      </div>

      {/* URLs */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">
          Cover Image URL
        </label>
        <input
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20
                     focus:border-amber-600"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">
          Flipbook URL
        </label>
        <input
          value={flipbookUrl}
          onChange={(e) => setFlipbookUrl(e.target.value)}
          placeholder="https://..."
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20
                     focus:border-amber-600"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">
          Download PDF URL
        </label>
        <input
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
          placeholder="https://..."
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20
                     focus:border-amber-600"
        />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as MagazineStatus)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20
                     focus:border-amber-600"
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
          Save Magazine
        </button>
      </div>
    </div>
  );
};

export default MagazineForm;
