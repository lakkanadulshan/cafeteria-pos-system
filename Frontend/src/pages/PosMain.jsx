import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Coffee, Utensils } from 'lucide-react';

const PosMain = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl">
            <Coffee size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide">Bloom Café POS</h1>
            <p className="text-xs text-slate-400">Cashier Counter Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold">{user.fullName || 'Cashier'}</p>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              {user.role || 'CASHIER'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-3.5 py-2 rounded-xl border border-rose-500/30 transition-all text-xs font-bold"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto border border-purple-100">
            <Utensils size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Welcome to Bloom Café POS Main Page!</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Logged in successfully as {user.fullName}.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PosMain;