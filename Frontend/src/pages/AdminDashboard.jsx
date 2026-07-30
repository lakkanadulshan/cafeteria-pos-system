import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import logoImg from "../assets/logo.png";
import { 
  Users, 
  Send, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Shield
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch Pending Staff
  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/auth/pending-users");
      setPendingUsers(response.data);
    } catch (err) {
      setError("Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Send Verification Link / Approve
  const handleSendLink = async (userId, userEmail) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    setMessage(null);
    setError(null);

    try {
      const response = await api.post(`/auth/send-verification/${userId}`);
      setMessage(`Verification link sent successfully to ${userEmail}!`);
      
      // List එක Refresh කිරීම
      fetchPendingUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification link.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            <img src={logoImg} alt="Bloom Café" className="w-8 h-8 object-contain rounded-lg" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900">
              Bloom Café <span className="text-purple-600">Admin</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Staff Access Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <Shield size={14} className="text-purple-600" />
            <span className="text-xs font-bold text-slate-700">{currentUser.fullName || "Admin"}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
              <Users className="text-purple-600" size={26} />
              <span>Pending Staff Approval</span>
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Review registered cashiers and trigger email magic links for verification.
            </p>
          </div>

          <button
            onClick={fetchPendingUsers}
            disabled={loading}
            className="self-start sm:self-auto bg-white border border-slate-200 hover:border-purple-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-purple-600" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Success Alert */}
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-6 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span className="font-bold">{message}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Pending Users Table Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <Loader2 size={32} className="animate-spin text-purple-600 mb-3" />
              <p className="text-xs font-bold uppercase tracking-wider">Loading Requests...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Clock size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700">No Pending Approvals</p>
              <p className="text-xs text-slate-400 mt-1">
                All staff accounts are currently verified or no new registration requests found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="p-4 pl-6">Full Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Requested On</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-900">{user.fullName || "N/A"}</td>
                      <td className="p-4 text-slate-600">{user.email}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                          <Clock size={12} />
                          <span>Pending Link</span>
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleSendLink(user.id, user.email)}
                          disabled={actionLoading[user.id]}
                          className="bg-purple-600 hover:bg-slate-900 disabled:bg-slate-200 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-100 hover:shadow-none inline-flex items-center gap-2 text-xs"
                        >
                          {actionLoading[user.id] ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              <span>Approve & Send Link</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;