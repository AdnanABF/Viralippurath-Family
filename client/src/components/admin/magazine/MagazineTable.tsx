import type { AdminMagazine } from "../../../types/magazine.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { EditIcon, DeleteIcon } from "../../ui/icons";
import { formatDate } from "../../../utils/date";

interface Props {
  items: AdminMagazine[];
  onEdit: (m: AdminMagazine) => void;
  onDelete: (uuid: string) => void;
}

const MagazineTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-150 border-collapse">
          <thead className="bg-stone-50 text-sm text-stone-600 border-b border-stone-200">
            <tr>
              <th className="p-4 text-left font-semibold">Magazine Title</th>
              <th className="p-4 text-center font-semibold">Published</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {items.map((m) => {
              // Format ISO string to a readable Year/Month
              const displayDate = formatDate(m.publishedDate);

              return (
                <tr
                  key={m.uuid}
                  className="hover:bg-stone-50/50 transition-colors group"
                >
                  {/* Title */}
                  <td className="p-4 font-medium text-stone-900">
                    <div className="flex items-center gap-3">
                      {m.coverImageUrl && (
                        <img
                          src={m.coverImageUrl}
                          alt=""
                          className="w-8 h-10 object-cover rounded shadow-sm border border-stone-100"
                        />
                      )}
                      {m.title}
                    </div>
                  </td>

                  {/* Date/Year */}
                  <td className="p-4 text-center">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {displayDate}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <EventStatusBadge status={m.status} />
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onEdit(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
                                 border border-stone-200 text-stone-700
                                 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 transition-all"
                      >
                        <EditIcon />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => onDelete(m.uuid)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
                                 border border-stone-200 text-red-600
                                 hover:bg-red-50 hover:border-red-200 transition-all"
                      >
                        <DeleteIcon />
                        <span>Delete</span>
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

export default MagazineTable;
