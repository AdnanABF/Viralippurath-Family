import type { EventStatus } from "../../../types/event.admin";

const EventStatusBadge: React.FC<{ status: EventStatus }> = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-bold rounded ${
        status === "PUBLISHED"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
};

export default EventStatusBadge;
