import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Large 404 Text */}
        <h1 className="text-9xl font-serif text-stone-200 mb-0 leading-none select-none">
          404
        </h1>

        <div className="-mt-8 relative z-10">
          <h2 className="text-2xl font-serif text-stone-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)} // Go back to previous page
              className="px-6 py-2.5 bg-white text-stone-600 border border-stone-200 rounded-lg font-medium hover:bg-stone-50 transition-all active:scale-95"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 shadow-md shadow-amber-700/10 transition-all active:scale-95"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-16">
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
            Viralippurath Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
