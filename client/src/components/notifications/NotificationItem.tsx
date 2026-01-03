import type { PublicNotification } from "../../types/notification.public";
import { formatDate } from "../../utils/date";

interface Props {
  notification: PublicNotification;
}

const NotificationItem: React.FC<Props> = ({ notification }) => {
  const formattedDate = formatDate(notification.date);

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-center mb-4">
        {/* Priority Badge */}
        <span
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
            notification.priority === "HIGH"
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-stone-50 text-stone-600 border-stone-100"
          }`}
        >
          {notification.priority === "HIGH" ? "Urgent Update" : "General"}
        </span>

        {/* Date Stamp */}
        <span className="text-xs font-medium text-stone-400 group-hover:text-amber-700 transition-colors">
          {formattedDate}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-amber-900 transition-colors">
        {notification.title}
      </h3>

      <p className="text-stone-600 text-sm leading-[1.6] whitespace-pre-wrap">
        {notification.content}
      </p>
    </div>
  );
};

export default NotificationItem;
