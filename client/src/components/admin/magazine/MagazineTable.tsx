import { Calendar, FileText } from "lucide-react";
import type { AdminMagazine } from "../../../types/magazine.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDate } from "../../../utils/date";
import { DeleteButton, EditButton } from "../../ui";

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
                  <EditButton
                    disabled={disabled}
                    onClick={() => onEdit(m)}
                    variant="mobile"
                  />
                  <DeleteButton
                    disabled={disabled}
                    onClick={() => onDelete(m.uuid)}
                    variant="mobile"
                  />
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
                        <EditButton
                          disabled={disabled}
                          onClick={() => onEdit(m)}
                          variant="normal"
                        />
                        <DeleteButton
                          disabled={disabled}
                          onClick={() => onDelete(m.uuid)}
                          variant="normal"
                        />
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
