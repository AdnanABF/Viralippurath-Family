export interface FilterOption<T> {
  id: T;
  label: string;
  count?: number;
}

interface Props<T> {
  options: FilterOption<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  className?: string;
  buttonClassName?: string;
}

const FilterPills = <T extends string>({
  options,
  activeId,
  onSelect,
  className = "",
  buttonClassName = "",
}: Props<T>) => {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {options.map((option) => {
        const isActive = activeId === option.id;
        const isDisabled = option.count === 0;

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={isDisabled}
            className={`
              flex items-center gap-2 rounded-full px-6 py-2 text-sm border transition-all active:scale-95 ${buttonClassName}
              ${
                isActive
                  ? "bg-amber-800 font-bold text-white border-amber-800 shadow-md shadow-amber-900/20"
                  : isDisabled
                    ? "bg-stone-50 border-stone-100 text-stone-300 cursor-not-allowed"
                    : "bg-white font-medium border-stone-200 text-stone-600 hover:border-amber-700 hover:text-amber-800"
              }
            `}
          >
            <span>{option.label}</span>

            {/* Show count badge if count is provided and > 0 */}
            {typeof option.count === "number" && option.count > 0 && (
              <span
                className={`
                  px-1.5 py-0.5 rounded-full text-[10px] min-w-4.5 text-center font-bold
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-stone-100 text-stone-500"
                  }
                `}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
