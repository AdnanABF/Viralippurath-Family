import { useTranslation } from "react-i18next";

const countries = ["India", "USA", "UK", "UAE", "Australia", "Germany", "Qatar"];

const AboutPresence = () => {
  const { t } = useTranslation("aboutus");

  return (
    <div className="pt-8 border-t border-stone-200">
      <h3 className="font-bold text-stone-900 mb-4 uppercase tracking-widest text-xs">
        {t("about_presence.title")}
      </h3>

      <div className="flex flex-wrap gap-4">
        {countries.map((country) => (
          <span
            key={country}
            className="bg-white px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 shadow-sm"
          >
            {t(`about_presence.countries.${country.toLowerCase()}`)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AboutPresence;
