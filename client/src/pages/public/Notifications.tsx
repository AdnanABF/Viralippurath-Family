import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "../../services/public.service";
import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationsSection from "../../components/notifications/NotificationsSection";
import type { PublicNotification } from "../../types/notification.public";
import { AdminLoading, AdminError } from "../../components/ui";

const Notifications = () => {
  // 1. Fetch Notifications Data
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PublicNotification[]>({
    queryKey: ["public-notifications"],
    queryFn: publicService.getNotifications,
  });

  // 2. Memoize filtered lists to avoid re-calculation on every render
  const { highPriority, normalPriority } = useMemo(() => {
    return {
      highPriority: notifications.filter((n) => n.priority === "HIGH"),
      normalPriority: notifications.filter((n) => n.priority === "NORMAL"),
    };
  }, [notifications]);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationsHeader />

        {isError ? (
          <AdminError
            title="Unable to load notifications"
            message="Please check back later for the latest family updates."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {isLoading ? (
              <AdminLoading message="Loading updates..." />
            ) : notifications.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-500 italic">
                  No family updates at this time.
                </p>
              </div>
            ) : (
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
