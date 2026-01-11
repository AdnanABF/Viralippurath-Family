import { PenLine } from "lucide-react";

interface EditButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "normal" | "mobile";
  label?: string;
  title?: string;
}

const EditButton = ({
  onClick,
  disabled = false,
  variant = "normal",
  label = "Edit",
  title = "Edit",
}: EditButtonProps) => {
  const normalStyles =
    "flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-stone-200 text-stone-700 px-3 py-1.5 text-sm rounded-md hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700";

  const mobileStyles =
    "flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-stone-200 text-stone-700 flex-1 py-2.5 rounded-lg font-medium active:bg-stone-50 active:scale-95";

  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={(e) => {
        e.stopPropagation(); // Prevents row click events if any
        onClick();
      }}
      className={variant === "mobile" ? mobileStyles : normalStyles}
    >
      <PenLine size={variant === "mobile" ? 16 : 14} />
      <span>{label}</span>
    </button>
  );
};

export default EditButton;
