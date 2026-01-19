import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      /**
       * 1. Call the service.
       * The backend sets HttpOnly cookies.
       * The interceptor unwraps the response to give us { user: { ... } }
       */
      const data = await authService.login({ username, password });

      /**
       * 2. Update context with user data.
       * Note: We no longer manually save tokens to localStorage here.
       * The 'login' function in AuthContext handles saving the non-sensitive
       * user profile 'hint' to localStorage.
       */
      login(data.user);

      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      // Logic for specific login error messaging
      if (!err.response) {
        setError("Network error. Please try again later.");
      } else if (err.response.status === 429) {
        setError("Too many attempts. Please try again after 1 minute.");
      } else {
        setError("Invalid username or password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-stone-800">Admin Login</h1>
          <p className="text-stone-500 text-sm mt-2">
            Access the family portal
          </p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
              placeholder="admin@viralippurath"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 text-white font-bold py-3.5 rounded-xl hover:bg-amber-800 transition-all disabled:opacity-60 shadow-lg shadow-amber-900/10"
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
