import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation("home");

  return (
    <section className="relative h-[80vh] flex items-center justify-center bg-stone-900 overflow-hidden">
      <img
        src="https://picsum.photos/1920/1080?grayscale&sig=hero"
        alt="Family Heritage"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-relaxed sm:leading-28">
          {t("title")}
        </h1>

        <p className="text-xl md:text-2xl text-stone-200 mb-8 font-light italic">
          {t("sub_title")}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/about"
            className="bg-amber-700 text-white px-8 py-3 rounded-full hover:bg-amber-800 transition-all text-lg shadow-lg"
          >
            {t("our_story")}
          </Link>

          <Link
            to="/gallery"
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all text-lg"
          >
            {t("legacy_gallery")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
