import { useTranslation } from "react-i18next";
import AboutPresence from "./AboutPresence";

const AboutContent = () => {
  const { t } = useTranslation("aboutus");

  return (
    <>
      <h1 className="text-5xl font-serif text-stone-900 mb-8 tracking-tight leading-16.75">
        {t("title")}
      </h1>

      <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
        <p>{t("description.para_1")}</p>

        <p>{t("description.para_2")}</p>

        <p>{t("description.para_3")}</p>

        <p>{t("description.para_4")}</p>

        <p>{t("description.para_5")}</p>

        <p className="font-serif italic text-stone-800">{t("message")}</p>

        <AboutPresence />
      </div>
    </>
  );
};

export default AboutContent;
