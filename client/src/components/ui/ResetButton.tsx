import { RotateCw } from "lucide-react";

interface ResetButtonProps {
  onClick: () => void;
  title?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ResetButton = ({
  onClick,
  title = "Reset Filters",
  className = "",
  disabled = false,
  icon = <RotateCw size={18} />,
}: ResetButtonProps) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`
      p-2 bg-stone-100 text-stone-600 border border-stone-200 rounded-lg 
      hover:bg-stone-200 hover:text-amber-700 transition-all 
      active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm
      ${className}
    `}
  >
    {icon}
  </button>
);

export default ResetButton;
