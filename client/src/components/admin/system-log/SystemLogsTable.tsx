import React from "react";
import {
  Terminal,
  UserCircle,
  Globe,
  Clock,
  Trash2,
  AlertCircle,
  ShieldAlert,
  Info,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import type { SystemLog } from "../../../types/system-log.admin";
import { formatRelativeTime, formatFullDate } from "../../../utils/date";
import { TableGrid, type ColumnConfig } from "../../ui";

interface Props {
  logs: SystemLog[];
  onDelete: () => void;
  onViewDetails: (log: SystemLog) => void;
  onFilterTrace: (correlationId: string) => void;
  cleanupStatus: { canDelete: boolean; daysRemaining: number } | null;
}

const SystemLogsTable: React.FC<Props> = ({
  logs,
  onDelete,
  onViewDetails,
  onFilterTrace,
  cleanupStatus,
}) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // --- Helpers for conditional UI ---
  const getStatusIcon = (code: string) => {
    if (code.startsWith("5"))
      return <ShieldAlert size={16} className="text-red-600" />;
    if (code.startsWith("4"))
      return <AlertCircle size={16} className="text-amber-600" />;
    return <Info size={16} className="text-blue-600" />;
  };

  const getStatusStyle = (code: string) => {
    if (code.startsWith("5")) return "text-red-700 bg-red-50 border-red-100";
    if (code.startsWith("4"))
      return "text-amber-700 bg-amber-50 border-amber-100";
    return "text-blue-700 bg-blue-50 border-blue-100";
  };

  // --- Desktop Columns Configuration ---
  const columns: ColumnConfig<SystemLog>[] = [
    {
      header: "Status",
      render: (log) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border text-ellipsis w-full truncate ${getStatusStyle(
            log.errorCode
          )}`}
        >
          {log.errorCode}
        </span>
      ),
    },
    {
      header: "Method & Path",
      render: (log) => (
        <div className="flex items-center gap-3 max-w-full">
          <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
            {getStatusIcon(log.errorCode)}
          </div>
          <div className="flex flex-col max-w-37.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase truncate tracking-tighter">
              {log.method}
            </span>
            <span
              className="text-sm font-medium text-stone-800 font-mono truncate max-w-50"
              title={log.path}
            >
              {log.path}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Error Message / ID",
      render: (log) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-stone-800 line-clamp-1">
            {log.message}
          </span>
          {log.correlationId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterTrace(log.correlationId!);
              }}
              title="Filter by this trace"
              className="flex gap-2 px-1 py-1 items-center text-[12px] text-stone-400 font-mono hover:border hover:border-amber-200 rounded-sm cursor-pointer w-fit"
            >
              <span>ID: {log.correlationId}</span>
              <Filter size={10} />
            </button>
          )}
        </div>
      ),
    },
    {
      header: "Origin",
      render: (log) => (
        <div className="flex flex-col">
          <span className="text-sm text-stone-700 font-medium flex items-center gap-1.5">
            <UserCircle size={14} className="text-stone-400" />{" "}
            {log.userUuid || "System"}
          </span>
          <span className="text-[10px] text-stone-400 flex items-center gap-1 tracking-tight">
            <Globe size={10} /> {log.ipAddress || "Internal"}
          </span>
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
    {
      header: "", // Action indicator
      className: "justify-end",
      render: () => (
        <div className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
          <ArrowRight size={18} />
        </div>
      ),
    },
  ];

  // --- Mobile Card Definition ---
  const renderMobileCard = (log: SystemLog) => (
    <div
      className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4 active:border-amber-400 cursor-pointer"
      onClick={() => onViewDetails(log)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
            <UserCircle size={22} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-stone-900 leading-tight truncate max-w-37.5">
              {log.userUuid || "System"}
            </span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe size={10} /> {log.ipAddress || "N/A"}
            </span>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(
            log.errorCode
          )}`}
        >
          {log.errorCode}
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
        <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-sm">
          {getStatusIcon(log.errorCode)}
        </div>
        <div className="flex flex-col overflow-hidden text-left">
          <span className="text-sm font-semibold text-stone-800 truncate">
            {log.message}
          </span>
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-tight">
            {log.method} • {log.path}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-stone-500">
          <Clock size={14} className="text-stone-400" />
          <span className="text-xs font-medium text-stone-700">
            {formatRelativeTime(log.createdAt)}
          </span>
        </div>
        {log.correlationId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFilterTrace(log.correlationId!);
            }}
            title="Filter by this trace"
            className="p-1 text-[10px] text-stone-400 font-mono active:bg-amber-100 rounded"
          >
            ID: {log.correlationId}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Table Header Wrapper stays separate to handle the button */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
          <Terminal size={16} /> Technical Events
        </h3>
        {isSuperAdmin && (
          <button
            onClick={onDelete}
            disabled={!cleanupStatus || !cleanupStatus.canDelete}
            className={`flex items-center gap-2 px-3 py-1.5 border font-bold text-[10px] rounded-lg transition-all shadow-sm ${
              cleanupStatus?.canDelete
                ? "bg-white border-red-100 text-red-600 hover:bg-red-50"
                : "bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            <Trash2 size={14} />
            {cleanupStatus?.canDelete
              ? "CLEAN OLD LOGS"
              : `LOCKED (${cleanupStatus?.daysRemaining}D)`}
          </button>
        )}
      </div>

      <TableGrid
        data={logs}
        columns={columns}
        gridTemplate="grid-cols-[0.5fr_1fr_3fr_1.5fr_0.7fr_55px] group"
        keyExtractor={(log) => log.uuid}
        renderMobileCard={renderMobileCard}
        onRowClick={onViewDetails}
      />
    </div>
  );
};

export default SystemLogsTable;
