import type { AdminEvent } from "../../../types/event.admin";
import EventStatusBadge from "./EventStatusBadge";

interface Props {
  events: AdminEvent[];
  onEdit: (event: AdminEvent) => void;
  onDelete: (id: string) => void;
}

const EventsTable: React.FC<Props> = ({ events, onEdit, onDelete }) => {
  return (
    <table className="w-full bg-white rounded-xl border border-stone-200 overflow-hidden">
      <thead className="bg-stone-100 text-sm text-stone-600">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3">Date</th>
          <th className="p-3">Status</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id} className="border-t">
            <td className="p-3 font-medium">{event.title}</td>
            <td className="p-3 text-center">{event.date}</td>
            <td className="p-3 text-center">
              <EventStatusBadge status={event.status} />
            </td>
            <td className="p-3 text-right space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="text-amber-700 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EventsTable;
