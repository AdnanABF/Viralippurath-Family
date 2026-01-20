import { useTranslation } from "react-i18next";

const IntroSection = () => {
  const { t } = useTranslation("home");

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-700 font-bold uppercase tracking-widest text-sm">
              {t("welcome")}
            </span>

            <h2 className="text-4xl font-serif text-stone-900 mt-4 mb-6">
              {t("intro.title")}
            </h2>

            <p className="text-stone-600 leading-relaxed text-lg mb-6">
              {t("intro.description")}
            </p>

            <p className="text-lg text-stone-700 italic border-l-4 border-amber-700 pl-4 py-2">
              {t("intro.caption")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://picsum.photos/400/500?sig=a1"
              alt="Heritage"
              className="rounded-2xl shadow-lg mt-8"
            />
            <img
              src="https://picsum.photos/400/500?sig=a2"
              alt="Unity"
              className="rounded-2xl shadow-lg -mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
