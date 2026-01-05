import { useEffect, useState } from "react";
import api from "../../services/api";
import EventsHeader from "../../components/events/EventsHeader";
import EventsTimeline from "../../components/events/EventsTimeline";
import type { PublicEvent } from "../../types/event.public";

const Events = () => {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<PublicEvent[]>([]); // New state
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [error, setError] = useState<boolean>(false);

  // Fetch ongoing events once on mount
  useEffect(() => {
    const fetchOngoing = async () => {
      try {
        const response = await api.get<PublicEvent[]>(
          "/events/published?type=ongoing"
        );
        setOngoingEvents(response.data);
      } catch (err) {
        console.error("Failed to fetch ongoing events", err);
      }
    };
    fetchOngoing();
  }, []);

  // Fetch toggled events (Upcoming/Past)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get<PublicEvent[]>(
          `/events/published?type=${view}`
        );
        setEvents(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [view]);

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader />

        {/* --- Ongoing Events Section (Highlighted) --- */}
        {ongoingEvents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-xl font-bold text-stone-800 uppercase tracking-widest">
                Happening Now
              </h2>
            </div>
            <EventsTimeline events={ongoingEvents} />
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setView("upcoming")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "upcoming"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setView("past")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "past"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* --- Toggled Content States --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <h3 className="text-stone-800 font-serif text-xl mb-2">
              Something went wrong
            </h3>
            <p className="text-stone-500">
              We couldn't load the events. Please try again later.
            </p>
          </div>
        ) : events.length > 0 ? (
          <EventsTimeline events={events} />
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-stone-500 italic">
              {view === "upcoming"
                ? "There are no upcoming events at this time."
                : "No past event records were found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
