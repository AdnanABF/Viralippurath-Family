import type { AdminNotification } from "../../../types/notification.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDateTime } from "../../../utils/date";
import { EditIcon, DeleteIcon } from "../../ui/icons";

interface Props {
  items: AdminNotification[];
  onEdit: (notification: AdminNotification) => void;
  onDelete: (id: string) => void;
}

const NotificationsTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <table className="w-full bg-white rounded-xl border border-stone-200 overflow-hidden">
      <thead className="bg-stone-100 text-sm text-stone-600">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3">Priority</th>
          <th className="p-3">Date</th>
          <th className="p-3">Status</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((n) => (
          <tr key={n.id} className="border-t">
            {/* Title */}
            <td className="p-3 font-medium">{n.title}</td>

            {/* Priority */}
            <td className="p-3 text-center">
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  n.priority === "HIGH"
                    ? "bg-red-100 text-red-700"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {n.priority}
              </span>
            </td>

            {/* Date */}
            <td className="p-3 text-center">{formatDateTime(n.date)}</td>

            {/* Status */}
            <td className="p-3 text-center">
              <EventStatusBadge status={n.status} />
            </td>

            {/* Actions */}
            <td className="p-3 text-right">
              <div className="inline-flex items-center gap-2">
                <button
                  onClick={() => onEdit(n)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
                             border border-amber-200 text-amber-700
                             hover:bg-amber-50 transition"
                >
                  <EditIcon />
                  Edit
                </button>

                <button
                  onClick={() => onDelete(n.id)}
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

export default NotificationsTable;
