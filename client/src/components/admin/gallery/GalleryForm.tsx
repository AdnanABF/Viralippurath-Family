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

  const handleSubmit = () => {
    const payload = {
      imageUrl,
      caption,
      album,
      year,
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
        {initial ? "Edit Gallery Image" : "Add Gallery Image"}
      </h2>

      {/* Image URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Image URL</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Caption */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Caption</label>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          placeholder="Short caption for the image"
        />
      </div>

      {/* Album + Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Album</label>
          <input
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            placeholder="Annual Meet, Weddings, Childhood…"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            min={1900}
            max={2100}
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as GalleryStatus)}
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
          Save Image
        </button>
      </div>
    </div>
  );
};

export default GalleryForm;
