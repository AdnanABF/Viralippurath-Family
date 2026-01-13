import React from "react";
import {
  Clock,
  Pin,
  BookOpen,
  Calendar,
  AlertTriangle,
  Bell,
} from "lucide-react";
import type {
  AdminNotification,
  NotificationCategory,
} from "../../../types/notification.admin";
import EventStatusBadge from "../events/EventStatusBadge";
import { formatDateTime } from "../../../utils/date";
import {
  DeleteButton,
  EditButton,
  TableGrid,
  type ColumnConfig,
} from "../../ui";
import TranslationIndicator from "../../ui/TranslationIndicator";

interface Props {
  items: AdminNotification[];
  onEdit: (notification: AdminNotification) => void;
  onDelete: (uuid: string) => void;
  disabled?: boolean;
}

const NotificationsTable: React.FC<Props> = ({
  items,
  onEdit,
  onDelete,
  disabled,
}) => {
  // --- UI Helpers ---
  const getCategoryContent = (category: NotificationCategory) => {
    switch (category) {
      case "MAGAZINE":
        return {
          icon: <BookOpen size={14} />,
          label: "Magazine",
          color: "text-blue-600",
        };
      case "EVENT":
        return {
          icon: <Calendar size={14} />,
          label: "Event",
          color: "text-emerald-600",
        };
      case "URGENT":
        return {
          icon: <AlertTriangle size={14} />,
          label: "Urgent",
          color: "text-amber-600",
        };
      default:
        return {
          icon: <Bell size={14} />,
          label: "General",
          color: "text-stone-500",
        };
    }
  };

  // --- Desktop Columns Configuration ---
  const columns: ColumnConfig<AdminNotification>[] = [
    {
      header: "Title",
      render: (n) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {n.isPinned && (
              <Pin
                size={14}
                className="text-amber-600 fill-amber-600 shrink-0"
              />
            )}
            <span className="font-medium text-stone-900 line-clamp-1">
              {n.title_en}
            </span>
          </div>
          {/* Indicator if Malayalam translation exists */}
          {n.title_ml && <TranslationIndicator label="ML Translated" />}
        </div>
      ),
    },
    {
      header: "Category",
      render: (n) => {
        const cat = getCategoryContent(n.category);
        return (
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${cat.color}`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </div>
        );
      },
    },
    {
      header: "Timeline",
      render: (n) => (
        <div className="flex flex-col text-sm leading-tight">
          <span className="text-stone-600">
            Published: {formatDateTime(n.date)}
          </span>
          <span className="text-amber-700 font-medium">
            Expires: {formatDateTime(n.expiresAt)}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (n) => <EventStatusBadge status={n.status} />,
    },
    {
      header: "Actions",
      className: "justify-end text-right",
      render: (n) => (
        <div className="inline-flex items-center gap-2">
          <EditButton
            disabled={disabled}
            onClick={() => onEdit(n)}
            variant="normal"
          />
          <DeleteButton
            disabled={disabled}
            onClick={() => onDelete(n.uuid)}
            variant="normal"
          />
        </div>
      ),
    },
  ];

  // --- Mobile Card Definition ---
  const renderMobileCard = (n: AdminNotification) => {
    const cat = getCategoryContent(n.category);
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3 text-left relative overflow-hidden">
        {n.isPinned && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white p-2 rounded-bl-lg">
            <Pin size={12} fill="currentColor" />
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex flex-wrap items-center gap-2">
            <EventStatusBadge status={n.status} />
            <div
              className={`flex items-center gap-1 text-[10px] font-bold uppercase ${cat.color} bg-stone-50 px-2 py-0.5 rounded border border-stone-100`}
            >
              {cat.icon} {cat.label}
            </div>
            {n.title_ml && <TranslationIndicator label="ML Translated" />}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-stone-900 leading-tight mb-2">
            {n.title_en}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-stone-400 text-[11px]">
              <Clock size={10} />
              <span>Published: {formatDateTime(n.date)}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-700 text-[11px] font-medium">
              <Clock size={10} />
              <span>Expires: {formatDateTime(n.expiresAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-stone-100">
          <EditButton
            disabled={disabled}
            onClick={() => onEdit(n)}
            variant="mobile"
          />
          <DeleteButton
            disabled={disabled}
            onClick={() => onDelete(n.uuid)}
            variant="mobile"
          />
        </div>
      </div>
    );
  };

  return (
    <TableGrid
      data={items}
      columns={columns}
      gridTemplate="grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr]"
      keyExtractor={(n) => n.uuid}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default NotificationsTable;
