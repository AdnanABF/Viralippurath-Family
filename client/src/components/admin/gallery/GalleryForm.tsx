import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import type {
  AdminGalleryItem,
  GalleryStatus,
} from "../../../types/gallery.admin";

interface Props {
  initial?: AdminGalleryItem;
  onSave: (formData: FormData) => Promise<void>;
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

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(initial?.imageUrl ?? null);
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
      className="bg-white sm:bg-stone-50 border-x-0 sm:border border-stone-200 sm:rounded-2xl pt-0 p-4 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-white sm:bg-stone-50 pt-4 pb-4 sm:pt-0 z-10 border-b border-stone-100 flex items-center justify-between">
        <h2 className="text-xl font-serif text-stone-800">
          {initial?.uuid ? "Edit Image" : "Add to Gallery"}
        </h2>
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-700/30 border-t-amber-700"></div>
        )}
      </div>

      {/* Image Upload Area */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Image Content
        </label>

        <div
          className={`relative group w-full aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
          ${
            previewUrl
              ? "border-stone-200 bg-stone-100"
              : "border-stone-300 bg-stone-50 hover:bg-stone-100"
          }`}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              {!isLoading && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full shadow-lg active:scale-90 transition-transform"
                >
                  <X size={18} />
                </button>
              )}
            </>
          ) : (
            <div className="text-center p-6">
              <div className="mx-auto w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-500 mb-3">
                <Upload size={24} />
              </div>
              <p className="text-sm font-medium text-stone-600">
                Tap to upload photo
              </p>
              <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          )}

          <input
            type="file"
            required={!initial?.uuid}
            disabled={isLoading}
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* Caption */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Caption
          </label>
          <input
            required
            disabled={isLoading}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            placeholder="Describe this moment..."
          />
        </div>

        {/* Album + Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Album Name
            </label>
            <input
              required
              disabled={isLoading}
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
              placeholder="e.g., Family Meet 2024"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Year
            </label>
            <input
              required
              disabled={isLoading}
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Visibility
          </label>
          <select
            value={status}
            disabled={isLoading}
            onChange={(e) => setStatus(e.target.value as GalleryStatus)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl text-base appearance-none focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          >
            <option value="DRAFT">Draft (Hidden)</option>
            <option value="PUBLISHED">Published (Public)</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-stone-200">
        <button
          type="button"
          disabled={isLoading}
          onClick={onCancel}
          className="order-2 sm:order-1 px-6 py-3 rounded-xl text-stone-600 border border-stone-300 font-medium
           hover:bg-stone-100 disabled:bg-stone-400 transition disabled:text-white disabled:opacity-50 
           focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="order-1 sm:order-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-700 text-white
           hover:bg-amber-800 transition font-bold shadow-lg shadow-amber-900/20 active:scale-[0.98] disabled:bg-stone-400 flex items-center justify-center gap-2 
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
            <span>{initial?.uuid ? "Update Image" : "Save to Gallery"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm;
