import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationsSection from "../../components/notifications/NotificationsSection";
import { notifications } from "../../components/notifications/notifications.mock";

const Notifications = () => {
  const highPriority = notifications.filter((n) => n.priority === "HIGH");
  const normalPriority = notifications.filter((n) => n.priority === "NORMAL");

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationsHeader />

        <div className="space-y-16">
          <NotificationsSection
            title="High Priority"
            notifications={highPriority}
          />
          <NotificationsSection
            title="Other Updates"
            notifications={normalPriority}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
