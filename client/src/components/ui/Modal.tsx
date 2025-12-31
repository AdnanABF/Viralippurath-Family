import { useEffect } from "react";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  // Scroll lock
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default Modal;
