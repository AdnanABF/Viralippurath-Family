import React from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const AdminHeader = ({
  title,
  description,
  children,
  isRefreshing,
  onRefresh,
}: AdminHeaderProps) => {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
      {/* Left Side: Identity */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-serif text-stone-900">{title}</h1>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-all active:rotate-180 disabled:opacity-50"
              title="Force Refresh"
            >
              <RefreshCw
                size={20}
                className={isRefreshing ? "animate-spin text-amber-600" : ""}
              />
            </button>
          )}

          {/* Subtle Refreshing Indicator */}
          {isRefreshing && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full animate-pulse">
              <Loader2 size={10} className="text-amber-600 animate-spin" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">
                Syncing
              </span>
            </div>
          )}
        </div>
        <p className="text-stone-500 text-sm mt-1">{description}</p>
      </div>

      {/* Right Side: Responsive Container for all Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminHeader;
