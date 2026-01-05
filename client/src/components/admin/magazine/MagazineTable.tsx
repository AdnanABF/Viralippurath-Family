import { PenLine, Trash2 } from "lucide-react";
import type { AdminMagazine } from "../../../types/magazine.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDate } from "../../../utils/date";

interface Props {
  items: AdminMagazine[];
  onEdit: (m: AdminMagazine) => void;
  onDelete: (uuid: string) => void;
  disabled?: boolean;
}

const MagazineTable: React.FC<Props> = ({
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
              <th className="p-4 text-left font-semibold">Magazine Title</th>
              <th className="p-4 text-center font-semibold">Published</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {items.map((m) => {
              const displayDate = formatDate(m.publishedDate);

              // Cloudinary Magic: Transform PDF URL to a JPG thumbnail of the first page
              // We replace the .pdf extension with .jpg
              const thumbnail = m.pdfUrl?.replace(/\.pdf$/, ".jpg");

              return (
                <tr
                  key={m.uuid}
                  className="hover:bg-stone-50/50 transition-colors group"
                >
                  {/* Title & Thumbnail */}
                  <td className="p-4 font-medium text-stone-900">
                    <div className="flex items-center gap-3">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt=""
                          className="w-14 h-16 object-cover rounded-lg shadow-sm border border-stone-100 bg-stone-100"
                        />
                      ) : (
                        <div className="w-14 h-16 bg-stone-100 rounded-lg border border-stone-200" />
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
                        disabled={disabled}
                        onClick={() => onEdit(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PenLine size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        disabled={disabled}
                        onClick={() => onDelete(m.uuid)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed min-w-21.25"
                      >
                        <Trash2 size={14} />
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
