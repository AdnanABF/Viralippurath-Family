import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { publicService } from "../../services/public.service";
import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationItem from "../../components/notifications/NotificationItem";
import type {
  PublicNotification,
  NotificationCategory,
} from "../../types/notification.public";
import { AdminLoading, AdminError } from "../../components/ui";

const Notifications = () => {
  const { t } = useTranslation("notifications");

  const [activeCategory, setActiveCategory] = useState<
    NotificationCategory | "ALL"
  >("ALL");
  const [showArchived, setShowArchived] = useState(false);

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PublicNotification[]>({
    queryKey: ["public-notifications", activeCategory, showArchived],
    queryFn: () =>
      publicService.getNotifications({
        category: activeCategory === "ALL" ? undefined : activeCategory,
        archived: showArchived,
      }),
  });

  const categories: { label: string; value: NotificationCategory | "ALL" }[] = [
    { label: t("categories.all"), value: "ALL" },
    { label: t("categories.urgent"), value: "URGENT" },
    { label: t("categories.general"), value: "GENERAL" },
    { label: t("categories.magazines"), value: "MAGAZINE" },
    { label: t("categories.events"), value: "EVENT" },
  ];

  return (
    <div className="py-20 bg-stone-50 min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationsHeader />

        {/* --- Filter Bar --- */}
        <div className="mt-8 sm:mb-12 mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3.5 sm:px-5 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 cursor-pointer ${
                  activeCategory === cat.value
                    ? "bg-amber-800 text-white shadow-md shadow-amber-900/20"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Archive Toggle */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
              showArchived
                ? "text-amber-900 bg-amber-100 ring-1 ring-amber-200"
                : "text-stone-500 hover:text-stone-800 bg-stone-100 hover:ring-1 hover:ring-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                showArchived ? "bg-amber-600 animate-pulse" : "bg-stone-300"
              }`}
            />
            {showArchived
              ? t("hide_old")
              : t("show_old")}
          </button>
        </div>

        {isError ? (
          <AdminError
            title={t("error_title")}
            message={t("error_message")}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {isLoading ? (
              <AdminLoading message="Opening the notice board..." />
            ) : notifications.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm border-dashed">
                <p className="text-stone-400 font-medium">
                  {showArchived
                    ? t("empty_archive")
                    : t("no_notices")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.uuid}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
