import { PenLine, Trash2, Album, Calendar } from "lucide-react";
import type { AdminGalleryItem } from "../../../types/gallery.admin";
import EventStatusBadge from "../events/EventStatusBadge";

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
                <button
                  disabled={disabled}
                  onClick={() => onEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  <PenLine size={14} /> Edit
                </button>
                <button
                  disabled={disabled}
                  onClick={() => onDelete(item.uuid)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-red-100 bg-red-50 text-red-600 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
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
                      <button
                        disabled={disabled}
                        onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                      <PenLine size={14} /> <span>Edit</span>
                      </button>
                      <button
                        disabled={disabled}
                        onClick={() => onDelete(item.uuid)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed min-w-21.25"
                      >
                      <Trash2 size={14}/> <span>Delete</span>
                      </button>
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
