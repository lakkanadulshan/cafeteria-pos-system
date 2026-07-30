import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  Loader2, 
  Search, 
  Lock,
  Mail,
  CheckCircle,
  AlertCircle
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
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser.id) {
      alert("You cannot deactivate your own admin account!");
      return;
    }

    const action = user.isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} ${user.fullName}'s account?`)) return;

    try {
      await api.patch(`/users/${user.id}/status`, { isActive: !user.isActive });
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  const handleChangeRole = async (user, newRole) => {
    if (user.id === currentUser.id) {
      alert("You cannot change your own role!");
      return;
    }

    try {
      await api.put(`/users/${user.id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user role");
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-purple-600"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-purple-600"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admins Only</option>
            <option value="CASHIER">Cashiers Only</option>
          </select>

        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <Users size={16} className="text-purple-600" />
          <span>Total Registered Staff: {users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
            <p className="text-xs font-bold">Loading User Accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-semibold">
            No matching user accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Staff Member</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* User Info */}
                    <td className="p-4 pl-6 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 font-black flex items-center justify-center border border-purple-100">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{u.fullName}</p>
                          <p className="text-[10px] font-normal text-slate-400">ID: #{u.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    {/* Role Selector */}
                    <td className="p-4">
                      {u.id === currentUser.id ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-black">
                          <Shield size={12} /> ADMIN (YOU)
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u, e.target.value)}
                          className="bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-[11px] rounded-xl px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                        >
                          <option value="CASHIER">CASHIER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                        u.isActive 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {u.isActive ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        <span>{u.isActive ? 'ACTIVE' : 'BLOCKED'}</span>
                      </span>
                    </td>

                    {/* Status Toggle Action */}
                    <td className="p-4 pr-6 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ml-auto ${
                            u.isActive
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          <span>{u.isActive ? 'Deactivate' : 'Activate'}</span>
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserManager;