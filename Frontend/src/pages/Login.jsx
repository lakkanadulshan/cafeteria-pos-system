import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";
import api from "../api/axios";
import toast from "react-hot-toast"; // Toast එකතු කළා
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ChevronLeft,
  Eye,
  EyeOff
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

  // Redirect වුණාම එන message එක toast එකක් විදිහට පෙන්වන්න
  useEffect(() => {
    if (infoMessage) {
      toast.success(infoMessage);
    }
  }, [infoMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Authenticating...");

    try {
      const response = await api.post("/auth/login", formData);

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success(`Welcome back, ${user.firstName || 'User'}!`, { id: loadingToast });

        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/pos");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans text-slate-900 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-indigo-50/30 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="max-w-[420px] w-full space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Branding & Back Link */}
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="p-2 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-purple-300 transition-all duration-300 group">
            <img src={logoImg} alt="Logo" className="h-12 w-auto object-contain" />
          </Link>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              Sign In
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Access bloom café 
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-purple-500/5 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@bloomcafe.com"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-purple-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 mt-4"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Initialize Session</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center">
            <Link to="/register" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-purple-600 transition-colors">
              New Staff Member? <span className="text-purple-600 underline underline-offset-4">Register</span>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <Link to="/" className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-all">
          <ChevronLeft size={14} />
          Return to Portal
        </Link>
      </div>
    </div>
  );
};

export default Login;