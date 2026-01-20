import { Toaster, toast, resolveValue } from "react-hot-toast";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

const AppToast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    >
      {(t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-xs sm:max-w-md w-full bg-[#1c1917] text-white shadow-lg rounded-xl pointer-events-auto flex items-center ring-1 ring-black/5 transition-all`}
        >
          {/* 1. Left Icon Section (Success / Error) */}
          <div className="pl-4 py-4 shrink-0">
            {t.type === "success" && (
              <CheckCircle2 size={20} className="text-[#16a34a]" />
            )}
            {t.type === "error" && (
              <AlertCircle size={20} className="text-[#dc2626]" />
            )}
            {t.type === "loading" && (
              <div className="w-5 h-5 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
            )}
          </div>

          {/* 2. Message Section */}
          <div className="flex-1 p-4 py-4 min-w-0">
            <p className="text-sm font-medium leading-tight truncate-2-lines">
              {resolveValue(t.message, t)}
            </p>
          </div>

          {/* 3. Close Button Section (Right side) */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="p-4 mr-1 text-stone-500 hover:text-white transition-colors border-l border-stone-800/50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </Toaster>
  );
};

export default AppToast;
