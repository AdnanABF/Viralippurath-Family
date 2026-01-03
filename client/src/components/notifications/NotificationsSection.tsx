import type { PublicNotification } from "../../types/notification.public";
import NotificationItem from "./NotificationItem";

interface Props {
  title: string;
  notifications: PublicNotification[];
}

const NotificationsSection: React.FC<Props> = ({ title, notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-bold text-amber-800 uppercase tracking-[0.2em]">
        {title}
      </h2>

      {/* List of Notification Cards */}
      <div className="space-y-4">
        {notifications.map((n) => (
          <NotificationItem key={n.uuid} notification={n} />
        ))}
      </div>
    </section>
  );
};

export default NotificationsSection;
