import React from "react";
import { ArrowRight, CheckCircle2, Calendar, MapPin } from "lucide-react";
import type { AdminEvent } from "../../../types/event.admin";
import EventStatusBadge from "./EventStatusBadge";
import { formatDateTime } from "../../../utils/date";
import {
  DeleteButton,
  EditButton,
  TableGrid,
  type ColumnConfig,
} from "../../ui";

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
  // --- UI Helpers ---
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

  // --- Desktop Columns Configuration ---
  const columns: ColumnConfig<AdminEvent>[] = [
    {
      header: "Event Title",
      render: (event) => {
        const status = getTimelineStatus(
          event.startDateTime,
          event.endDateTime
        );
        return (
          <div className="flex flex-col gap-1.5">
            <span className="font-medium text-stone-900">{event.title}</span>
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
        );
      },
    },
    {
      header: "Type",
      render: (event) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
          {event.type}
        </span>
      ),
    },
    {
      header: "Location",
      render: (event) => (
        <span className="text-sm text-stone-500">
          {event.location || (
            <span className="text-stone-300 italic">No location set</span>
          )}
        </span>
      ),
    },
    {
      header: "Duration (Start → End)",
      render: (event) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-stone-600">
            {formatDateTime(event.startDateTime)}
          </span>
          <div className="flex items-center gap-2 text-stone-400">
            <ArrowRight size={12} />
            <span className="text-sm">{formatDateTime(event.endDateTime)}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (event) => <EventStatusBadge status={event.status} />,
    },
    {
      header: "Actions",
      className: "justify-end text-right",
      render: (event) => (
        <div className="inline-flex items-center gap-2">
          <EditButton
            disabled={disabled}
            onClick={() => onEdit(event)}
            variant="normal"
          />
          <DeleteButton
            disabled={disabled}
            onClick={() => onDelete(event.uuid)}
            variant="normal"
          />
        </div>
      ),
    },
  ];

  // --- Mobile Card Definition ---
  const renderMobileCard = (event: AdminEvent) => {
    const status = getTimelineStatus(event.startDateTime, event.endDateTime);
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-stone-900">{event.title}</h3>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${status.color}`}
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
            <div className="flex items-center gap-1.5 text-stone-500 text-sm">
              <MapPin size={14} className="shrink-0" />
              <span>{event.location || "No location set"}</span>
            </div>
          </div>
          <EventStatusBadge status={event.status} />
        </div>

        <div className="bg-stone-50 rounded-xl p-3 text-sm space-y-2 text-left">
          <div className="flex flex-col">
            <span className="text-stone-400 text-[10px] uppercase font-bold">
              Starts
            </span>
            <span className="text-stone-700 font-medium">
              {formatDateTime(event.startDateTime)}
            </span>
          </div>
          <div className="flex flex-col border-t border-stone-200 pt-2">
            <span className="text-stone-400 text-[10px] uppercase font-bold">
              Ends
            </span>
            <span className="text-stone-700 font-medium">
              {formatDateTime(event.endDateTime)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <EditButton
            disabled={disabled}
            onClick={() => onEdit(event)}
            variant="mobile"
          />
          <DeleteButton
            disabled={disabled}
            onClick={() => onDelete(event.uuid)}
            variant="mobile"
          />
        </div>
      </div>
    );
  };

  return (
    <TableGrid
      data={events}
      columns={columns}
      gridTemplate="grid-cols-[1fr_0.7fr_0.7fr_1fr_0.8fr_1fr]"
      keyExtractor={(event) => event.uuid}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default EventsTable;
