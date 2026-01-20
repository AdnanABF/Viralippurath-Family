import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import type {
  AdminMagazine,
  AdminMagazineDraft,
  MagazineStatus,
} from "../../../types/magazine.admin";
import { PrimaryButton, SecondaryButton } from "../../ui";

interface Props {
  initial?: AdminMagazine;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MagazineForm: React.FC<Props> = ({
  initial,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [titleMl, setTitleMl] = useState(initial?.title_ml ?? "");

  const [publishedDate, setPublishedDate] = useState(
    initial?.publishedDate
      ? new Date(initial.publishedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<MagazineStatus>(
    initial?.status ?? "DRAFT"
  );

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      title_en: titleEn,
      title_ml: titleMl,
      publishedDate: new Date(publishedDate).toISOString(),
      status,
    };

    if (file) {
      payload.file = file;
    }

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid });
    } else {
      onSave(payload as AdminMagazineDraft);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white sm:bg-stone-50 border-x-0 sm:border border-stone-200 sm:rounded-2xl pt-0 p-4 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-white sm:bg-stone-50 pt-4 pb-4 sm:pt-0 z-10 border-b border-stone-100 mb-2">
        <h2 className="text-xl font-serif text-stone-800">
          {initial?.uuid ? "Edit Magazine Issue" : "Create New Magazine Issue"}
        </h2>
      </div>

      <div className="space-y-5">
        {/* --- TITLE SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex gap-1">
              Magazine Title (English) <span className="text-rose-500">*</span>
            </label>
            <input
              required
              disabled={isLoading}
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
              placeholder="e.g., The Family Chronicle - Summer Edition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Magazine Title (Malayalam)
            </label>
            <input
              disabled={isLoading}
              value={titleMl}
              onChange={(e) => setTitleMl(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base font-ml"
              placeholder="e.g., The Family Chronicle - Summer Edition"
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Publication Date
          </label>
          <input
            required
            disabled={isLoading}
            type="date"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
          />
        </div>

        {/* PDF File Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Magazine PDF {initial?.uuid ? "(Optional)" : "(Required)"}
          </label>

          <div
            className={`relative group border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center
            ${
              file
                ? "border-green-300 bg-green-50"
                : "border-stone-300 bg-white hover:bg-stone-50"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              required={!initial?.uuid}
              disabled={isLoading}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="text-green-600" size={32} />
                <div>
                  <p className="text-sm font-bold text-green-800 truncate max-w-50">
                    {file.name}
                  </p>
                  <p className="text-xs text-green-600">Ready to upload</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-stone-400" size={32} />
                <div>
                  <p className="text-sm font-medium text-stone-600">
                    Tap to select PDF
                  </p>
                  {initial?.pdfUrl && (
                    <p className="text-xs text-amber-700 font-medium mt-1">
                      Has existing PDF
                    </p>
                  )}
                </div>
              </div>
            )}
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
            onChange={(e) => setStatus(e.target.value as MagazineStatus)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none"
          >
            <option value="DRAFT">Draft (Hidden)</option>
            <option value="PUBLISHED">Published (Visible)</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-stone-200">
        <SecondaryButton
          variant="form"
          onClick={onCancel}
          disabled={isLoading}
          label="Cancel"
        />
        <PrimaryButton
          type="submit"
          variant="form"
          label={initial?.uuid ? "Update Magazine" : "Create Magazine"}
          isLoading={isLoading}
          loadingLabel={initial?.uuid ? "Updating..." : "Creating..."}
        />
      </div>
    </form>
  );
};

export default MagazineForm;
