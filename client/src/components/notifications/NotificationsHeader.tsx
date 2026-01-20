import { useTranslation } from "react-i18next";

const NotificationsHeader = () => {
  const { t } = useTranslation("notifications");

  return (
    <header className="text-center mb-16">
      <h1 className="text-4xl font-serif text-stone-900 mb-4">{t("title")}</h1>
      <p className="text-stone-500">{t("description")}</p>
    </header>
  );
};

export default NotificationsHeader;
