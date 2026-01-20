import { useTranslation } from "react-i18next";

const VisionHeader = () => {
  const { t } = useTranslation("vision");

  return (
    <header className="mb-20 text-center">
      <span className="text-amber-700 font-bold uppercase tracking-widest text-sm">
        {t("pre_title")}
      </span>
      <h1 className="text-5xl font-serif text-stone-900 mt-4">{t("title")}</h1>
    </header>
  );
};

export default VisionHeader;
