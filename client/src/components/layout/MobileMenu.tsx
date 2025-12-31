import { Link } from "react-router-dom";
import { navLinks } from "./nav.config";
import { isTokenValid } from "../../utils/auth";
import { logout } from "../../utils/logout";

interface Props {
  onClose: () => void;
}

const MobileMenu: React.FC<Props> = ({ onClose }) => {
  const isAuthenticated = isTokenValid();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="md:hidden bg-white border-b border-stone-200">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {/* Public links */}
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose}
            className="block px-3 py-2 text-base font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50"
          >
            {link.name}
          </Link>
        ))}

        <div className="border-t border-stone-200 mt-3 pt-3 space-y-1">
          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={onClose}
              className="block px-3 py-2 text-base font-medium text-stone-800 hover:bg-stone-50"
            >
              Portal
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={onClose}
                className="block px-3 py-2 text-base font-medium text-stone-800 hover:bg-stone-50"
              >
                Admin
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-stone-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
