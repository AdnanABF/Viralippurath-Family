import { PenLine, Trash2, Calendar, FileText } from "lucide-react";
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
    <div className="w-full">
      {/* --- MOBILE VIEW: Magazine List Cards --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {items.map((m) => {
          const displayDate = formatDate(m.publishedDate);
          const thumbnail = m.pdfUrl?.replace(/\.pdf$/, ".jpg");

          return (
            <div
              key={m.uuid}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex gap-4 items-start"
            >
              {/* Thumbnail Left */}
              <div className="shrink-0 self-center">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt=""
                    className="w-16 h-20 object-cover rounded shadow-sm border border-stone-100 bg-stone-100"
                  />
                ) : (
                  <div className="w-16 h-20 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-stone-400">
                    <FileText size={20} />
                  </div>
                )}
              </div>

              {/* Content Right */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-stone-900 truncate">
                    {m.title}
                  </h3>
                  <EventStatusBadge status={m.status} />
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-sm text-stone-500">
                  <Calendar size={14} />
                  <span>{displayDate}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    disabled={disabled}
                    onClick={() => onEdit(m)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-200 text-stone-700 text-sm font-medium active:bg-stone-50 transition-colors"
                  >
                    <PenLine size={14} /> Edit
                  </button>
                  <button
                    disabled={disabled}
                    onClick={() => onDelete(m.uuid)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-red-100 bg-red-50 text-red-600 text-sm font-medium active:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DESKTOP VIEW: Traditional Table --- */}
      <div className="hidden lg:block w-full bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
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
                    <td className="p-4 font-medium text-stone-900">
                      <div className="flex items-center gap-4">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt=""
                            className="w-12 h-16 object-cover rounded shadow-sm border border-stone-100 bg-stone-100"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-stone-100 rounded border border-stone-200" />
                        )}
                        {m.title}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                        {displayDate}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <EventStatusBadge status={m.status} />
                    </td>
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
    </div>
  );
};

export default MagazineTable;
