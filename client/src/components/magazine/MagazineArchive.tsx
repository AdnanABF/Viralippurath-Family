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
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-stone-800 uppercase tracking-[0.2em] text-[10px]">
          {t("family_magazines")}
        </h3>
        <span className="text-[10px] text-stone-400 font-medium">
          {issues.length} {t("issues_available")}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
        {issues.map((issue, index) => {
          const displayTitle = getLocalized(issue, "title", i18n.language);
          const displayDate = formatDate(issue.publishedDate);
          const isSelected = selectedId === issue.uuid;

          // Cloudinary Transformation: First page of PDF to JPG thumbnail
          const thumbnail = issue.pdfUrl?.replace(/\.pdf$/, ".jpg");

          return (
            <button
              key={issue.uuid}
              onClick={() => onSelect(issue)}
              className={`group flex flex-col lg:flex-row gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl border text-left transition-all duration-300 active:scale-[0.98] ${
                isSelected
                  ? "bg-white border-stone-200 lg:border-amber-600 lg:shadow-md lg:ring-4 lg:ring-amber-50"
                  : "bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300 hover:shadow-sm"
              }`}
            >
              {/* Cover Image Container */}
              <div className="relative shrink-0 mx-auto lg:mx-0">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={displayTitle}
                    className="w-full lg:w-16 aspect-3/4 lg:h-20 object-cover rounded-lg shadow-sm bg-stone-100 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full lg:w-16 aspect-3/4 lg:h-20 bg-stone-200 rounded-lg flex items-center justify-center">
                    <span className="text-[8px] lg:text-[10px] text-stone-400 uppercase text-center px-1">
                      {t("no_cover")}
                    </span>
                  </div>
                )}

                {/* Latest Badge for the very first item */}
                {index === 0 && (
                  <div className="absolute -top-2 -left-2 bg-amber-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {t("latest")}
                  </div>
                )}

                {/* Selection indicator dot */}
                {isSelected && (
                  <div className="hidden lg:block absolute -top-1 -right-1 w-3 h-3 bg-amber-600 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-center min-w-0 text-center lg:text-left">
                <h4
                  className={`font-bold text-xs lg:text-sm leading-tight mb-1 line-clamp-2 lg:truncate transition-colors ${
                    isSelected ? "text-amber-900" : "text-stone-800"
                  }`}
                >
                  {displayTitle}
                </h4>
                <p className="text-[10px] lg:text-[11px] font-medium text-stone-500 uppercase tracking-wide">
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
