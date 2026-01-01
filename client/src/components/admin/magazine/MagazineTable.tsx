import type { AdminMagazine } from "../../../types/magazine.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { EditIcon, DeleteIcon } from "../../ui/icons";

interface Props {
  items: AdminMagazine[];
  onEdit: (m: AdminMagazine) => void;
  onDelete: (id: string) => void;
}

const MagazineTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <table className="w-full bg-white rounded-xl border border-stone-200 overflow-hidden">
      <thead className="bg-stone-100 text-sm text-stone-600">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3">Year</th>
          <th className="p-3">Status</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((m) => (
          <tr key={m.id} className="border-t">
            {/* Title */}
            <td className="p-3 font-medium">{m.title}</td>

            {/* Year (badge style, same visual weight as Event Type) */}
            <td className="p-3 text-center">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-stone-100 text-stone-700">
                {m.year}
              </span>
            </td>

            {/* Status */}
            <td className="p-3 text-center">
              <EventStatusBadge status={m.status} />
            </td>

            {/* Actions */}
            <td className="p-3 text-right">
              <div className="inline-flex items-center gap-2">
                <button
                  onClick={() => onEdit(m)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
                             border border-amber-200 text-amber-700
                             hover:bg-amber-50 transition"
                >
                  <EditIcon />
                  Edit
                </button>

                <button
                  onClick={() => onDelete(m.id)}
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

export default MagazineTable;
