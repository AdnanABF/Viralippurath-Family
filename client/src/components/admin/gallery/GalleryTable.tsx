import type { AdminGalleryItem } from "../../../types/gallery.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { EditIcon, DeleteIcon } from "../../ui/icons";

interface Props {
  items: AdminGalleryItem[];
  onEdit: (item: AdminGalleryItem) => void;
  onDelete: (uuid: string) => void;
}

const GalleryTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="w-full bg-white border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse">
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
                <td className="p-4">
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    className="w-16 h-16 object-cover rounded-lg border border-stone-200 bg-stone-100"
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
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 transition-all"
                    >
                      <EditIcon /> <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(item.uuid)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                    >
                      <DeleteIcon /> <span>Delete</span>
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

export default GalleryTable;
