import type { AdminEvent } from "../../../types/event.admin";
import EventStatusBadge from "./EventStatusBadge";
import { formatDateTime } from "../../../utils/date";
import { EditIcon, DeleteIcon } from "../../ui/icons";

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
          <th className="p-3">Type</th>
          <th className="p-3">Location</th>
          <th className="p-3">Date</th>
          <th className="p-3">Status</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id} className="border-t">
            <td className="p-3 font-medium">{event.title}</td>

            <td className="p-3 text-center">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-stone-100 text-stone-700">
                {event.type}
              </span>
            </td>

            <td className="p-3 text-center text-sm text-stone-600">
              {event.location || "—"}
            </td>

            <td className="p-3 text-center">{formatDateTime(event.date)}</td>

            <td className="p-3 text-center">
              <EventStatusBadge status={event.status} />
            </td>

            <td className="p-3 text-right">
              <div className="inline-flex items-center gap-2">
                <button
                  onClick={() => onEdit(event)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
                             border border-amber-200 text-amber-700
                             hover:bg-amber-50 transition"
                >
                  <EditIcon />
                  Edit
                </button>

                <button
                  onClick={() => onDelete(event.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
                             border border-red-200 text-red-600
                             hover:bg-red-50 transition"
                >
                  <DeleteIcon />
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EventsTable;
