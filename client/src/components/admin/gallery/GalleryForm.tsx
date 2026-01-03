import { useState } from "react";
import type {
  AdminGalleryItem,
  AdminGalleryDraft,
  GalleryStatus,
} from "../../../types/gallery.admin";

interface Props {
  initial?: AdminGalleryItem;
  onSave: (data: AdminGalleryItem | AdminGalleryDraft) => void;
  onCancel: () => void;
}

const GalleryForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [album, setAlbum] = useState(initial?.album ?? "");
  const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
  const [status, setStatus] = useState<GalleryStatus>(
    initial?.status ?? "DRAFT"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      imageUrl,
      caption,
      album,
      year,
      status,
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid } as AdminGalleryItem);
    } else {
      onSave(payload as AdminGalleryDraft);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-xl font-serif text-stone-800">
        {initial?.uuid ? "Edit Gallery Image" : "Add New Gallery Image"}
      </h2>

      {/* Image Preview */}
      {imageUrl && (
        <div className="relative w-full h-48 bg-stone-200 rounded-lg overflow-hidden border border-stone-300 shadow-inner">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/600x400?text=Invalid+Image+URL")
            }
          />
        </div>
      )}

      {/* Image URL */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Image URL
        </label>
        <input
          required
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          placeholder="https://example.com/family-photo.jpg"
        />
      </div>

      {/* Caption */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">Caption</label>
        <input
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          placeholder="e.g., Grandparents at the summer cottage"
        />
      </div>

      {/* Album + Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Album Name
          </label>
          <input
            required
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            placeholder="e.g., Annual Meet, Childhood"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">Year</label>
          <input
            required
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            min={1800}
            max={new Date().getFullYear() + 1}
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
          onChange={(e) => setStatus(e.target.value as GalleryStatus)}
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
          {initial?.uuid ? "Update Image" : "Save to Gallery"}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm;
