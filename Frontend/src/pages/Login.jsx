import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";
import api from "../api/axios";
import toast from "react-hot-toast"; 
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ChevronLeft,
  Eye,
  EyeOff,
  KeyRound,
  X,
  CheckCircle2
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const infoMessage = location.state?.message;

  // Main Login Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🟢 FORGOT PASSWORD MODAL STATES
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

        toast.success(`Welcome back, ${user.fullName || user.firstName || 'User'}!`, { id: loadingToast });

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

  // 🟢 FORGOT PASSWORD - STEP 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setResetLoading(true);
    const loadingToast = toast.loading("Sending 6-digit OTP...");

    try {
      await api.post('/auth/forgot-password/request-otp', { email: resetEmail });
      toast.success("OTP sent to your email!", { id: loadingToast });
      setResetStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP", { id: loadingToast });
    } finally {
      setResetLoading(false);
    }
  };

  // 🟢 FORGOT PASSWORD - STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter valid 6-digit OTP");
      return;
    }

    setResetLoading(true);
    const loadingToast = toast.loading("Verifying OTP...");

    try {
      await api.post('/auth/forgot-password/verify-otp', { email: resetEmail, otp });
      toast.success("OTP Verified successfully!", { id: loadingToast });
      setResetStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP code", { id: loadingToast });
    } finally {
      setResetLoading(false);
    }
  };

  // 🟢 FORGOT PASSWORD - STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setResetLoading(true);
    const loadingToast = toast.loading("Updating password...");

    try {
      await api.post('/auth/forgot-password/reset-password', { 
        email: resetEmail, 
        otp, 
        newPassword 
      });

      toast.success("Password reset successful! Please login.", { id: loadingToast });
      closeForgotModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password", { id: loadingToast });
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setResetStep(1);
    setResetEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
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
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
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
                {/* 🟢 FORGOT PASSWORD BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-bold text-purple-600 hover:text-purple-700 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-purple-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 mt-4 cursor-pointer"
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

      {/* ------------------------------------------------------------- */}
      {/* 🟢 FORGOT PASSWORD MULTI-STEP MODAL (Matching Light Design System) */}
      {/* ------------------------------------------------------------- */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={closeForgotModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-purple-600">
                <KeyRound size={22} />
              </div>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">Reset Password</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                Step {resetStep} of 3
              </p>
            </div>

            {/* STEP 1: REQUEST OTP */}
            {resetStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <p className="text-xs font-medium text-slate-500 text-center leading-relaxed">
                  Enter your registered email address to receive a 6-digit verification code.
                </p>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="registered@bloomcafe.com"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:shadow-purple-200 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? <Loader2 size={16} className="animate-spin" /> : "Send Verification Code"}
                </button>
              </form>
            )}

            {/* STEP 2: VERIFY OTP */}
            {resetStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-xs font-medium text-slate-500 text-center leading-relaxed">
                  We sent a 6-digit code to <span className="text-purple-600 font-bold">{resetEmail}</span>. Enter it below.
                </p>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5 text-center">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 text-xl font-mono font-bold text-purple-600 tracking-[0.5em] focus:outline-none focus:bg-white focus:border-purple-600 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:shadow-purple-200 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? <Loader2 size={16} className="animate-spin" /> : "Verify Code"}
                </button>
              </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {resetStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs font-medium text-slate-500 text-center leading-relaxed">
                  Verification successful! Create a new password for your account.
                </p>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5 ml-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:shadow-purple-200 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? <Loader2 size={16} className="animate-spin" /> : "Reset & Save Password"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;