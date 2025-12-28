import type { FamilyEvent } from "../../types/event";
import EventCard from "./EventCard";

interface Props {
  events: FamilyEvent[];
}

const EventsTimeline: React.FC<Props> = ({ events }) => {
  return (
    <div className="space-y-12">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsTimeline;
