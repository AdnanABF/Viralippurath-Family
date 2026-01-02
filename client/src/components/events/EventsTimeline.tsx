import React from "react";
import type { PublicEvent } from "../../types/event.public";
import EventCard from "./EventCard";

interface Props {
  events: PublicEvent[];
}

const EventsTimeline: React.FC<Props> = ({ events }) => {
  return (
    <div className="space-y-12">
      {events.map((event) => (
        <EventCard key={event.uuid} event={event} />
      ))}
    </div>
  );
};

export default EventsTimeline;
