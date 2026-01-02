import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
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
              Viralippurath
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />

            {!isAuthenticated && (
              <Link
                to="/login"
                className="bg-stone-800 text-white px-5 py-2 rounded-full text-sm hover:bg-stone-700 transition-all"
              >
                Admin Portal
              </Link>
            )}

            {isAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="bg-stone-800 text-white px-5 py-2 rounded-full text-sm hover:bg-stone-700"
                >
                  Admin Portal
                </Link>

                <button
                  onClick={logout}
                  className="border border-stone-300 text-stone-700 px-5 py-2 rounded-full text-sm hover:bg-stone-100 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && <MobileMenu onClose={() => setIsOpen(false)} />}
    </nav>
  );
};

export default Navbar;
