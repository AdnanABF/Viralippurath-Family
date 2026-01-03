import { useEffect, useState } from "react";
import api from "../../services/api";
import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationsSection from "../../components/notifications/NotificationsSection";
import type { PublicNotification } from "../../types/notification.public";

const Notifications = () => {
  const [notifications, setNotifications] = useState<PublicNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get<PublicNotification[]>(
          "/notifications/published"
        );
        setNotifications(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const highPriority = notifications.filter((n) => n.priority === "HIGH");
  const normalPriority = notifications.filter((n) => n.priority === "NORMAL");

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationsHeader />

        {error ? (
          /* Error State - Matching Gallery Pattern */
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200 shadow-sm">
            <h3 className="text-stone-800 font-serif text-xl mb-2">
              Unable to load notifications
            </h3>
            <p className="text-stone-500">
              Please check back later for the latest family updates.
            </p>
          </div>
        ) : (
          <>
            {loading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
                <p className="mt-4 text-stone-500 font-medium">
                  Loading updates...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-500 italic">
                  No family updates at this time.
                </p>
              </div>
            ) : (
              /* Content State */
              <div className="space-y-16">
                {highPriority.length > 0 && (
                  <NotificationsSection
                    title="High Priority"
                    notifications={highPriority}
                  />
                )}

                {normalPriority.length > 0 && (
                  <NotificationsSection
                    title="Other Updates"
                    notifications={normalPriority}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
