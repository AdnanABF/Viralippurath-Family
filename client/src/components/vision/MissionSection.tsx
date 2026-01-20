import { useTranslation } from "react-i18next";

const MissionSection = () => {
  const { t } = useTranslation("vision");

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-serif text-stone-800 mb-6">
          {t("vision.title")}
        </h2>
        <p className="text-stone-600 leading-relaxed text-lg italic">
          {t("vision.description")}
        </p>
      </div>

      <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
        <h3 className="font-bold text-stone-800 mb-4 uppercase tracking-wider text-sm">
          {t("core_values.title")}
        </h3>

        <ul className="space-y-4 text-stone-600">
          <li className="flex items-start">
            <span className="text-amber-700 mr-3">✦</span>
            <span>
              <strong>{t("core_values.item_1.title")}:</strong>
              {t("core_values.item_1.message")}
            </span>
          </li>

          <li className="flex items-start">
            <span className="text-amber-700 mr-3">✦</span>
            <span>
              <strong>{t("core_values.item_2.title")}:</strong>
              {t("core_values.item_2.message")}
            </span>
          </li>

          <li className="flex items-start">
            <span className="text-amber-700 mr-3">✦</span>
            <span>
              <strong>{t("core_values.item_2.title")}:</strong>
              {t("core_values.item_2.message")}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default MissionSection;
