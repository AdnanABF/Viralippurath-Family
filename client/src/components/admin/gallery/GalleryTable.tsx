import { Album, Calendar } from "lucide-react";
import type { AdminGalleryItem } from "../../../types/gallery.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { DeleteButton, EditButton } from "../../ui";

interface Props {
  items: AdminGalleryItem[];
  onEdit: (item: AdminGalleryItem) => void;
  onDelete: (uuid: string) => void;
  disabled?: boolean;
}

const GalleryTable: React.FC<Props> = ({
  items,
  onEdit,
  onDelete,
  disabled,
}) => {
  return (
    <div className="w-full">
      {/* --- MOBILE VIEW: Visual Card Stack --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {items.map((item) => (
          <div
            key={item.uuid}
            className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col"
          >
            {/* Image Preview Area */}
            <div className="relative aspect-video bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <EventStatusBadge status={item.status} />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 space-y-3 flex-1">
              <div>
                <h3 className="font-bold text-stone-900 line-clamp-1">
                  {item.caption}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-stone-500">
                  <div className="flex items-center gap-1">
                    <Album size={12} /> <span>{item.album}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} /> <span>{item.year}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-stone-50">
                <EditButton
                  disabled={disabled}
                  onClick={() => onEdit(item)}
                  variant="mobile"
                />
                <DeleteButton
                  disabled={disabled}
                  onClick={() => onDelete(item.uuid)}
                  variant="mobile"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW: Structured Table --- */}
      <div className="hidden lg:block w-full bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-stone-50 text-sm text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-4 text-left font-semibold">Preview</th>
                <th className="p-4 text-left font-semibold">Caption</th>
                <th className="p-4 text-left font-semibold">Album</th>
                <th className="p-4 text-left font-semibold">Year</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((item) => (
                <tr
                  key={item.uuid}
                  className="hover:bg-stone-50/50 transition-colors"
                >
                  <td className="p-4 text-center w-24">
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="w-12 h-12 object-cover rounded-lg border border-stone-200 bg-stone-100"
                    />
                  </td>
                  <td className="p-4 font-medium text-stone-900">
                    {item.caption}
                  </td>
                  <td className="p-4 text-sm text-stone-500">{item.album}</td>
                  <td className="p-4 text-sm text-stone-600">{item.year}</td>
                  <td className="p-4">
                    <EventStatusBadge status={item.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <EditButton
                        disabled={disabled}
                        onClick={() => onEdit(item)}
                        variant="normal"
                      />
                      <DeleteButton
                        disabled={disabled}
                        onClick={() => onDelete(item.uuid)}
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

export default GalleryTable;
