import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import logoImg from "../../assets/logo.png";
import toast from "react-hot-toast";

// Admin Modules
import CategoryManager from "../admin/CategoryManager";
import MenuManager from "../admin/MenuManager";
import UserManager from "../admin/UserManager";
import OrderManager from "../admin/OrderManager";
import ReportManager from "../admin/ReportManager";

import {
  Utensils,
  Tag,
  Users,
  ShoppingBag,
  BarChart2,
  LogOut,
  UserCheck,
  Clock,
  Send,
  Loader2,
  RefreshCw,
  MonitorPlay
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [activeTab, setActiveTab] = useState("menu");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [actionLoading, setActionLoading] = useState({});


  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoadingPending(true);
    try {
      const response = await api.get("/auth/pending-users");
      setPendingUsers(response.data);
    } catch (err) {
      toast.error("Failed to load pending requests.");
    } finally {
      setLoadingPending(false);
    }
  };

  const handleSendLink = async (userId, userEmail) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    const loadingToast = toast.loading(`Sending link to ${userEmail}...`);

    try {
      await api.post(`/auth/send-verification/${userId}`);
      toast.success("Verification link sent!", { id: loadingToast });
      fetchPendingUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send link.", {
        id: loadingToast,
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const menuItems = [
    { id: "menu", label: "Menu Items", icon: <Utensils size={16} /> },
    { id: "categories", label: "Categories", icon: <Tag size={16} /> },
    { id: "orders", label: "Orders History", icon: <ShoppingBag size={16} /> },
    { id: "reports", label: "Sales Reports", icon: <BarChart2 size={16} /> },
    { id: "users", label: "Staff Directory", icon: <Users size={16} /> },
    {
      id: "approvals",
      label: "Pending Approvals",
      icon: <UserCheck size={16} />,
      badge: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900 flex flex-col">
      {/* --- MODERN NAVIGATION --- */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group">
          <div className="p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:border-purple-300 transition-all">
            <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 uppercase leading-none">
              bloom café<span className="text-purple-600">.</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Admin Control Panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pos")}
            className="hidden md:flex items-center gap-2 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 px-5 py-2.5 rounded-2xl border border-slate-200 transition-all text-[11px] font-bold uppercase tracking-widest active:scale-95"
          >
            <MonitorPlay size={16} />
            POS Terminal
          </button>

          {/* 🟢 CLICKABLE PROFILE BUTTON */}
          <button
            onClick={() => navigate("/profile")}
            className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-100 hover:opacity-80 transition-all cursor-pointer group text-left"
            title="View Profile & System Info"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                {currentUser.fullName || "Administrator"}
              </p>
              <p className="text-[9px] font-bold text-purple-500 uppercase tracking-widest leading-none">
                System Root
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-900 group-hover:bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg transition-colors">
              {currentUser.fullName
                ? currentUser.fullName.charAt(0).toUpperCase()
                : "A"}
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="max-w-7xl mx-auto w-full px-8 py-10 flex-1 flex flex-col">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 bg-slate-50/50 p-2 rounded-3xl border border-slate-100 mb-10 overflow-x-auto scrollbar-none">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shrink-0 ${
                activeTab === item.id
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && pendingUsers.length > 0 && (
                <span className="bg-purple-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black border-2 border-slate-900">
                  {pendingUsers.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC CONTENT --- */}
        <div className="flex-1 animate-in fade-in duration-500">
          {activeTab === "menu" && <MenuManager />}
          {activeTab === "categories" && <CategoryManager />}
          {activeTab === "orders" && <OrderManager />}
          {activeTab === "reports" && <ReportManager />}
          {activeTab === "users" && <UserManager />}

          {/* Pending Approvals View */}
          {activeTab === "approvals" && (
            <div className="space-y-8">
              {/* Approvals Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                    Approvals Matrix
                  </h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                    Reviewing new staff requests
                  </p>
                </div>

                <button
                  onClick={fetchPendingUsers}
                  disabled={loadingPending}
                  className="bg-white border border-slate-200 hover:border-purple-300 text-slate-500 p-3 rounded-2xl transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw
                    size={18}
                    className={
                      loadingPending ? "animate-spin text-purple-600" : ""
                    }
                  />
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden">
                {loadingPending ? (
                  <div className="py-24 text-center">
                    <Loader2
                      size={40}
                      className="animate-spin text-purple-600 mx-auto mb-4"
                    />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                      Syncing Requests...
                    </p>
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <Clock size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Directory Clear
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                      No pending approval nodes found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          <th className="px-10 py-6">Staff Member</th>
                          <th className="px-10 py-6">Network Node</th>
                          <th className="px-10 py-6">Request Date</th>
                          <th className="px-10 py-6">Status</th>
                          <th className="px-10 py-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {pendingUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-slate-50/50 transition-all group"
                          >
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold border border-purple-100 shadow-sm">
                                  {user.fullName
                                    ? user.fullName.charAt(0)
                                    : "U"}
                                </div>
                                <span className="font-bold text-slate-900 text-sm">
                                  {user.fullName || "Unnamed User"}
                                </span>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-slate-500 text-sm font-bold">
                              {user.email}
                            </td>
                            <td className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-10 py-6">
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                Pending Link
                              </span>
                            </td>
                            <td className="px-10 py-6 text-right">
                              <button
                                onClick={() =>
                                  handleSendLink(user.id, user.email)
                                }
                                disabled={actionLoading[user.id]}
                                className="bg-slate-900 hover:bg-purple-600 disabled:opacity-30 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-xl shadow-slate-200 hover:shadow-purple-200 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest active:scale-95"
                              >
                                {actionLoading[user.id] ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <>
                                    <Send size={14} />
                                    <span>Approve & Sync</span>
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
        </div>
      </main>

      {/* --- FOOTER BRAND LABEL --- */}
      <footer className="py-8 px-8 border-t border-slate-50 flex justify-center">
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          Bloom Café Matrix Management Module
        </span>
      </footer>
    </div>
  );
};

export default AdminDashboard;
