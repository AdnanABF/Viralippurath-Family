import type { PublicEvent } from "../../types/event.public";

interface Props {
  event: PublicEvent;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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

        <p className="text-stone-600 leading-relaxed">{event.description}</p>

        {event.location && (
          <div className="mt-6 flex items-center text-stone-500 text-sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {event.location}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
