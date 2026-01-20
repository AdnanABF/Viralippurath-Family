import { useTranslation } from "react-i18next";

const GalleryHeader = () => {
  const { t } = useTranslation("gallery");

  return (
    <header className="text-center mb-16">
      <h1 className="text-5xl font-serif text-stone-900 mb-4">{t("title")}</h1>
      <p className="text-stone-500 max-w-2xl mx-auto">{t("description")}</p>
    </header>
  );
};

export default GalleryHeader;
