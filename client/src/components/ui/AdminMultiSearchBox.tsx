import { Search } from "lucide-react";

const AdminMultiSearch = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => (
  <div className="relative w-full md:w-64">
    <Search
      size={14}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
    />
    <input
      type="text"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 outline-none transition-all shadow-sm"
    />
  </div>
);

export default AdminMultiSearch;
