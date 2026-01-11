interface SecondaryButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "standard" | "form"; // standard = delete modal, form = large form modal
  className?: string;
}

const SecondaryButton = ({
  label = "Cancel",
  onClick,
  disabled = false,
  variant = "standard",
  className = "",
}: SecondaryButtonProps) => {
  // Common base styles
  const baseStyles =
    "flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-stone-300 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600";

  // Specific variants for your two use cases
  const variants = {
    // Confirm Delete Modal style
    standard: "px-4 py-2 rounded-lg hover:bg-stone-100",

    // Form Modal style (order-2 sm:order-1, w-full, rounded-xl)
    form: "order-2 sm:order-1 w-full sm:w-auto px-6 py-3 rounded-xl font-medium active:bg-stone-50 hover:bg-stone-100 disabled:bg-stone-400 disabled:text-white",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default SecondaryButton;
