import React from "react";
import {
  History,
  Calendar,
  Image as ImageIcon,
  Bell,
  BookOpen,
  UserCircle,
  PlusCircle,
  RefreshCcw,
  Trash2,
  Clock,
  Users,
} from "lucide-react";
import type { ActivityLog } from "../../../types/activity-log.admin";
import { formatRelativeTime, formatFullDate } from "../../../utils/date";
import { TableGrid, type ColumnConfig } from "../../ui";

interface Props {
  logs: ActivityLog[];
}

const ActivityTable: React.FC<Props> = ({ logs }) => {
  // --- UI Helpers ---
  const getEntityIcon = (type: string) => {
    switch (type) {
      case "EVENT":
        return <Calendar size={16} className="text-amber-600" />;
      case "GALLERY":
        return <ImageIcon size={16} className="text-blue-600" />;
      case "NOTIFICATION":
        return <Bell size={16} className="text-purple-600" />;
      case "MAGAZINE":
        return <BookOpen size={16} className="text-emerald-600" />;
      case "ADMIN":
        return <Users size={16} className="text-orange-600" />;
      default:
        return <History size={16} className="text-stone-500" />;
    }
  };

  const getActionStyle = (action: string) => {
    switch (action) {
      case "CREATE":
        return {
          color: "text-green-700 bg-green-50 border-green-100",
          icon: <PlusCircle size={10} />,
        };
      case "UPDATE":
        return {
          color: "text-blue-700 bg-blue-50 border-blue-100",
          icon: <RefreshCcw size={10} />,
        };
      case "DELETE":
        return {
          color: "text-red-700 bg-red-50 border-red-100",
          icon: <Trash2 size={10} />,
        };
      default:
        return {
          color: "text-stone-700 bg-stone-50 border-stone-100",
          icon: null,
        };
    }
  };

  // --- Desktop Columns Configuration ---
  const columns: ColumnConfig<ActivityLog>[] = [
    {
      header: "Administrator",
      render: (log) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200">
            <UserCircle size={20} />
          </div>
          <span className="font-medium text-stone-900">
            {log.adminUserName}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      render: (log) => {
        const style = getActionStyle(log.action);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${style.color}`}
          >
            {style.icon} {log.action}
          </span>
        );
      },
    },
    {
      header: "Target Entity",
      render: (log) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
            {getEntityIcon(log.entityType)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-stone-800">
              {log.entityTitle}
            </span>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-tight">
              {log.entityType}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Date & Time",
      render: (log) => (
        <div className="flex flex-col">
          <span className="text-sm text-stone-700 font-medium">
            {formatRelativeTime(log.createdAt)}
          </span>
          <span className="text-xs text-stone-400">
            {formatFullDate(log.createdAt)}
          </span>
        </div>
      ),
    },
  ];

  // --- Mobile Card Definition ---
  const renderMobileCard = (log: ActivityLog) => {
    const actionStyle = getActionStyle(log.action);
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
              <UserCircle size={22} />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-stone-900 leading-tight">
                {log.adminUserName}
              </span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                Administrator
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${actionStyle.color}`}
          >
            {actionStyle.icon} {log.action}
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-sm">
            {getEntityIcon(log.entityType)}
          </div>
          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-sm font-semibold text-stone-800 truncate">
              {log.entityTitle}
            </span>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-tight">
              {log.entityType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-stone-500 pt-1">
          <Clock size={14} className="text-stone-400" />
          <div className="flex flex-wrap items-center gap-x-2 text-xs">
            <span className="font-medium text-stone-700">
              {formatRelativeTime(log.createdAt)}
            </span>
            <span className="text-stone-300">•</span>
            <span>{formatFullDate(log.createdAt)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <TableGrid
      data={logs}
      columns={columns}
      gridTemplate="grid-cols-[2fr_0.8fr_1.5fr_1fr]"
      keyExtractor={(log) => log.uuid}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default ActivityTable;
