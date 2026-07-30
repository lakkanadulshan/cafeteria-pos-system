import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";
import api from "../api/axios";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  ChevronLeft,
  Eye,
  EyeOff,
  Info
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const infoMessage = location.state?.message;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Backend Login API Call
      const response = await api.post("/auth/login", formData);

      if (response.status === 200) {
        const { token, user } = response.data;

        // Save Auth token and User Data in LocalStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on User Role
        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/pos");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Back Link & Logo */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft size={16} />
            Back to Home
          </Link>
          <img src={logoImg} alt="Bloom Café Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900">Welcome Back</h1>
            <p className="text-xs font-semibold text-slate-400">Sign in to access your Bloom Café terminal</p>
          </div>

          {/* Info Banner (e.g. redirected after registration) */}
          {infoMessage && (
            <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 text-blue-700 text-xs font-medium">
              <Info size={18} className="shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-xs font-medium">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="cashier@bloomcafe.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-purple-600 hover:bg-slate-900 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-purple-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs font-semibold text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;