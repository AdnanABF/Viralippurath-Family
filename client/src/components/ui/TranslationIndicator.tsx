import { Languages } from "lucide-react";

interface TranslationIndicatorProps {
  label?: string;
  className?: string;
}

const TranslationIndicator = ({
  label = "Translated",
  className = "",
}: TranslationIndicatorProps) => (
  <div
    className={`
      flex items-center gap-1 text-[10px] text-stone-400 font-medium
      ${className}`}
  >
    <Languages size={10} />
    <span>{label}</span>
  </div>
);

export default TranslationIndicator;
