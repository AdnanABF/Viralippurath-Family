import { useTranslation } from "react-i18next";

const PromiseSection = () => {
  const { t } = useTranslation("vision");

  return (
    <section className="text-center bg-amber-50/50 p-12 rounded-3xl border border-amber-100">
      <h2 className="text-3xl font-serif text-stone-800 mb-6">
        {t("future_promise.title")}
      </h2>

      <p className="text-stone-700 max-w-2xl mx-auto leading-relaxed malayalam text-lg">
        {t("future_promise.message")}
      </p>
    </section>
  );
};

export default PromiseSection;
