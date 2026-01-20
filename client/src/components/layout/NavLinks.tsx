import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { navLinks } from "./nav.config";

const NavLinks = () => {
  const { t } = useTranslation("common");
  const location = useLocation();

  return (
    <>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;

        return (
          <Link
            key={link.path}
            to={link.path}
            className={`px-1 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "text-amber-700 border-b-2 border-amber-700"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t(`nav.${link.name.toLowerCase()}`)}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
