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
import type { SystemLog } from "../../../types/system-log.admin";
import { formatRelativeTime, formatFullDate } from "../../../utils/date";

interface Props {
  logs: SystemLog[];
  onDelete: () => void;
  onViewDetails: (log: SystemLog) => void;
  onFilterTrace: (correlationId: string) => void;
}

const SystemLogsTable: React.FC<Props> = ({
  logs,
  onDelete,
  onViewDetails,
  onFilterTrace,
}) => {
  const getStatusIcon = (code: string) => {
    if (code.startsWith("5"))
      return <ShieldAlert size={16} className="text-red-600" />;
    if (code.startsWith("4"))
      return <AlertCircle size={16} className="text-amber-600" />;
    return <Info size={16} className="text-blue-600" />;
  };

  const getStatusStyle = (code: string) => {
    if (code.startsWith("5")) {
      return "text-red-700 bg-red-50 border-red-100";
    }
    if (code.startsWith("4")) {
      return "text-amber-700 bg-amber-50 border-amber-100";
    }
    return "text-blue-700 bg-blue-50 border-blue-100";
  };

  return (
    <div className="w-full space-y-4">
      {/* Table Header with Cleanup Action */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
          <Terminal size={16} /> Technical Events
        </h3>
        <button
          onClick={() => onDelete()}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-all shadow-sm"
        >
          <Trash2 size={14} /> CLEAN OLD LOGS
        </button>
      </div>

      {/* --- MOBILE VIEW: Card Stack (lg hidden) --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {logs.map((log) => {
          const statusStyle = getStatusStyle(log.errorCode);
          return (
            <div
              key={log.uuid}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4 active:border-amber-400"
              onClick={() => onViewDetails(log)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
                    <UserCircle size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-900 leading-tight truncate max-w-37.5">
                      {log.userUuid || "System"}
                    </span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Globe size={10} /> {log.ipAddress || "N/A"}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusStyle}`}
                >
                  {log.errorCode}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-sm">
                  {getStatusIcon(log.errorCode)}
                </div>
                <div className="flex flex-col overflow-hidden">
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
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFilterTrace(log.correlationId!);
                      }}
                      title="Filter by this trace"
                      className="flex gap-2 items-center p-1 text-[10px] text-stone-400 font-mono rounded-sm active:bg-amber-100"
                    >
                      <span>ID: {log.correlationId} </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DESKTOP VIEW: Table (lg block) --- */}
      <div className="hidden lg:block w-full bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-stone-50 text-sm text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Method & Path</th>
                <th className="p-4 text-left font-semibold">
                  Error Message / ID
                </th>
                <th className="p-4 text-left font-semibold">Origin</th>
                <th className="p-4 text-left font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.map((log) => {
                const statusStyle = getStatusStyle(log.errorCode);
                return (
                  <tr
                    key={log.uuid}
                    className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                    onClick={() => onViewDetails(log)}
                  >
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${statusStyle}`}
                      >
                        {log.errorCode}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                          {getStatusIcon(log.errorCode)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
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
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-stone-800 line-clamp-1">
                          {log.message}
                        </span>
                        {log.correlationId && (
                          <div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onFilterTrace(log.correlationId!);
                              }}
                              title="Filter by this trace"
                              className="flex gap-2 px-1 py-1 items-center text-[12px] text-stone-400 font-mono hover:border hover:border-amber-200 rounded-sm w-auto cursor-pointer"
                            >
                              <span>ID: {log.correlationId} </span>
                              <Filter size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-stone-700 font-medium flex items-center gap-1.5">
                          <UserCircle size={14} className="text-stone-400" />{" "}
                          {log.userUuid || "System"}
                        </span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Globe size={10} /> {log.ipAddress || "Internal"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-stone-700 font-medium">
                          {formatRelativeTime(log.createdAt)}
                        </span>
                        <span className="text-xs text-stone-400">
                          {formatFullDate(log.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={18} />
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

export default SystemLogsTable;
