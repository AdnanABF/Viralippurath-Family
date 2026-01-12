import React from "react";

export interface ColumnConfig<T> {
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface TableGridProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  gridTemplate: string;
  keyExtractor: (item: T) => string;
  renderMobileCard: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyStateLabel?: string;
  mobileClassName?: string;
}

const TableGrid = <T,>({
  data,
  columns,
  gridTemplate,
  keyExtractor,
  renderMobileCard,
  onRowClick,
  isLoading = false,
  emptyStateLabel = "No records found",
  mobileClassName = "grid grid-cols-1 gap-4 lg:hidden",
}: TableGridProps<T>) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white border border-stone-200 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-700/30 border-t-amber-700"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center bg-white border border-stone-200 rounded-lg text-stone-400">
        <p className="font-medium text-sm italic">{emptyStateLabel}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* --- MOBILE VIEW: Card Stack --- */}
      <div className={mobileClassName}>
        {data.map((item) => (
          <div key={keyExtractor(item)}>{renderMobileCard(item)}</div>
        ))}
      </div>

      {/* --- DESKTOP VIEW: Pure Tailwind Grid --- */}
      <div className="hidden lg:block w-full bg-white border border-stone-200 overflow-hidden">
        {/* Header Row */}
        <div
          className={`grid bg-stone-50 border-b border-stone-200 ${gridTemplate}`}
        >
          {columns.map((col, idx) => (
            <div
              key={idx}
              className={`p-4 text-xs font-bold text-stone-600 uppercase tracking-widest ${
                col.className || ""
              }`}
            >
              {col.header}
            </div>
          ))}
        </div>

        {/* Body Rows */}
        <div className="divide-y divide-stone-100">
          {data.map((item) => (
            <div
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`grid transition-all duration-200 ${gridTemplate} ${
                onRowClick
                  ? "cursor-pointer hover:bg-amber-50/40 active:bg-amber-100/50"
                  : "hover:bg-stone-50/50"
              }`}
            >
              {columns.map((col, idx) => (
                <div
                  key={idx}
                  className={`p-4 flex items-center overflow-hidden text-stone-700 ${
                    col.className || ""
                  }`}
                >
                  {col.render(item)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableGrid;
