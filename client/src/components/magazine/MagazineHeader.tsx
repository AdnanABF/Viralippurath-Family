import { useTranslation } from "react-i18next";

const MagazineHeader = () => {
  const { t } = useTranslation("magazine");

  return (
    <header className="mb-12">
      <h1 className="text-4xl font-serif text-stone-900">{t("title")}</h1>
      <p className="text-stone-500 mt-2">{t("description")}</p>
    </header>
  );
};

export default MagazineHeader;
