import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  showNavButtons?: boolean;
}

const FilterPills = <T extends string>({
  options,
  activeId,
  onSelect,
  className = "",
  buttonClassName = "",
  showNavButtons = false,
}: Props<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const updateArrows = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Use a small buffer (5px) to account for sub-pixel rendering
      setShowLeftBtn(scrollLeft > 5);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (scrollArea) {
      updateArrows();
      scrollArea.addEventListener("scroll", updateArrows, { passive: true });
      window.addEventListener("resize", updateArrows);

      const timer = setTimeout(updateArrows, 100);

      return () => {
        scrollArea.removeEventListener("scroll", updateArrows);
        window.removeEventListener("resize", updateArrows);
        clearTimeout(timer);
      };
    }
  }, [updateArrows, options]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Logic: Only show buttons on desktop if explicitly enabled via prop
  const shouldRenderLeft = showNavButtons && showLeftBtn;
  const shouldRenderRight = showNavButtons && showRightBtn;

  return (
    <div className="relative group/pills w-full">
      {/* Left Navigation Gradient and Button - Desktop Only */}
      {shouldRenderLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-20 items-center pl-1 bg-linear-to-r from-white via-white/80 to-transparent pr-12 pointer-events-none hidden md:flex">
          <button
            onClick={() => handleScroll("left")}
            className="p-1.5 bg-white shadow-md border border-stone-200 rounded-full text-stone-600 hover:text-amber-800 transition-all pointer-events-auto active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      )}

      {/* Right Navigation Gradient and Button - Desktop Only */}
      {shouldRenderRight && (
        <div className="absolute right-0 top-0 bottom-0 z-20 items-center pr-1 bg-linear-to-l from-white via-white/80 to-transparent pl-12 pointer-events-none hidden md:flex">
          <button
            onClick={() => handleScroll("right")}
            className="p-1.5 bg-white shadow-md border border-stone-200 rounded-full text-stone-600 hover:text-amber-800 transition-all pointer-events-auto active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className={`
          py-4 backdrop-blur-md
          -mx-4 px-4 sm:mx-0 sm:px-0 
          overflow-x-auto no-scrollbar scroll-smooth
          ${className}
        `}
      >
        <div className="flex flex-nowrap sm:justify-center items-center gap-2 min-w-max pb-1">
          {options.map((option) => {
            const isActive = activeId === option.id;
            const isDisabled = option.count === 0;

            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                disabled={isDisabled}
                className={`
                  flex items-center gap-2 whitespace-nowrap shrink-0 
                  rounded-full px-5 py-2 text-sm border transition-all active:scale-95 
                  ${buttonClassName}
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
      </div>
    </div>
  );
};

export default FilterPills;
