import { useTranslation } from "react-i18next";
import type { PublicMagazine } from "../../types/magazine.public";
import { formatDate } from "../../utils/date";
import { getLocalized } from "../../utils/lang.utils";

interface Props {
  issues: PublicMagazine[];
  selectedId?: string;
  onSelect: (issue: PublicMagazine) => void;
}

const MagazineArchive: React.FC<Props> = ({ issues, selectedId, onSelect }) => {
  const { t, i18n } = useTranslation("magazine");

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-stone-800 uppercase tracking-[0.2em] text-[10px]">
        {t("family_magazines")}
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {issues.map((issue) => {
          const displayTitle = getLocalized(issue, "title", i18n.language);
          const displayDate = formatDate(issue.publishedDate);

          // Cloudinary Transformation: First page of PDF to JPG thumbnail
          const thumbnail = issue.pdfUrl?.replace(/\.pdf$/, ".jpg");

          return (
            <button
              key={issue.uuid}
              onClick={() => onSelect(issue)}
              className={`flex gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                selectedId === issue.uuid
                  ? "bg-white border-amber-600 shadow-md ring-4 ring-amber-50"
                  : "bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300"
              }`}
            >
              <div className="relative shrink-0">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={displayTitle}
                    className="w-16 h-20 object-cover rounded-lg shadow-sm bg-stone-100"
                  />
                ) : (
                  <div className="w-16 h-20 bg-stone-200 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] text-stone-400 uppercase">
                      {t("no_cover")}
                    </span>
                  </div>
                )}

                {/* Visual indicator for current selection */}
                {selectedId === issue.uuid && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-600 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <h4
                  className={`font-bold text-sm leading-tight mb-1 truncate transition-colors ${
                    selectedId === issue.uuid
                      ? "text-amber-900"
                      : "text-stone-800"
                  }`}
                >
                  {displayTitle}
                </h4>
                <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">
                  {displayDate}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MagazineArchive;
