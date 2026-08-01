import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import logoImg from '../../assets/logo.png';

// Admin Modules
import CategoryManager from '../admin/CategoryManager';
import MenuManager from '../admin/MenuManager';
import UserManager from '../admin/UserManager';
import OrderManager from '../admin/OrderManager';
import ReportManager from '../admin/ReportManager';

import { 
  Utensils, 
  Tag, 
  Users, 
  ShoppingBag, 
  BarChart2, 
  LogOut, 
  UserCheck, 
  Shield,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MonitorPlay
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Active Tab State ('menu', 'categories', 'orders', 'reports', 'users', 'approvals')
  const [activeTab, setActiveTab] = useState('menu');

  // Pending Approvals State
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoadingPending(true);
    setError(null);
    try {
      const response = await api.get('/auth/pending-users');
      setPendingUsers(response.data);
    } catch (err) {
      setError('Failed to load pending requests.');
    } finally {
      setLoadingPending(false);
    }
  };

  const handleSendLink = async (userId, userEmail) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    setMessage(null);
    setError(null);

    try {
      await api.post(`/auth/send-verification/${userId}`);
      setMessage(`Verification link sent successfully to ${userEmail}!`);
      fetchPendingUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification link.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900 flex flex-col">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR */}
      {/* ------------------------------------------------------------- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm">
            <img src={logoImg} alt="Bloom Café" className="w-8 h-8 object-contain rounded-lg" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900">
              Bloom Café <span className="text-purple-600">Admin Portal</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Management & Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Open POS Terminal Navigation Button */}
          <button
            onClick={() => navigate('/pos')}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 px-3.5 py-2 rounded-xl transition-all text-xs font-bold shadow-sm"
            title="Switch to Cashier POS View"
          >
            <MonitorPlay size={14} />
            <span className="hidden sm:inline">Open POS Terminal</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
            <Shield size={14} className="text-purple-600" />
            <span className="text-xs font-bold text-slate-700">{currentUser.fullName || 'Admin'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8">
          
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Utensils size={16} />
            <span>Menu Items</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag size={16} />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Orders History</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reports' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart2 size={16} />
            <span>Sales Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users size={16} />
            <span>Staff Management</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'approvals' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck size={16} />
            <span>Pending Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="bg-amber-400 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded-full ml-1">
                {pendingUsers.length}
              </span>
            )}
          </button>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* DYNAMIC TAB CONTENT RENDER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'reports' && <ReportManager />}
        {activeTab === 'users' && <UserManager />}

        {/* Pending Approvals Tab View */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <UserCheck className="text-purple-600" size={24} />
                  <span>Pending Staff Approvals</span>
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Review newly registered cashiers and trigger verification magic links.
                </p>
              </div>

              <button
                onClick={fetchPendingUsers}
                disabled={loadingPending}
                className="bg-slate-50 border border-slate-200 hover:border-purple-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <RefreshCw size={14} className={loadingPending ? "animate-spin text-purple-600" : ""} />
                <span>Refresh List</span>
              </button>
            </div>

            {/* Alerts */}
            {message && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span className="font-bold">{message}</span>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-3">
                <AlertCircle size={18} className="shrink-0 text-rose-600" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Pending Approvals Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              {loadingPending ? (
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
                              className="bg-purple-600 hover:bg-slate-900 disabled:bg-slate-200 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-100 inline-flex items-center gap-2 text-xs"
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
        )}

      </main>

    </div>
  );
};

export default AdminDashboard;