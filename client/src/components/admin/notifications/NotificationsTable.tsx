import { PenLine, Trash2 } from "lucide-react";
import type { AdminNotification } from "../../../types/notification.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDateTime } from "../../../utils/date";

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
  return (
    <div className="w-full bg-white border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse">
          <thead className="bg-stone-50 text-sm text-stone-600 border-b border-stone-200">
            <tr>
              <th className="p-4 text-left font-semibold">Title</th>
              <th className="p-4 text-left font-semibold">Priority</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((n) => (
              <tr
                key={n.uuid}
                className="hover:bg-stone-50/50 transition-colors group"
              >
                {/* Title */}
                <td className="p-4 font-medium text-stone-900">{n.title}</td>

                {/* Priority */}
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      n.priority === "HIGH"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : "bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    {n.priority}
                  </span>
                </td>

                {/* Date */}
                <td className="p-4 text-sm text-stone-600">
                  {formatDateTime(n.date)}
                </td>

                {/* Status */}
                <td className="p-4">
                  <EventStatusBadge status={n.status} />
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      disabled={disabled}
                      onClick={() => onEdit(n)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PenLine size={14} /> <span>Edit</span>
                    </button>
                    <button
                      disabled={disabled}
                      onClick={() => onDelete(n.uuid)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed min-w-21.25"
                    >
                      <Trash2 size={14} /> <span>Delete</span>
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

export default NotificationsTable;
