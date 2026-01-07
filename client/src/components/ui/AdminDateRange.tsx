import { Calendar } from "lucide-react";

const AdminDateRange = ({
  start,
  end,
  onStartChange,
  onEndChange,
}: {
  start: string;
  end: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}) => (
  <div className="relative w-full md:w-auto flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm">
    <Calendar size={14} className="text-stone-400" />
    <span className="text-xs font-medium text-stone-500">From:</span>
    <input
      type="date"
      value={start}
      onChange={(e) => onStartChange(e.target.value)}
      className="text-xs font-bold text-stone-700 outline-none bg-transparent"
    />
    <span className="text-stone-300 mx-1">|</span>
    <span className="text-xs font-medium text-stone-500">To:</span>
    <input
      type="date"
      value={end}
      onChange={(e) => onEndChange(e.target.value)}
      className="text-xs font-bold text-stone-700 outline-none bg-transparent"
    />
  </div>
);
export default AdminDateRange;
