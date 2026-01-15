import React from "react";
import { useTranslation } from "react-i18next";
import type { PublicEvent } from "../../types/event.public";
import { formatDateTime, formatDate } from "../../utils/date";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { getLocalized } from "../../utils/lang.utils";

interface Props {
  event: PublicEvent;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const { i18n } = useTranslation("events");

  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);

  // Check if it's a single-day event
  const isSameDay = start.toDateString() === end.toDateString();

  return (
    <div className="relative pl-8 border-l-2 border-stone-100">
      {/* Timeline dot */}
      <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-amber-700 border-4 border-white" />

      <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-amber-700 font-bold text-sm tracking-widest uppercase mb-1">
              <Clock size={14} />
              {isSameDay ? (
                <span>
                  {formatDate(event.startDateTime)} •{" "}
                  {start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{formatDateTime(event.startDateTime)}</span>
                  <ArrowRight size={12} className="text-stone-400" />
                  <span>{formatDateTime(event.endDateTime)}</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-serif text-stone-800">
              {getLocalized(event, "title", i18n.language)}
            </h3>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="bg-white border border-stone-200 px-3 py-1 rounded-full text-xs text-stone-600 font-medium">
              {event.type}
            </span>
          </div>
        </div>

        <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
          {getLocalized(event, "description", i18n.language)}
        </p>

        {event.location && (
          <div className="mt-6 flex items-center text-stone-500 text-sm font-medium">
            <MapPin size={16} strokeWidth={2} className="mr-2 text-amber-600" />
            {event.location}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
