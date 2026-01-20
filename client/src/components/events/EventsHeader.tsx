import { useTranslation } from "react-i18next";

const EventsHeader = () => {
  const { t } = useTranslation("events");

  return (
    <header className="text-center mb-16">
      <h1 className="text-4xl font-serif text-stone-900 mb-4">{t("title")}</h1>
      <p className="text-stone-500">{t("sub_title")}</p>
    </header>
  );
};

export default EventsHeader;
