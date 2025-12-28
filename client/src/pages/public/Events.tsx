import EventsHeader from "../../components/events/EventsHeader";
import EventsTimeline from "../../components/events/EventsTimeline";
import { events } from "../../components/events/events.mock";

const Events = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader />
        <EventsTimeline events={events} />
      </div>
    </div>
  );
};

export default Events;
