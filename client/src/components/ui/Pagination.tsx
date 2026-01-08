import { ChevronLeft, ChevronRight, List } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: PaginationProps) => {
  /** Milestone Pagination Logic **/
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    let increment = 10;
    if (totalPages <= 10) increment = 3;
    else if (totalPages <= 30) increment = 5;
    else if (totalPages <= 60) increment = 10;
    else if (totalPages <= 100) increment = 20;
    else increment = 50;

    const leftNeighbor = currentPage - 1;
    const rightNeighbor = currentPage + 1;

    pages.push(1);
    for (let i = increment; i < leftNeighbor; i += increment) {
      if (i > 1 && !pages.includes(i)) pages.push(i);
    }
    const lastBeforeFocus = pages[pages.length - 1] as number;
    if (leftNeighbor > 1 && leftNeighbor - lastBeforeFocus > 1)
      pages.push("...");
    for (
      let i = Math.max(1, leftNeighbor);
      i <= Math.min(totalPages, rightNeighbor);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }
    const firstPossibleNextMilestone =
      Math.ceil((rightNeighbor + 1) / increment) * increment;
    if (
      totalPages > rightNeighbor &&
      firstPossibleNextMilestone - rightNeighbor > 1 &&
      firstPossibleNextMilestone <= totalPages
    ) {
      pages.push("...");
    }
    for (let i = firstPossibleNextMilestone; i < totalPages; i += increment) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (!pages.includes(totalPages)) {
      const lastAdded = pages[pages.length - 1];
      if (typeof lastAdded === "number" && totalPages - lastAdded > 1)
        pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-2 border-t border-stone-100">
      <div className="flex flex-row gap-4 sm:gap-6 justify-between w-full sm:w-auto">
        <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold border-r border-stone-200 pr-4">
          Total {totalItems} Items
        </p>

        <div className="flex items-center gap-2">
          <List size={14} className="text-stone-400" />
          <span className="text-xs text-stone-500 font-medium">Size:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-stone-700 outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Right Side: Page Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50  hover:text-amber-700 hover:cursor-pointer hover:border-amber-700 disabled:opacity-30 transition-all active:scale-90"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) => (
            <button
              key={idx}
              disabled={pageNum === "..." || isLoading}
              onClick={() =>
                typeof pageNum === "number" && onPageChange(pageNum)
              }
              className={`min-w-9 h-9 px-2 rounded-lg text-xs font-bold transition-all ${
                pageNum === currentPage
                  ? "bg-amber-700 text-white shadow-md shadow-amber-900/10"
                  : pageNum === "..."
                  ? "text-stone-400 cursor-default"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-amber-700 hover:text-amber-700 hover:cursor-pointer"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 hover:cursor-pointer disabled:opacity-30 transition-all active:scale-90"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
