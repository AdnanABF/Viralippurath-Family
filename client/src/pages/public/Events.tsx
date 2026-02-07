import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { publicService } from "../../services/public.service";
import EventsHeader from "../../components/events/EventsHeader";
import EventsTimeline from "../../components/events/EventsTimeline";
import { AdminLoading, AdminError } from "../../components/ui";

const Events = () => {
  const { t } = useTranslation("events");
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [activeType, setActiveType] = useState<string>("ALL");

  // Define categories based on your EventType and translations
  const TYPES = [
    { id: "ALL", label: t("event_types.all", "All") },
    { id: "GENERAL", label: t("event_types.general") },
    { id: "MARRIAGE", label: t("event_types.marriage") },
    { id: "FUNERAL", label: t("event_types.funeral") },
    { id: "GATHERING", label: t("event_types.gathering") },
    { id: "NEWBORN", label: t("event_types.newborn") },
  ];

  // 1. Fetch Ongoing Events
  const { data: ongoingEvents = [] } = useQuery({
    queryKey: ["events", "ongoing"],
    queryFn: () => publicService.getEvents("ongoing"),
  });

  // 2. Fetch Toggled Events (Upcoming/Past)
  const {
    data: eventsResponse = { data: [] },
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["events", view],
    queryFn: () => publicService.getEvents(view),
  });

  // 3. Client-side Filter Logic
  const filteredEvents = useMemo(() => {
    const rawEvents = eventsResponse?.data || [];
    if (activeType === "ALL") return rawEvents;
    return rawEvents.filter((event: any) => event.type === activeType);
  }, [eventsResponse, activeType]);

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader />

        {/* --- Ongoing Events Section --- */}
        {ongoingEvents?.data?.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-xl font-bold text-stone-800 uppercase tracking-widest">
                {t("happening_now")}
              </h2>
            </div>
            <EventsTimeline events={ongoingEvents?.data} />
          </div>
        )}

        {/* View Toggle (Upcoming / Past) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-stone-100 p-1 rounded-xl">
            {(["upcoming", "past"] as const).map((timeline) => (
              <button
                key={timeline}
                onClick={() => {
                  setView(timeline);
                  setActiveType("ALL"); //Reset filter when switching timeline
                }}
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

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                activeType === type.id
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* --- Content States --- */}
        {isLoading ? (
          <AdminLoading message={t("loading_message")} />
        ) : isError ? (
          <AdminError
            title={t("error_title")}
            message={t("error_message")}
            onRetry={() => refetch()}
          />
        ) : filteredEvents.length > 0 ? (
          <EventsTimeline events={filteredEvents} />
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-stone-500 italic">
              {activeType !== "ALL"
                ? t("no_events_category", "No events found for this category")
                : view === "upcoming"
                  ? t("empty_events")
                  : t("empty_past_events")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
