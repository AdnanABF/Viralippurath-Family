import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { publicService } from "../../services/public.service";
import EventsHeader from "../../components/events/EventsHeader";
import EventsTimeline from "../../components/events/EventsTimeline";
import { AdminLoading, AdminError } from "../../components/ui"; // Use your existing UI components

const Events = () => {
  const { t } = useTranslation("events");
  const [view, setView] = useState<"upcoming" | "past">("upcoming");

  // 1. Fetch Ongoing Events (Happening Now)
  const { data: ongoingEvents = [] } = useQuery({
    queryKey: ["events", "ongoing"],
    queryFn: () => publicService.getEvents("ongoing"),
  });

  // 2. Fetch Toggled Events (Upcoming/Past)
  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["events", view],
    queryFn: () => publicService.getEvents(view),
  });

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

        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-stone-100 p-1 rounded-xl">
            {(["upcoming", "past"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  view === type
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {type === "upcoming" ? t("upcoming") : t("past")}
              </button>
            ))}
          </div>
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
        ) : events?.data?.length > 0 ? (
          <EventsTimeline events={events?.data} />
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-stone-500 italic">
              {view === "upcoming" ? t("empty_events") : t("empty_past_events")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
