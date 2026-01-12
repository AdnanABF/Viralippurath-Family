import React from "react";
import { Album, Calendar } from "lucide-react";
import type { AdminGalleryItem } from "../../../types/gallery.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import {
  DeleteButton,
  EditButton,
  TableGrid,
  type ColumnConfig,
} from "../../ui";

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
  // --- Desktop Columns Configuration ---
  const columns: ColumnConfig<AdminGalleryItem>[] = [
    {
      header: "Preview",
      className: "w-24 justify-center", // Fixed width for images
      render: (item) => (
        <img
          src={item.imageUrl}
          alt={item.caption}
          className="w-12 h-12 object-cover rounded-lg border border-stone-200 bg-stone-100 shadow-sm"
        />
      ),
    },
    {
      header: "Caption",
      render: (item) => (
        <span className="font-medium text-stone-900 line-clamp-2">
          {item.caption}
        </span>
      ),
    },
    {
      header: "Album",
      render: (item) => (
        <span className="text-sm text-stone-500">{item.album}</span>
      ),
    },
    {
      header: "Year",
      render: (item) => (
        <span className="text-sm text-stone-600 font-medium">{item.year}</span>
      ),
    },
    {
      header: "Status",
      render: (item) => <EventStatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      className: "justify-end text-right",
      render: (item) => (
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
      ),
    },
  ];

  // --- Mobile Card Definition ---
  const renderMobileCard = (item: AdminGalleryItem) => (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
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
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex-1 text-left">
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
        <div className="flex gap-2 pt-3 border-t border-stone-100">
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
  );

  return (
    <TableGrid
      data={items}
      columns={columns}
      gridTemplate="grid-cols-[0.3fr_0.8fr_0.8fr_0.5fr_1.2fr_1fr]"
      keyExtractor={(item) => item.uuid}
      renderMobileCard={renderMobileCard}
      mobileClassName="grid-cols-1 sm:grid-cols-2 lg:hidden gap-4"
    />
  );
};

export default GalleryTable;
