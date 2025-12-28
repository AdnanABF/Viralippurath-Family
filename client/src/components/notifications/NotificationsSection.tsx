import type { Notification } from "../../types/notification";
import NotificationItem from "./NotificationItem";

interface Props {
  title: string;
  notifications: Notification[];
}

const NotificationsSection: React.FC<Props> = ({ title, notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-stone-800 uppercase tracking-wider">
        {title}
      </h2>

      <div className="space-y-4">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </section>
  );
};

export default NotificationsSection;
