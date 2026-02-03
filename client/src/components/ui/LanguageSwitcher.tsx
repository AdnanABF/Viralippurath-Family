import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  className?: string;
  buttonClassName?: string;
}

const LanguageSwitcher = ({
  className = "",
  buttonClassName = "",
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "ml", label: "മലയാളം", short: "മല" },
  ];

  return (
    <div
      className={`flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 w-fit ${className}`}
    >
      {languages.map((lang) => {
        const isActive = currentLanguage.startsWith(lang.code);

        return (
          <button
            key={lang.code}
            onClick={() => toggleLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-white text-amber-900 shadow-sm ring-1 ring-stone-200"
                : "text-stone-500 hover:text-stone-800 hover:bg-white/50"
            } ${buttonClassName}`}
          >
            <span className="inline">{lang.short}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
