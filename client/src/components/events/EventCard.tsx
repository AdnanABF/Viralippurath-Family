import React from "react";
import type { PublicEvent } from "../../types/event.public";
import { formatDate } from "../../utils/date";
import { MapPin } from "lucide-react";

interface Props {
  event: PublicEvent;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const formattedDate = formatDate(event.date);

  return (
    <div className="relative pl-8 border-l-2 border-stone-100">
      {/* Timeline dot */}
      <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-amber-700 border-4 border-white" />

      <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <span className="text-amber-700 font-bold text-sm tracking-widest uppercase">
              {formattedDate}
            </span>
            <h3 className="text-2xl font-serif text-stone-800 mt-1">
              {event.title}
            </h3>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="bg-white border border-stone-200 px-3 py-1 rounded-full text-xs text-stone-600">
              {event.type}
            </span>
          </div>
        </div>

        <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>

        {event.location && (
          <div className="mt-6 flex items-center text-stone-500 text-sm">
            <MapPin size={16} strokeWidth={2} className="mr-2" />
            {event.location}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
