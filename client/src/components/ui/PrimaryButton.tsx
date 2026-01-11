import React from "react";

interface PrimaryButtonProps {
  label: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit";
  // We'll use 'form' for the large amber ones and 'danger' for the red confirmation ones
  variant?: "primary" | "form" | "danger";
}

const PrimaryButton = ({
  label,
  onClick,
  title,
  className = "",
  disabled = false,
  isLoading = false,
  loadingLabel,
  icon,
  type = "button",
  variant = "primary",
}: PrimaryButtonProps) => {
  // 1. Common animations and behaviors
  const baseStyles =
    "flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed whitespace-nowrap focus:outline-none focus:ring-2";

  // 2. Specific styles for each "Personality"
  const variants = {
    // Your existing small header/action button
    primary:
      "bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 focus:ring-amber-600/20",

    // The large Form Submit button (Update/Save)
    form: "order-1 sm:order-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-700 text-white hover:bg-amber-800 font-bold shadow-amber-900/20 focus:ring-amber-600/20 disabled:bg-stone-400",

    // The Confirm Delete modal button
    danger:
      "min-w-[100px] px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium disabled:bg-red-400 focus:ring-red-600/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
          {loadingLabel && <span>{loadingLabel}</span>}
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default PrimaryButton;
