import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { Menu, X } from "lucide-react"; // Added X for a better toggle experience
import LanguageSwitcher from "../ui/LanguageSwitcher";

const Navbar: React.FC = () => {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 sm:gap-16">
          {/* Brand */}
          <div className="flex items-center">
            <img
              src="/v_logo.svg"
              alt="Viralippurath Logo"
              className="h-10 w-10 mr-3"
            />
            <Link
              to="/"
              className="text-2xl font-serif font-bold text-stone-800 tracking-tight"
            >
              {t("viralippurath")}
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />

            <LanguageSwitcher />

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-stone-800 text-white px-5 py-2 rounded-full text-sm hover:bg-stone-700 transition-all"
              >
                {t("nav.admin_portal")}
              </Link>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className="bg-stone-800 text-white px-5 py-2 rounded-full text-sm hover:bg-stone-700"
                >
                  {t("nav.admin_portal")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle button */}
          <div className="flex items-center lg:hidden">
            <LanguageSwitcher className="max-[450px]:hidden" />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU 
         By placing it here outside the main flex container, 
         we can position it absolutely over the content below.
      */}
      {isOpen && (
        <div className="lg:hidden">
          <MobileMenu onClose={() => setIsOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
