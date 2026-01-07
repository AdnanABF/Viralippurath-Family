import { Filter } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

interface AdminSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode; // Custom icon slot
  selectClassName?: string; // Optional: in case you need to override the width
  parentClassName?: string; // Optional: in case you need to override the parent width
}

const AdminSelect = ({
  value,
  onChange,
  options,
  icon = <Filter size={14} />, // Default icon
  selectClassName = "md:w-32",
  parentClassName = "",
}: AdminSelectProps) => (
  <div className={`relative w-full ${parentClassName}`}>
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
      {icon}
    </div>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full ${selectClassName} 
        pl-9 pr-3 py-2 
        bg-white border border-stone-200 rounded-lg 
        text-sm text-stone-700 font-medium
        outline-none appearance-none shadow-sm 
        focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700
        transition-all cursor-pointer`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default AdminSelect;
