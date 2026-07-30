import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  Flame, 
  Loader2, 
  BarChart3,
  Award
} from 'lucide-react';

const ReportManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySales, setDailySales] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [selectedDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [salesRes, topItemsRes] = await Promise.all([
        api.get(`/reports/daily-sales?date=${selectedDate}`),
        api.get('/reports/top-items?limit=5')
      ]);

      setDailySales(salesRes.data);
      setTopItems(topItemsRes.data);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const avgOrderValue = dailySales.totalOrders > 0 
    ? (parseFloat(dailySales.totalRevenue) / dailySales.totalOrders).toFixed(2) 
    : '0.00';

  return (
    <div className="space-y-6">
      
      {/* Date Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-600" />
            <span>Sales & Analytics Overview</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Track daily income and top-performing menu items</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700">
          <Calendar size={16} className="text-purple-600" />
          <span>Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent font-extrabold focus:outline-none text-slate-900 cursor-pointer"
          />
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Revenue</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Rs. {parseFloat(dailySales.totalRevenue).toFixed(2)}
            </h2>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">
              For {selectedDate}
            </p>
          </div>
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
            <DollarSign size={28} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Completed Orders</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {dailySales.totalOrders}
            </h2>
            <p className="text-[10px] text-purple-600 font-bold mt-1">
              Successful Transactions
            </p>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <ShoppingBag size={28} />
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Avg. Order Value</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Rs. {avgOrderValue}
            </h2>
            <p className="text-[10px] text-amber-600 font-bold mt-1">
              Per Order Average
            </p>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <TrendingUp size={28} />
          </div>
        </div>

      </div>

      {/* Top Selling Items Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500 fill-orange-500" />
            <h3 className="font-black text-slate-800 text-base">Top 5 Best Selling Items</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">Overall All-Time Favorites</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
            <p className="text-xs font-bold">Calculating Analytics...</p>
          </div>
        ) : topItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-semibold">
            No completed sales data available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {topItems.map((item, index) => {
              const maxQty = topItems[0]?.totalQuantitySold || 1;
              const percentage = Math.round((item.totalQuantitySold / maxQty) * 100);

              return (
                <div key={item.menuItem?.id || index} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-[10px] font-black ${
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-slate-200 text-slate-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-slate-800">{item.menuItem?.name || 'Item'}</span>
                      <span className="text-[10px] font-extrabold uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        {item.menuItem?.category?.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-900 font-black">{item.totalQuantitySold} Units Sold</span>
                      <span className="text-slate-400 font-semibold text-[10px] block">
                        Rs. {parseFloat(item.menuItem?.price || 0).toFixed(2)} each
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ReportManager;