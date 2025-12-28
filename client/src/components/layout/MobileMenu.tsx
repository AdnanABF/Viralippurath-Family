import { Link } from "react-router-dom";
import { navLinks } from "./nav.config";

interface Props {
  onClose: () => void;
}

const MobileMenu: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="md:hidden bg-white border-b border-stone-200">
      <div className="px-2 pt-2 pb-3 space-y-1">
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
      </div>
    </div>
  );
};

export default MobileMenu;
