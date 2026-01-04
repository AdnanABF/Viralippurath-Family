import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TriangleAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Decorative Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-full border border-amber-100">
          <TriangleAlert
            size={37}
            strokeWidth={1.5}
            className="text-amber-700"
          />
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-serif text-stone-900 mb-3">
          Access Restricted
        </h1>
        <p className="text-stone-600 mb-8 leading-relaxed">
          It looks like you don't have the necessary permissions to view this
          page. Please contact a Super Admin if you believe this is a mistake.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-all active:scale-95"
          >
            Go to Dashboard
          </button>
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-white text-stone-600 border border-stone-200 rounded-lg font-medium hover:bg-stone-50 transition-all active:scale-95"
          >
            Sign Out
          </button>
        </div>

        {/* Brand Footer */}
        <div className="mt-12">
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
            Viralippurath Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
