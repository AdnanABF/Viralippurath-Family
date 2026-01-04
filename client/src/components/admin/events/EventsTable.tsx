import type { AdminEvent } from "../../../types/event.admin";
import EventStatusBadge from "./EventStatusBadge";
import { formatDateTime } from "../../../utils/date";
import { EditIcon, DeleteIcon } from "../../ui/icons";

interface Props {
  events: AdminEvent[];
  onEdit: (event: AdminEvent) => void;
  onDelete: (uuid: string) => void;
  disabled?: boolean;
}

const EventsTable: React.FC<Props> = ({
  events,
  onEdit,
  onDelete,
  disabled,
}) => {
  return (
    <div className="w-full bg-white border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse">
          <thead className="bg-stone-50 text-sm text-stone-600 border-b border-stone-200">
            <tr>
              <th className="p-4 text-left font-semibold">Event Title</th>
              <th className="p-4 text-left font-semibold">Type</th>
              <th className="p-4 text-left font-semibold">Location</th>
              <th className="p-4 text-left font-semibold">Date & Time</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {events.map((event) => (
              <tr
                key={event.uuid}
                className="hover:bg-stone-50/50 transition-colors"
              >
                <td className="p-4 font-medium text-stone-900">
                  {event.title}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                    {event.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-stone-500">
                  {event.location || (
                    <span className="text-stone-300 italic">
                      No location set
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm text-stone-600">
                  {formatDateTime(event.date)}
                </td>
                <td className="p-4">
                  <EventStatusBadge status={event.status} />
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      disabled={disabled}
                      onClick={() => onEdit(event)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <EditIcon /> <span>Edit</span>
                    </button>
                    <button
                      disabled={disabled}
                      onClick={() => onDelete(event.uuid)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed min-w-21.25"
                    >
                      <DeleteIcon /> <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
