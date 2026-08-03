import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import toast from 'react-hot-toast';
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  Loader2,
  BadgeCheck,
  Lock,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [fullName, setFullName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Backend authRoute path  (/api/auth/profile)
      const res = await api.get('/auth/profile');
      setProfileData(res.data.user);
      setStats(res.data.stats);
      setFullName(res.data.user.fullName || '');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Full Name is required");

    setIsUpdatingName(true);
    try {
      const res = await api.put('/auth/profile', { fullName });
      toast.success(res.data.message || "Profile details updated!");
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser) {
        storedUser.fullName = res.data.user.fullName;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return toast.error("Please fill both password fields");
    }
    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters long");
    }

    setIsChangingPassword(true);
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success(res.data.message || "Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 size={36} className="animate-spin text-amber-600 mb-3" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  // Name Initials generator (e.g. "Kasun Perera" -> "KP")
  const initials = profileData?.fullName 
    ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'US';

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-10 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 text-[11px] font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Terminal
          </div>
        </div>

        {/* Identity Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-amber-800 text-amber-50 flex items-center justify-center font-black text-3xl shadow-lg shadow-amber-900/10 border-4 border-amber-100 shrink-0">
            {initials}
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">{profileData?.fullName}</h1>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                profileData?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                <ShieldCheck size={12} /> {profileData?.role}
              </span>
            </div>
            
            <p className="text-xs font-semibold text-slate-500 flex items-center justify-center md:justify-start gap-1">
              <Mail size={13} /> {profileData?.email}
            </p>
            
            <p className="text-[11px] font-medium text-slate-400 flex items-center justify-center md:justify-start gap-1 pt-1">
              <Clock size={13} /> Registered: {new Date(profileData?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Real-world POS Shift Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
              <ShoppingBag size={18} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Orders</p>
            <h3 className="text-xl font-black text-slate-900">{stats?.todayOrdersCount || 0} <span className="text-xs font-normal text-slate-400">Bills</span></h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
              <TrendingUp size={18} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</p>
            <h3 className="text-xl font-black text-slate-900">Rs. {Number(stats?.todaySalesVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
              <BadgeCheck size={18} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Volume</p>
            <h3 className="text-xl font-black text-slate-900">Rs. {Number(stats?.totalSalesVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        {/* Form Controls: Staff Info & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Edit Staff Name */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="text-amber-800" size={18} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Account Details</h2>
            </div>

            <form onSubmit={handleNameUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Registered Email</label>
                <input 
                  type="text" 
                  disabled 
                  value={profileData?.email || ''} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-all"
                  placeholder="Enter Full Name"
                />
              </div>

              <button 
                type="submit" 
                disabled={isUpdatingName}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-200"
              >
                {isUpdatingName ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Save Changes</>}
              </button>
            </form>
          </div>

{/* Change Security Password */}
<div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
    <Lock className="text-amber-800" size={18} />
    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Change Password</h2>
  </div>

  <form onSubmit={handlePasswordChange} className="space-y-4">
    
    {/* Current Password Field */}
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
        Current Password
      </label>
      <div className="relative">
        <input 
          type={showCurrentPassword ? "text" : "password"} 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-all"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>

    {/* New Password Field */}
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
        New Password
      </label>
      <div className="relative">
        <input 
          type={showNewPassword ? "text" : "password"} 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none transition-all"
          placeholder="At least 8 characters"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>

    <button 
      type="submit" 
      disabled={isChangingPassword}
      className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-900/10"
    >
      {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : <><KeyRound size={16} /> Update Password</>}
    </button>
  </form>
</div>

        </div>

      </div>
    </div>
  );
};

export default Profile;