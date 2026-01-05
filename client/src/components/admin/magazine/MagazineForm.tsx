import { useState } from "react";
import type {
  AdminMagazine,
  AdminMagazineDraft,
  MagazineStatus,
} from "../../../types/magazine.admin";

interface Props {
  initial?: AdminMagazine;
  onSave: (data: any) => void; // Using any here to handle the union of Draft + File
  onCancel: () => void;
  isLoading?: boolean;
}

const MagazineForm: React.FC<Props> = ({
  initial,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [publishedDate, setPublishedDate] = useState(
    initial?.publishedDate
      ? new Date(initial.publishedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<MagazineStatus>(
    initial?.status ?? "DRAFT"
  );

  // New state for the PDF file
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      title,
      publishedDate: new Date(publishedDate).toISOString(),
      status,
      file: file || undefined, // Include file if selected
    };

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid });
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
          disabled={isLoading}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., The Family Chronicle - Summer Edition"
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        />
      </div>

      {/* Date */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Publication Date
        </label>
        <input
          required
          disabled={isLoading}
          type="date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        />
      </div>

      {/* PDF File Upload */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Magazine PDF{" "}
          {initial?.uuid ? "(Leave empty to keep current)" : "(Required)"}
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            required={!initial?.uuid}
            disabled={isLoading}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100
                       border border-stone-300 rounded-lg bg-white p-1"
          />
        </div>
        {initial?.pdfUrl && !file && (
          <p className="text-xs text-stone-500 mt-1">
            Current file: {initial.title}.pdf
          </p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Visibility Status
        </label>
        <select
          value={status}
          disabled={isLoading}
          onChange={(e) => setStatus(e.target.value as MagazineStatus)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
        >
          <option value="DRAFT">Draft (Hidden)</option>
          <option value="PUBLISHED">Published (Visible)</option>
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
            <span>{initial?.uuid ? "Update Magazine" : "Create Magazine"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default MagazineForm;
