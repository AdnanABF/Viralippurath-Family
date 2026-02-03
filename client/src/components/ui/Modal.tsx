import { useEffect } from "react";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  isDirty?: boolean;
}

const Modal: React.FC<Props> = ({
  open,
  onClose,
  children,
  isDirty = false,
}) => {
  // Scroll lock
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const handleBackdropClick = () => {
    // Idea 1: Simply disable backdrop click if form is being edited
    if (isDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close this form?"
      );
      if (confirmClose) onClose();
    } else {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={handleBackdropClick}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Modal;
