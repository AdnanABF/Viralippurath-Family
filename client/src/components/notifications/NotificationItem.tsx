import { useState } from "react";
import {
  Pin,
  BookOpen,
  Calendar,
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronUp,
  OctagonAlert,
} from "lucide-react";
import type {
  PublicNotification,
  NotificationCategory,
} from "../../types/notification.public";
import { formatDate } from "../../utils/date";

interface Props {
  notification: PublicNotification;
}

const NotificationItem: React.FC<Props> = ({ notification }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = formatDate(notification.date);

  const isUrgent = notification.category === "URGENT";
  const isPinned = notification.isPinned;

  const containerStyles = () => {
    if (isPinned) {
      return "bg-amber-50/40 border-amber-200 shadow-sm ring-1 ring-amber-100";
    }
    if (isUrgent) {
      return "bg-rose-50/30 border-rose-200 shadow-sm ring-1 ring-rose-50";
    }
    return "bg-white border-stone-200 shadow-sm";
  };

  const titleStyles = () => {
    if (isPinned) return "text-amber-950";
    if (isUrgent) return "text-rose-950";
    return "text-stone-900 group-hover:text-amber-900";
  };

  // Helper for Category Styling
  const getCategoryMeta = (cat: NotificationCategory) => {
    switch (cat) {
      case "MAGAZINE":
        return {
          icon: <BookOpen size={14} />,
          label: "Magazine",
          color: "text-blue-600",
          bg: "bg-blue-50",
        };
      case "EVENT":
        return {
          icon: <Calendar size={14} />,
          label: "Event",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        };
      case "URGENT":
        return {
          icon: <AlertTriangle size={14} />,
          label: "Urgent",
          color: "text-amber-600",
          bg: "bg-amber-50",
        };
      default:
        return {
          icon: <Bell size={14} />,
          label: "General",
          color: "text-stone-500",
          bg: "bg-stone-50",
        };
    }
  };

  const meta = getCategoryMeta(notification.category);
  const isLongContent = notification.content.length > 280;

  return (
    <div
      className={`relative group p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${containerStyles()}`}
    >
      {/* Pinned or Urgent Indicator */}
      <div className="absolute -top-3 left-6 flex gap-2">
        {isPinned && (
          <div className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Pin size={14} />
            PINNED
          </div>
        )}
        {isUrgent && (
          <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <OctagonAlert size={14} />
            URGENT
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {/* Category Badge - hidden if Urgent because the top badge covers it */}
          {!isUrgent && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.color}`}
            >
              {meta.icon}
              {meta.label}
            </div>
          )}
        </div>

        {/* Date Stamp */}
        <span className="text-xs font-medium text-stone-400">
          {formattedDate}
        </span>
      </div>

      {/* Content Section */}
      <div className="space-y-3">
        <h3
          className={`text-xl font-serif leading-tight transition-colors ${titleStyles()}`}
        >
          {notification.title}
        </h3>

        <div className="relative">
          <p
            className={`text-stone-600 text-sm leading-[1.6] whitespace-pre-wrap transition-all duration-500 ${
              !isExpanded && isLongContent ? "line-clamp-3 overflow-hidden" : ""
            }`}
          >
            {notification.content}
          </p>

          {/* Read More Toggle */}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors uppercase tracking-widest cursor-pointer"
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Read Full Message <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
