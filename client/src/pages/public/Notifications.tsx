import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { publicService } from "../../services/public.service";
import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationItem from "../../components/notifications/NotificationItem";
import type {
  PublicNotification,
  NotificationCategory,
} from "../../types/notification.public";
import {
  AdminLoading,
  AdminError,
  FilterPills,
  type FilterOption,
} from "../../components/ui";
const Notifications = () => {
  const { t } = useTranslation("notifications");

  const [activeCategory, setActiveCategory] = useState<
    NotificationCategory | "ALL"
  >("ALL");
  const [showArchived, setShowArchived] = useState(false);

  // 1. Fetch Data (Fetching all for the current archive status to allow client-side filtering)
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PublicNotification[]>({
    queryKey: ["public-notifications", showArchived],
    queryFn: () => publicService.getNotifications({ archived: showArchived }),
  });

  // 2. Count notifications per category for the current archive view
  const counts = useMemo(() => {
    const tally: Record<string, number> = {};
    notifications.forEach((n) => {
      tally[n.category] = (tally[n.category] || 0) + 1;
    });
    return tally;
  }, [notifications]);

  // 3. Define Filter Options
  const categories: FilterOption<NotificationCategory | "ALL">[] = [
    { id: "ALL", label: t("categories.all"), count: notifications.length },
    {
      id: "URGENT",
      label: t("categories.urgent"),
      count: counts["URGENT"] || 0,
    },
    {
      id: "GENERAL",
      label: t("categories.general"),
      count: counts["GENERAL"] || 0,
    },
    {
      id: "MAGAZINE",
      label: t("categories.magazines"),
      count: counts["MAGAZINE"] || 0,
    },
    { id: "EVENT", label: t("categories.events"), count: counts["EVENT"] || 0 },
  ];

  // 4. Filter logic
  const filteredNotifications = useMemo(() => {
    if (activeCategory === "ALL") return notifications;
    return notifications.filter((n) => n.category === activeCategory);
  }, [notifications, activeCategory]);

  return (
    <div className="py-20 bg-stone-50 min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationsHeader />

        {/* --- Filter Bar --- */}
        <div className="mt-8 sm:mb-12 mb-8 flex flex-wrap items-center justify-between gap-6">
          <FilterPills
            options={categories}
            activeId={activeCategory}
            onSelect={(id) => setActiveCategory(id)}
          />

          {/* Archive Toggle */}
          <button
            onClick={() => {
              setShowArchived(!showArchived);
              setActiveCategory("ALL"); // Reset filter when switching archive
            }}
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
            {showArchived ? t("hide_old") : t("show_old")}
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
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm border-dashed">
                <p className="text-stone-400 font-medium">
                  {activeCategory !== "ALL"
                    ? t("no_notices_category")
                    : showArchived
                      ? t("empty_archive")
                      : t("no_notices")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredNotifications.map((notification) => (
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
