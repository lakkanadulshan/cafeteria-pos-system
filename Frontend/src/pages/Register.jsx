import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import api from "../api/axios";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Password matching check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please check again.");
      setLoading(false);
      return;
    }

    try {
      // Backend Register API Call
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      const response = await api.post("/auth/register", payload);
      
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        
        // Redirect to Login page after 2.5s passing state message
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Registration successful! Once the Admin approves your request, a verification link will be sent to your email."
            }
          });
        }, 2500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-sans bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900 relative overflow-x-hidden px-4 py-12">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 flex items-center gap-1.5 bg-white/80 border border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm backdrop-blur-md transition-all hover:border-purple-200"
      >
        <ChevronLeft size={16} />
        <span>Back to Home</span>
      </Link>

      {/* Register Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white/80 border border-slate-100 rounded-3xl p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-xl">
        
        {/* Card Header & Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative p-1 bg-white rounded-2xl border border-slate-200 shadow-sm mb-4">
            <img src={logoImg} alt="Bloom Café Logo" className="w-10 h-10 object-contain rounded-xl" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create an Account<span className="text-purple-600">.</span>
          </h2>
          <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase mt-1">
            Request access to Bloom Café POS
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-6 text-xs flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold text-sm">Request Submitted!</p>
              <p className="mt-1 text-emerald-700 leading-relaxed">
                Your account is pending Admin approval. Check your email inbox for the verification link once approved. Redirecting to sign in...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Input */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="fullName"
                required
                placeholder="Kasun Perera"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="kasun@bloomcafe.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-11 py-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-11 py-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-6 bg-purple-600 hover:bg-slate-900 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-200 hover:shadow-slate-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs font-medium text-slate-500">
            Already have an active account?{" "}
            <Link to="/login" className="font-bold text-purple-600 hover:text-purple-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;