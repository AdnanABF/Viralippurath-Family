import type { AdminGalleryItem } from "../../../types/gallery.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { EditIcon, DeleteIcon } from "../../ui/icons";

interface Props {
  items: AdminGalleryItem[];
  onEdit: (item: AdminGalleryItem) => void;
  onDelete: (id: string) => void;
}

const GalleryTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <table className="w-full bg-white rounded-xl border border-stone-200 overflow-hidden">
      <thead className="bg-stone-100 text-sm text-stone-600">
        <tr>
          <th className="p-3 text-left">Preview</th>
          <th className="p-3 text-left">Caption</th>
          <th className="p-3">Album</th>
          <th className="p-3">Year</th>
          <th className="p-3">Status</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-t">
            <td className="p-3">
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            </td>
            <td className="p-3">{item.caption}</td>
            <td className="p-3 text-center">{item.album}</td>
            <td className="p-3 text-center">{item.year}</td>
            <td className="p-3 text-center">
              <EventStatusBadge status={item.status} />
            </td>
            <td className="p-3 text-right">
              <div className="inline-flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm rounded-md
                             border border-amber-200 text-amber-700
                             hover:bg-amber-50 transition"
                >
                  <EditIcon /> Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm rounded-md
                             border border-red-200 text-red-600
                             hover:bg-red-50 transition"
                >
                  <DeleteIcon /> Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GalleryTable;
