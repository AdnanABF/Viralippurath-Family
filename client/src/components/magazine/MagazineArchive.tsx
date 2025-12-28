import type { MagazineIssue } from "../../types/magazine";

interface Props {
  issues: MagazineIssue[];
  selectedId?: string;
  onSelect: (issue: MagazineIssue) => void;
}

const MagazineArchive: React.FC<Props> = ({ issues, selectedId, onSelect }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-stone-800 uppercase tracking-widest text-xs">
        Previous Issues
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {issues.map((issue) => (
          <button
            key={issue.id}
            onClick={() => onSelect(issue)}
            className={`flex gap-4 p-4 rounded-xl border text-left transition-all ${
              selectedId === issue.id
                ? "bg-white border-amber-700 shadow-md ring-2 ring-amber-50"
                : "bg-stone-50 border-stone-200 hover:bg-white"
            }`}
          >
            <img
              src={issue.thumbnail}
              alt={issue.title}
              className="w-16 h-20 object-cover rounded-md shadow-sm"
            />
            <div>
              <h4 className="font-bold text-sm text-stone-800 leading-tight mb-1">
                {issue.title}
              </h4>
              <p className="text-xs text-stone-500">{issue.year}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MagazineArchive;
