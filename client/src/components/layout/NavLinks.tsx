import { Link, useLocation } from "react-router-dom";
import { navLinks } from "./nav.config";

const NavLinks = () => {
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
            {link.name}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
