import React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "amber" | "blue" | "stone" | "purple";
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  color = "stone",
}) => {
  const colorMap = {
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    stone: "bg-stone-50 text-stone-700 border-stone-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          <Icon size={20} />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-lg ${
              trend.isPositive
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp size={14} className="shrink-0" />
            ) : (
              <TrendingDown size={14} className="shrink-0" />
            )}
            <span>
              {trend.isPositive ? "+" : "-"}
              {trend.value}
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-stone-900 mt-1">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatsCard;
