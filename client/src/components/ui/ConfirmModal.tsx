import type { ReactNode } from "react";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean; // New prop for loading state
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Disabled click-to-close if loading */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => !isLoading && onCancel()}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all">
        <h2 className="text-xl font-serif text-stone-800 mb-2">{title}</h2>

        {description && (
          <div className="text-stone-600 mb-6 leading-relaxed">
            {description}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <SecondaryButton
            onClick={onCancel}
            disabled={isLoading}
            label={cancelText}
          />
          <PrimaryButton
            variant="danger"
            label={confirmText}
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
