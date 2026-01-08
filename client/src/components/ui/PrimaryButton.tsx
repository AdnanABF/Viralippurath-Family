import React from "react";

interface PrimaryButtonProps {
  label: string;
  onClick: () => void;
  title?: string; // For accessibility/hover tooltip
  className?: string; // To allow custom overrides (like colors or widths)
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const PrimaryButton = ({
  label,
  onClick,
  title,
  className = "",
  disabled = false,
  isLoading = false,
  icon,
}: PrimaryButtonProps) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled || isLoading}
    className={`
      whitespace-nowrap bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-all shadow-sm active:scale-95
      ${className}
    `}
  >
    {isLoading ? (
      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <>
        {icon && <span className="shrink-0">{icon}</span>}
        {label}
      </>
    )}
  </button>
);

export default PrimaryButton;
