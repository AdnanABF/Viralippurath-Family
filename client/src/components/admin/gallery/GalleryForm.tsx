import { useState, useEffect } from "react";
import type {
  AdminGalleryItem,
  GalleryStatus,
} from "../../../types/gallery.admin";

interface Props {
  initial?: AdminGalleryItem;
  onSave: (formData: FormData) => Promise<void>; // Changed to accept FormData
  onCancel: () => void;
  isLoading?: boolean;
}

const GalleryForm: React.FC<Props> = ({
  initial,
  onSave,
  onCancel,
  isLoading,
}) => {
  // Local state for the physical file and the UI preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initial?.imageUrl ?? null
  );
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [album, setAlbum] = useState(initial?.album ?? "");
  const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
  const [status, setStatus] = useState<GalleryStatus>(
    initial?.status ?? "DRAFT"
  );

  // Clean up the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && !initial?.imageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initial?.imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData to send binary file + text fields
    const formData = new FormData();

    // Add the file (the key 'image' must match FileInterceptor('image') in NestJS)
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    // Add other fields
    formData.append("caption", caption);
    formData.append("album", album);
    formData.append("year", year.toString());
    formData.append("status", status);

    await onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-xl font-serif text-stone-800">
        {initial?.uuid ? "Edit Gallery Image" : "Add New Gallery Image"}
      </h2>

      {/* Image Preview Area */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-700">
          Image Preview
        </label>
        <div className="relative w-full h-56 bg-stone-200 rounded-lg overflow-hidden border-2 border-dashed border-stone-300 flex items-center justify-center shadow-inner">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-stone-400 text-sm">No image selected</div>
          )}
        </div>
      </div>

      {/* File Selection */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          {initial?.uuid ? "Change Image (Optional)" : "Select Image"}
        </label>
        <input
          required={!initial?.uuid} // Only required for new uploads
          disabled={isLoading}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-stone-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-amber-50 file:text-amber-700
            hover:file:bg-amber-100 transition-all"
        />
      </div>

      {/* Caption */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">Caption</label>
        <input
          required
          disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
          disabled={isLoading}
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
              {/* Ensure the spinner is a span or has inline-block properties */}
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              </span>
              <span>{initial?.uuid ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <span>{initial?.uuid ? "Update Image" : "Save to Gallery"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm;
