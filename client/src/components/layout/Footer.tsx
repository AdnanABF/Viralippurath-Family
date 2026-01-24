import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-stone-100 border-t border-stone-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-4">
              {t("viralippurath_family")}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {t("footer_message")}
            </p>
          </div>

          <div>
            <h4 className="text-stone-800 font-semibold mb-4 text-sm uppercase tracking-wider">
              {t("quick_links")}
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link to="/gallery" className="hover:text-amber-700">
                  {t("nav.gallery")}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-700">
                  {t("nav.events")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-700">
                  {t("nav.about_us")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-800 font-semibold mb-4 text-sm uppercase tracking-wider">
              {t("connect")}
            </h4>
            <p className="text-stone-600 text-sm">
              {t("kerala")}, {t("india")}{" "}
            </p>
            <p className="text-stone-600 text-sm mt-2">
              viralippurathkudumbam@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {t("viralippurath_kudumbasamithi")}.
          </p>
          <p className="mt-4 md:mt-0">
            Designed & Developed by{" "}
            <a
              href={import.meta.env.VITE_PORTFOLIO_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-700 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Adnan Bin Farook
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
