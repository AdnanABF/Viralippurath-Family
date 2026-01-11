import React from "react";
import { Terminal, Copy, Globe, User, Hash } from "lucide-react";
import type { SystemLog } from "../../../types/system-log.admin";
import toast from "react-hot-toast";

interface Props {
  log: SystemLog;
  onClose: () => void;
}

const SystemLogDetails: React.FC<Props> = ({ log, onClose }) => {
  const copyToClipboard = (text: string) => {
    if (!text) return; // Guard clause
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const isError =
    log.errorCode.startsWith("5") || log.errorCode.startsWith("4");

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info Cards */}
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
                onClick={() => copyToClipboard(log.correlationId || "")}
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
          Error Message
        </label>
        <div className="w-full bg-red-50/50 border border-red-100 p-4 rounded-xl">
          <p className="text-red-900 font-medium text-sm leading-relaxed">
            {log.message}
          </p>
        </div>
      </div>

      {/* Stack Trace (Only if exists) */}
      {log.stack && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Stack Trace
            </label>
            <button
              onClick={() => copyToClipboard(log.stack!)}
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

      {/* Request Payload (JSON Viewing) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Request Context
        </label>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border border-stone-200 p-4 rounded-xl">
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <User size={12} /> User: {log.userUuid || "System/Guest"}
              </span>
              <span className="flex items-center gap-1">
                <Globe size={12} /> IP: {log.ipAddress || "Internal"}
              </span>
            </div>
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
