import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-4">
              Viralippurath Family
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Preserving our heritage, celebrating our unity, and nurturing
              future generations.
            </p>
          </div>

          <div>
            <h4 className="text-stone-800 font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link to="/gallery" className="hover:text-amber-700">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-700">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-700">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-800 font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <p className="text-stone-600 text-sm">Kerala, India</p>
            <p className="text-stone-600 text-sm mt-2">
              viralippurathkudumbam@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Viralippurath Kudumbasamithi.</p>
          <p className="mt-4 md:mt-0">Designed & Developed by Adnan Bin Farook.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
