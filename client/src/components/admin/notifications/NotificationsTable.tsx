import React from "react";
import { Clock } from "lucide-react";
import type { AdminNotification } from "../../../types/notification.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDateTime } from "../../../utils/date";
import {
  DeleteButton,
  EditButton,
  TableGrid,
  type ColumnConfig,
} from "../../ui";

interface Props {
  items: AdminNotification[];
  onEdit: (notification: AdminNotification) => void;
  onDelete: (uuid: string) => void;
  disabled?: boolean;
}

const NotificationsTable: React.FC<Props> = ({
  items,
  onEdit,
  onDelete,
  disabled,
}) => {
  // --- UI Helpers ---
  const getPriorityStyles = (priority: string) => {
    return priority === "HIGH"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-stone-100 text-stone-700 border-stone-200";
  };

  // --- Desktop Columns Configuration ---
  const columns: ColumnConfig<AdminNotification>[] = [
    {
      header: "Title",
      render: (n) => (
        <span className="font-medium text-stone-900">{n.title}</span>
      ),
    },
    {
      header: "Priority",
      render: (n) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyles(
            n.priority
          )}`}
        >
          {n.priority}
        </span>
      ),
    },
    {
      header: "Date",
      render: (n) => (
        <span className="text-sm text-stone-600">{formatDateTime(n.date)}</span>
      ),
    },
    {
      header: "Status",
      render: (n) => <EventStatusBadge status={n.status} />,
    },
    {
      header: "Actions",
      className: "justify-end text-right",
      render: (n) => (
        <div className="inline-flex items-center gap-2">
          <EditButton
            disabled={disabled}
            onClick={() => onEdit(n)}
            variant="normal"
          />
          <DeleteButton
            disabled={disabled}
            onClick={() => onDelete(n.uuid)}
            variant="normal"
          />
        </div>
      ),
    },
  ];

  // --- Mobile Card Definition ---
  const renderMobileCard = (n: AdminNotification) => (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3 text-left">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${getPriorityStyles(
              n.priority
            )}`}
          >
            {n.priority}
          </span>
          <EventStatusBadge status={n.status} />
        </div>
        <div className="flex items-center gap-1 text-stone-400 text-xs">
          <Clock size={12} />
          <span>{formatDateTime(n.date)}</span>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-stone-900 leading-tight">{n.title}</h3>
      </div>

      <div className="flex gap-2 pt-2 border-t border-stone-50">
        <EditButton
          disabled={disabled}
          onClick={() => onEdit(n)}
          variant="mobile"
        />
        <DeleteButton
          disabled={disabled}
          onClick={() => onDelete(n.uuid)}
          variant="mobile"
        />
      </div>
    </div>
  );

  return (
    <TableGrid
      data={items}
      columns={columns}
      // Priority and Status take fixed widths, Title gets the rest
      gridTemplate="grid-cols-[1fr_0.8fr_1fr_1fr_1.2fr]"
      keyExtractor={(n) => n.uuid}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default NotificationsTable;
