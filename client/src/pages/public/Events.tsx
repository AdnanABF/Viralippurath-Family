import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { publicService } from "../../services/public.service";
import EventsHeader from "../../components/events/EventsHeader";
import EventsTimeline from "../../components/events/EventsTimeline";
import {
  AdminLoading,
  AdminError,
  FilterPills,
  Pagination,
  type FilterOption,
} from "../../components/ui";

const Events = () => {
  const { t } = useTranslation("events");
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [activeType, setActiveType] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filter or view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [view, activeType, pageSize]);

  // 1. Fetch Ongoing Events (Not paginated as these are usually few)
  const { data: ongoingEventsResponse } = useQuery({
    queryKey: ["events", "ongoing"],
    queryFn: () => publicService.getEvents({ timeline: "ongoing" }),
  });

  // 2. Fetch Toggled Events (Upcoming/Past) - Server-side Paginated & Filtered
  const {
    data: eventsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["events", view, activeType, currentPage, pageSize],
    queryFn: () =>
      publicService.getEvents({
        timeline: view,
        type: activeType,
        page: currentPage,
        limit: pageSize,
      }),
  });

  const events = eventsResponse?.data || [];
  const meta = eventsResponse?.meta;
  const typeCounts = meta?.typeCounts || {};

  // 3. Map to FilterOption format using server-side counts from meta
  const filterOptions = useMemo<FilterOption<string>[]>(
    () => [
      {
        id: "ALL",
        label: t("event_types.all", "All"),
        count: meta?.totalInView || 0,
      },
      {
        id: "GENERAL",
        label: t("event_types.general"),
        count: typeCounts["GENERAL"] || 0,
      },
      {
        id: "MARRIAGE",
        label: t("event_types.marriage"),
        count: typeCounts["MARRIAGE"] || 0,
      },
      {
        id: "FUNERAL",
        label: t("event_types.funeral"),
        count: typeCounts["FUNERAL"] || 0,
      },
      {
        id: "GATHERING",
        label: t("event_types.gathering"),
        count: typeCounts["GATHERING"] || 0,
      },
      {
        id: "NEWBORN",
        label: t("event_types.newborn"),
        count: typeCounts["NEWBORN"] || 0,
      },
    ],
    [t, meta, typeCounts],
  );

  return (
    <div className="py-15 sm:py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader />

        {/* --- Ongoing Events Section --- */}
        {ongoingEventsResponse?.data?.length > 0 && (
          <div className="mb-10 sm:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-xl font-bold text-stone-800 uppercase tracking-widest">
                {t("happening_now")}
              </h2>
            </div>
            <EventsTimeline events={ongoingEventsResponse.data} />
          </div>
        )}

        {/* View Toggle (Upcoming / Past) */}
        <div className="sm:sticky sm:top-20 sm:z-30 py-2 flex justify-center mb-5 sm:mb-8 bg-white">
          <div className="inline-flex bg-stone-100 p-1 rounded-xl">
            {(["upcoming", "past"] as const).map((timeline) => (
              <button
                key={timeline}
                onClick={() => setView(timeline)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  view === timeline
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {timeline === "upcoming" ? t("upcoming") : t("past")}
              </button>
            ))}
          </div>
        </div>

        {/* Reusable Category Filter Pills */}
        <FilterPills
          options={filterOptions}
          activeId={activeType}
          onSelect={setActiveType}
          className="sm:sticky sm:top-33 sm:z-30 mb-8 sm:mb-12 bg-white backdrop-blur-none"
        />

        {/* --- Content States --- */}
        {isLoading ? (
          <AdminLoading message={t("loading_message")} />
        ) : isError ? (
          <AdminError
            title={t("error_title")}
            message={t("error_message")}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {events.length > 0 ? (
              <div className="space-y-12">
                <EventsTimeline events={events} />

                {/* Pagination Integration */}
                {meta && meta.totalItems > 9 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={meta.totalPages}
                      totalItems={meta.totalItems}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                      isLoading={isFetching}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <p className="text-stone-500 italic">
                  {activeType !== "ALL"
                    ? t(
                        "no_events_category",
                        "No events found for this category",
                      )
                    : view === "upcoming"
                      ? t("empty_events")
                      : t("empty_past_events")}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
