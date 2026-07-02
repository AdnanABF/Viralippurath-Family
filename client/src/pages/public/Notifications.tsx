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
  Pagination,
  type FilterOption,
} from "../../components/ui";

const Notifications = () => {
  const { t } = useTranslation("notifications");

  const [activeCategory, setActiveCategory] = useState<
    NotificationCategory | "ALL"
  >("ALL");
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleCategoryChange = (category: NotificationCategory | "ALL") => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setActiveCategory("ALL");
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 1. Fetch Paginated Data
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "public-notifications",
      showArchived,
      activeCategory,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      publicService.getNotifications({
        category: activeCategory,
        archived: showArchived,
        page: currentPage,
        limit: pageSize,
      }),
  });

  const notifications = response?.data || [];
  const meta = response?.meta;

  // 2. Define Filter Options using server-side counts
  const categories = useMemo<FilterOption<NotificationCategory | "ALL">[]>(
    () => {
      const categoryCounts = meta?.categoryCounts ?? {};
      return [
        {
          id: "ALL",
          label: t("categories.all"),
          count: meta?.totalInView || 0,
        },
        {
          id: "URGENT",
          label: t("categories.urgent"),
          count: categoryCounts["URGENT"] || 0,
        },
        {
          id: "GENERAL",
          label: t("categories.general"),
          count: categoryCounts["GENERAL"] || 0,
        },
        {
          id: "MAGAZINE",
          label: t("categories.magazines"),
          count: categoryCounts["MAGAZINE"] || 0,
        },
        {
          id: "EVENT",
          label: t("categories.events"),
          count: categoryCounts["EVENT"] || 0,
        },
      ];
    },
    [t, meta],
  );

  return (
    <div className="py-15 sm:py-20 bg-stone-50 min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationsHeader />

        {/* --- Filter Bar --- */}
        <div className="mt-8 sm:mb-12 mb-8 flex flex-wrap items-center justify-between gap-6">
          <FilterPills
            options={categories}
            activeId={activeCategory}
            onSelect={handleCategoryChange}
            className="sticky top-20 z-30"
          />

          {/* Archive Toggle */}
          <button
            onClick={handleToggleArchived}
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
            ) : notifications.length === 0 ? (
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
              <div className="space-y-12">
                <div className="space-y-6">
                  {notifications.map((notification: PublicNotification) => (
                    <NotificationItem
                      key={notification.uuid}
                      notification={notification}
                    />
                  ))}
                </div>

                {/* Pagination Component */}
                {meta && meta.totalItems > 9 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={meta.totalPages}
                    totalItems={meta.totalItems}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                    isLoading={isFetching}
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
