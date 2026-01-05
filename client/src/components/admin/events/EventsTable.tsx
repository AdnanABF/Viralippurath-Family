import {
  PenLine,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { AdminEvent } from "../../../types/event.admin";
import EventStatusBadge from "./EventStatusBadge";
import { formatDateTime } from "../../../utils/date";

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
  // Logic to determine the event's timeline position
  const getTimelineStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < now) {
      return {
        label: "Past",
        color: "bg-stone-100 text-stone-500 border-stone-200",
        icon: <CheckCircle2 size={10} />,
        ping: false,
      };
    }
    if (startDate <= now && endDate >= now) {
      return {
        label: "Ongoing",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: null,
        ping: true,
      };
    }
    return {
      label: "Upcoming",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <Calendar size={10} />,
      ping: false,
    };
  };

  return (
    <div className="w-full bg-white border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse">
          <thead className="bg-stone-50 text-sm text-stone-600 border-b border-stone-200">
            <tr>
              <th className="p-4 text-left font-semibold">Event Title</th>
              <th className="p-4 text-left font-semibold">Type</th>
              <th className="p-4 text-left font-semibold">Location</th>
              <th className="p-4 text-left font-semibold">
                Duration (Start → End)
              </th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {events.map((event) => {
              const status = getTimelineStatus(
                event.startDateTime,
                event.endDateTime
              );

              return (
                <tr
                  key={event.uuid}
                  className="hover:bg-stone-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <span className="font-medium text-stone-900 leading-none">
                        {event.title}
                      </span>

                      {/* Timeline Badge */}
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${status.color} w-fit`}
                      >
                        {status.ping && (
                          <span className="relative flex h-1.5 w-1.5 mr-0.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                          </span>
                        )}
                        {!status.ping && status.icon}
                        {status.label}
                      </div>
                    </div>
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
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {formatDateTime(event.startDateTime)}
                      </span>
                      <div className="flex items-center gap-2 text-stone-400">
                        <ArrowRight size={12} />
                        <span>{formatDateTime(event.endDateTime)}</span>
                      </div>
                    </div>
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
                        <PenLine size={14} /> <span>Edit</span>
                      </button>
                      <button
                        disabled={disabled}
                        onClick={() => onDelete(event.uuid)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed min-w-21.25"
                      >
                        <Trash2 size={14} /> <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
