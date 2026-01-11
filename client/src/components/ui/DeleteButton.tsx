import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "normal" | "mobile";
  label?: string;
  title?: string;
}

const DeleteButton = ({
  onClick,
  disabled = false,
  variant = "normal",
  label = "Delete",
  title = "Delete",
}: DeleteButtonProps) => {
  // Normal Screen Styles (Stone border, turns Red on hover, min-width)
  const normalStyles =
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed min-w-[85px]";

  // Mobile Styles (Red background, active scale animation, rounded-lg)
  const mobileStyles =
    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-100 bg-red-50 text-red-600 font-medium active:scale-95 transition-all disabled:opacity-50 active:bg-red-100";

  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={(e) => {
        e.stopPropagation(); // Standard practice for delete buttons in tables/cards
        onClick();
      }}
      className={variant === "mobile" ? mobileStyles : normalStyles}
    >
      {/* Mobile uses size 16, Normal uses size 14 */}
      <Trash2 size={variant === "mobile" ? 16 : 14} />
      <span>{label}</span>
    </button>
  );
};

export default DeleteButton;
