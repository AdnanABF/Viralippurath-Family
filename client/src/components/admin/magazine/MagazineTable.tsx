import React from "react";
import { Calendar, FileText } from "lucide-react";
import type { AdminMagazine } from "../../../types/magazine.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDate } from "../../../utils/date";
import {
  DeleteButton,
  EditButton,
  TableGrid,
  type ColumnConfig,
} from "../../ui";
import TranslationIndicator from "../../ui/TranslationIndicator";

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
  // --- UI Helpers ---
  const getThumbnail = (pdfUrl?: string) => pdfUrl?.replace(/\.pdf$/, ".jpg");

  // --- Desktop Columns Configuration ---
  const columns: ColumnConfig<AdminMagazine>[] = [
    {
      header: "Magazine Title",
      render: (m) => {
        const thumbnail = getThumbnail(m.pdfUrl);
        return (
          <div className="flex items-center gap-4">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt=""
                className="w-12 h-16 object-cover rounded shadow-sm border border-stone-100 bg-stone-100"
              />
            ) : (
              <div className="w-12 h-16 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-stone-400">
                <FileText size={16} />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="font-medium text-stone-900">{m.title_en}</span>
              {m.title_ml && <TranslationIndicator label="ML Translated" />}
            </div>
          </div>
        );
      },
    },
    {
      header: "Published",
      render: (m) => (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-700 border border-stone-200">
          {formatDate(m.publishedDate)}
        </span>
      ),
    },
    {
      header: "Status",
      render: (m) => <EventStatusBadge status={m.status} />,
    },
    {
      header: "Actions",
      className: "justify-end text-right",
      render: (m) => (
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
      ),
    },
  ];

  // --- Mobile Card Definition ---
  const renderMobileCard = (m: AdminMagazine) => {
    const thumbnail = getThumbnail(m.pdfUrl);
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex gap-4 items-start">
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
        <div className="flex-1 min-w-0 text-left">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-stone-900 truncate">{m.title_en}</h3>
            <EventStatusBadge status={m.status} />
          </div>
          {m.title_ml && <TranslationIndicator label="ML Translated" />}

          <div className="flex items-center gap-1.5 mt-1 text-sm text-stone-500">
            <Calendar size={14} />
            <span>{formatDate(m.publishedDate)}</span>
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
  };

  return (
    <TableGrid
      data={items}
      columns={columns}
      // Fluid title, fixed width for metadata and status
      gridTemplate="grid-cols-[1.7fr_1fr_1fr_1fr]"
      keyExtractor={(m) => m.uuid}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default MagazineTable;
