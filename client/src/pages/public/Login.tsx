import { useState, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, isAuthenticated } = useAuth(); // Destructure isAuthenticated
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Safety Redirect:
   * Even though GuestGuard handles this, adding this ensures that if
   * the auth state changes, the component reacts immediately.
   */
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
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      // Save tokens to localStorage
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // Update the Context state FIRST
      login();

      // Navigate and REPLACE the history entry
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      if (!err.response) {
        setError("Network error. Please try again later.");
      } else if (err.response.status === 429) {
        // Handle Rate Limiting
        setError("Too many login attempts. Please try again after 1 minute.");
      } else {
        // Generic message for security (Unauthorized 401)
        setError("Invalid username or password");
      }
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, don't show the form at all while the redirect happens
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-serif text-stone-800 mb-8 text-center">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg">
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
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
              placeholder="username@viralippurath"
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
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 text-white font-bold py-3 rounded-xl hover:bg-amber-800 transition-all disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
