import React from "react";
import { Terminal, Copy, Globe, User, Hash, Box } from "lucide-react";
import type { SystemLog } from "../../../types/system-log.admin";
import toast from "react-hot-toast";

interface Props {
  log: SystemLog;
  onClose: () => void;
}

const SystemLogDetails: React.FC<Props> = ({ log, onClose }) => {
  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const isError =
    log.errorCode.startsWith("5") || log.errorCode.startsWith("4");

  // Helper to format payload safely
  const formatPayload = (payload: any) => {
    try {
      if (typeof payload === "string") {
        return JSON.stringify(JSON.parse(payload), null, 2);
      }
      return JSON.stringify(payload, null, 2);
    } catch (e) {
      return String(payload);
    }
  };

  return (
    <div className="bg-white lg:bg-stone-50 border-stone-200 sm:rounded-2xl p-4 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white lg:bg-stone-50 pt-4 pb-4 sm:pt-0 z-10 border-b border-stone-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isError ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            <Terminal size={20} />
          </div>
          <h2 className="text-xl font-serif text-stone-800">Log Details</h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            isError
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-stone-50 text-stone-700 border-stone-200"
          }`}
        >
          HTTP {log.errorCode}
        </span>
      </div>

      {/* Grid: Path and ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
            <Globe size={10} /> Request Path
          </span>
          <p className="text-sm font-mono text-stone-800 break-all leading-relaxed">
            <span className="font-bold text-amber-700 mr-2">{log.method}</span>
            {log.path}
          </p>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
            <Hash size={10} /> Correlation ID
          </span>
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-stone-600 truncate mr-2">
              {log.correlationId || "N/A"}
            </p>
            {log.correlationId && (
              <button
                onClick={() => copyToClipboard(log.correlationId || "", "ID")}
                className="text-stone-400 hover:text-amber-600"
              >
                <Copy size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Message
        </label>
        <div
          className={`w-full p-4 rounded-xl border ${
            isError
              ? "bg-red-50/50 border-red-100 text-red-900"
              : "bg-blue-50/50 border-blue-100 text-blue-900"
          }`}
        >
          <p className="font-medium text-sm leading-relaxed">{log.message}</p>
        </div>
      </div>

      {/* Request Payload Section (New) */}
      {log.payload && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Box size={12} /> Request Payload
            </label>
            <button
              onClick={() =>
                copyToClipboard(formatPayload(log.payload), "Payload")
              }
              className="text-[10px] font-bold text-amber-700 hover:underline"
            >
              COPY JSON
            </button>
          </div>
          <pre className="w-full bg-stone-100 text-stone-800 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-60 border border-stone-200">
            {formatPayload(log.payload)}
          </pre>
        </div>
      )}

      {/* Stack Trace (Dark mode style) */}
      {log.stack && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Stack Trace
            </label>
            <button
              onClick={() => copyToClipboard(log.stack!, "Stack trace")}
              className="text-[10px] font-bold text-amber-700 hover:underline"
            >
              COPY TRACE
            </button>
          </div>
          <pre className="w-full bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-60 shadow-inner">
            {log.stack}
          </pre>
        </div>
      )}

      {/* Request Context */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Request Context
        </label>
        <div className="bg-white border border-stone-200 p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <User size={12} /> User:{" "}
              <span className="text-stone-700 font-mono">
                {log.userUuid || "System/Guest"}
              </span>
            </span>
            <span className="hidden sm:inline text-stone-300">|</span>
            <span className="flex items-center gap-1">
              <Globe size={12} /> IP:{" "}
              <span className="text-stone-700 font-mono">
                {log.ipAddress || "Internal"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Close Action */}
      <div className="flex justify-end pt-4 border-t border-stone-200">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl text-stone-600 border border-stone-300 hover:bg-stone-100 transition font-medium"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};

export default SystemLogDetails;
