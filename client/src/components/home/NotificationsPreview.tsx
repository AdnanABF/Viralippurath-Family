import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "../../services/public.service";
import NotificationItem from "../notifications/NotificationItem";
import { useTranslation } from "react-i18next";
import type { PublicNotification } from "../../types/notification.public";

const NotificationsPreview = () => {
  const { t } = useTranslation("home");

  const { data: notifications, isLoading } = useQuery<PublicNotification[]>({
    queryKey: ["notifications", "latest"],
    queryFn: () => publicService.getLatestNotifications(),
    staleTime: 1000 * 60 * 2,
  });

  // 1. Loading State
  if (isLoading) {
    return (
      <section className="py-16 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-500 italic">
          {t("latest_updates.loading")}
        </div>
      </section>
    );
  }

  // 2. Empty State - Hide section if no notifications are returned
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-stone-50 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-serif text-stone-900">
              {t("latest_updates.title")}
            </h2>
            <p className="text-stone-500">{t("latest_updates.sub_title")}</p>
          </div>

          <Link
            to="/notifications"
            className="text-amber-700 font-semibold hover:underline"
          >
            {t("latest_updates.view_all")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notifications.map((notif) => (
            <NotificationItem key={notif.uuid} notification={notif} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotificationsPreview;
