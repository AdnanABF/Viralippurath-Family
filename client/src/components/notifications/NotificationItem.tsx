import type { PublicNotification } from "../../types/notification.public";

interface Props {
  notification: PublicNotification;
}

const NotificationItem: React.FC<Props> = ({ notification }) => {
  const formattedDate = new Date(notification.date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
            notification.priority === "HIGH"
              ? "bg-red-100 text-red-700"
              : "bg-stone-100 text-stone-700"
          }`}
        >
          {notification.priority}
        </span>
        <span className="text-xs text-stone-400">{formattedDate}</span>
      </div>

      <h3 className="text-lg font-bold text-stone-800 mb-2">
        {notification.title}
      </h3>

      <p className="text-stone-600 text-sm leading-relaxed">
        {notification.content}
      </p>
    </div>
  );
};

export default NotificationItem;
