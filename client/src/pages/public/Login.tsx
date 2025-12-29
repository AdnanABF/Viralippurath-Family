import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login("SUPER_ADMIN"); // mock role
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-serif text-stone-800 mb-6 text-center">
          Admin Login
        </h1>

        <button
          onClick={handleLogin}
          className="w-full bg-amber-700 text-white py-3 rounded-xl hover:bg-amber-800 transition-all"
        >
          Login as Admin (Mock)
        </button>
      </div>
    </div>
  );
};

export default Login;
