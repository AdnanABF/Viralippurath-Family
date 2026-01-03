import type { PublicMagazine } from "../../types/magazine.public";
import { formatDate } from "../../utils/date";

interface Props {
  issues: PublicMagazine[];
  selectedId?: string; // This will receive the uuid from the parent
  onSelect: (issue: PublicMagazine) => void;
}

const MagazineArchive: React.FC<Props> = ({ issues, selectedId, onSelect }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-stone-800 uppercase tracking-[0.2em] text-[10px]">
        Family Archives
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {issues.map((issue) => {
          const displayDate = formatDate(issue.publishedDate);

          return (
            <button
              key={issue.uuid} // Changed from id to uuid
              onClick={() => onSelect(issue)}
              className={`flex gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                selectedId === issue.uuid // Changed from id to uuid
                  ? "bg-white border-amber-600 shadow-md ring-4 ring-amber-50"
                  : "bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300"
              }`}
            >
              {issue.coverImageUrl ? (
                <img
                  src={issue.coverImageUrl}
                  alt={issue.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-16 h-20 bg-stone-200 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-stone-400 uppercase">
                    No Cover
                  </span>
                </div>
              )}

              <div className="flex flex-col justify-center">
                <h4
                  className={`font-bold text-sm leading-tight mb-1 transition-colors ${
                    selectedId === issue.uuid
                      ? "text-amber-900"
                      : "text-stone-800"
                  }`}
                >
                  {issue.title}
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
