import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Loader2, 
  Coffee,
  Sparkles,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

const SetupWizard = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // Toggle state එක
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Initializing system core...");

    try {
      await api.post('/auth/initial-setup', formData);
      toast.success("Super Admin account created successfully!", { id: loadingToast });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to complete initial setup.';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans text-slate-900 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50/30 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="max-w-[440px] w-full space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Branding */}
        <div className="flex flex-col items-center gap-6">
          <div className="p-3 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-purple-500/5">
            <Coffee size={32} className="text-purple-600" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
              System Setup
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Initialize bloom café matrix
            </p>
          </div>
        </div>

        {/* Warning Badge */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
           <AlertTriangle size={20} className="text-amber-500 shrink-0" />
           <div>
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none mb-1">Attention Required</p>
              <p className="text-[11px] font-bold text-amber-600 leading-tight">No Admin account detected. Create your initial Master Root account to deploy the system.</p>
           </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-purple-500/5 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Master Identity</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
                <input
                  type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                  placeholder="e.g. System Administrator"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"> Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  placeholder="admin@bloomcafe.com"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Master Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"} 
                  name="password" required value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 transition-all"
                />
                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-purple-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 mt-4"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Create Admin</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Brand Label */}
        <div className="flex justify-center items-center gap-2">
           <Sparkles size={14} className="text-purple-500" />
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Secure Deployment Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;