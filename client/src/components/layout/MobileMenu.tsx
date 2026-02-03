import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { navLinks } from "./nav.config";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../ui/LanguageSwitcher";

interface Props {
  onClose: () => void;
}

const MobileMenu: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation("common");
  const { isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entry animation on mount
  useEffect(() => {
    // Small timeout ensures the browser registers the initial state before animating
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Handle closing with exit animation
  const handleClose = () => {
    setIsVisible(false);
    // Wait for the duration of the transition (300ms) before calling the parent onClose
    setTimeout(onClose, 300);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      {/* 1. Backdrop/Overlay with Fade */}
      <div
        className={`fixed inset-0 top-20 bg-black/10 z-40 h-screen transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* 2. Menu Content with Slide + Fade */}
      <div
        className={`absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          <LanguageSwitcher
            className="w-full min-[450px]:hidden"
            buttonClassName="flex-1"
          />
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={handleClose}
              className="block px-3 py-3 text-base font-medium text-stone-600 border-b border-stone-50 last:border-0 active:bg-stone-50"
            >
              {t(`nav.${link.name.toLowerCase()}`)}
            </Link>
          ))}

          <div className="border-t border-stone-100 mt-2 pt-2 space-y-1">
            <Link
              to={import.meta.env.VITE_DIRECTORY_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="block px-3 py-3 text-base font-medium text-stone-800 active:bg-stone-50"
            >
              {t("nav.directory")}
            </Link>

            {isAuthenticated && (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 text-base font-medium text-red-600 active:bg-red-50"
                >
                  {t("logout")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
