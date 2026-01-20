import { useTranslation } from "react-i18next";

const ContactHeader = () => {
  const { t } = useTranslation("contact");

  return (
    <>
      <h1 className="text-4xl font-serif text-stone-900 mb-6">{t("title")}</h1>
      <p className="text-stone-600 text-lg mb-8 leading-relaxed">
        {t("description")}
      </p>
    </>
  );
};

export default ContactHeader;
