import { Clock } from "lucide-react";
import type { AdminNotification } from "../../../types/notification.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDateTime } from "../../../utils/date";
import { DeleteButton, EditButton } from "../../ui";

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
    <div className="w-full">
      {/* --- MOBILE VIEW: Notification Feed --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {items.map((n) => (
          <div
            key={n.uuid}
            className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                    n.priority === "HIGH"
                      ? "bg-red-50 text-red-700 border-red-100"
                      : "bg-stone-100 text-stone-600 border-stone-200"
                  }`}
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
              <h3 className="font-bold text-stone-900 leading-tight">
                {n.title}
              </h3>
              {/* Optional: Add a line-clamp for content if your type supports it */}
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
        ))}
      </div>

      {/* --- DESKTOP VIEW: Table --- */}
      <div className="hidden lg:block w-full bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
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
                  <td className="p-4 font-medium text-stone-900">{n.title}</td>
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
                  <td className="p-4 text-sm text-stone-600">
                    {formatDateTime(n.date)}
                  </td>
                  <td className="p-4">
                    <EventStatusBadge status={n.status} />
                  </td>
                  <td className="p-4 text-right">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTable;
