import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast'; 
import Swal from 'sweetalert2'; 
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  Loader2, 
  Search, 
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Filter,
  ChevronRight
} from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser.id) {
      toast.error("You cannot deactivate your own admin node!");
      return;
    }

    const action = user.isActive ? "deactivate" : "activate";
    
    const result = await Swal.fire({
      title: `${action.toUpperCase()} Node?`,
      text: `Are you sure you want to ${action} ${user.fullName}'s access?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: user.isActive ? '#f43f5e' : '#6366f1',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: `Yes, ${action}`,
      borderRadius: '24px'
    });

    if (result.isConfirmed) {
      const loadingToast = toast.loading("Updating status...");
      try {
        await api.patch(`/users/${user.id}/status`, { isActive: !user.isActive });
        toast.success(`Account ${user.isActive ? 'deactivated' : 'activated'}`, { id: loadingToast });
        fetchUsers();
      } catch (err) {
        toast.error("Status update failed", { id: loadingToast });
      }
    }
  };

  const handleChangeRole = async (user, newRole) => {
    if (user.id === currentUser.id) {
      toast.error("Self-role modification is blocked");
      return;
    }

    const loadingToast = toast.loading("Syncing permissions...");
    try {
      await api.put(`/users/${user.id}/role`, { role: newRole });
      toast.success("Access level updated", { id: loadingToast });
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role", { id: loadingToast });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* --- 🟢 SEARCH & FILTER MODULE --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full md:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Search staff directory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="relative w-full md:w-64 group">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-600 focus:bg-white focus:border-purple-600 outline-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins Only</option>
              <option value="CASHIER">Cashiers Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm">
          <Users size={18} className="text-purple-600" />
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
            Total Staff Nodes: {users.length}
          </span>
        </div>
      </div>

      {/* --- 🟢 STAFF TABLE --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="py-32 text-center">
            <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 font-black">Accessing Directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
               <Users size={32} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Node Not Found</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">No matching staff members in this sector.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-10 py-6">Identity Node</th>
                  <th className="px-10 py-6">Network Email</th>
                  <th className="px-10 py-6 text-center">Access Level</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Matrix Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-all group">
                    
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-50 to-white flex items-center justify-center text-purple-600 font-black text-base border border-purple-100 shadow-sm group-hover:scale-110 transition-transform">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-[15px] uppercase tracking-tight">{u.fullName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID Node: #{u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-10 py-7">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Mail size={14} className="text-slate-300" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="px-10 py-7 text-center">
                      {u.id === currentUser.id ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white border border-slate-900 shadow-lg shadow-slate-200">
                          <Shield size={12} className="text-purple-400" /> MASTER ROOT
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 font-black text-[10px] uppercase tracking-widest rounded-xl px-4 py-2 focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 outline-none cursor-pointer"
                        >
                          <option value="CASHIER">CASHIER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>

                    <td className="px-10 py-7 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                        u.isActive 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        {u.isActive ? 'ACTIVE' : 'BLOCKED'}
                      </span>
                    </td>

                    <td className="px-10 py-7 text-right">
                      {u.id !== currentUser.id ? (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`group/btn px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center gap-2 ml-auto ${
                            u.isActive
                              ? 'bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-rose-100'
                              : 'bg-white border border-emerald-100 text-emerald-500 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-100'
                          }`}
                        >
                          {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          <span>{u.isActive ? 'Deactivate' : 'Activate'}</span>
                        </button>
                      ) : (
                        <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Self Locked</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- 🟢 FOOTER BRAND LABEL --- */}
      <div className="pt-8 border-t border-slate-50 flex justify-center">
         <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Bloom Café Staff Hierarchy Matrix</span>
      </div>

    </div>
  );
};

export default UserManager;