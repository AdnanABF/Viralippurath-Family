import { RotateCw } from "lucide-react";

interface AdminLoadingProps {
  message?: string;
}

export const AdminLoading = ({
  message = "Loading data...",
}: AdminLoadingProps) => (
  <div className="flex flex-col items-center justify-center py-20 bg-white border border-stone-200 rounded-2xl shadow-sm">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
    <p className="mt-4 text-stone-500 font-medium text-sm">{message}</p>
  </div>
);

interface AdminErrorProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export const AdminError = ({
  title = "Unable to load data",
  message = "Try again",
  onRetry,
}: AdminErrorProps) => (
  <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center shadow-sm">
    <p className="text-stone-800 font-serif text-lg mb-1">{title}</p>
    <button
      onClick={onRetry}
      className="text-amber-700 font-medium hover:underline flex items-center gap-2 mx-auto text-sm transition-all active:scale-95"
    >
      <RotateCw size={14} /> {message}
    </button>
  </div>
);
