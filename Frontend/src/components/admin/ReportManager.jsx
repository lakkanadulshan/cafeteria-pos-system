import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast'; 
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  Flame, 
  Loader2, 
  BarChart3,
  Award,
  ChevronRight,
  Target
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
      toast.error("Failed to sync matrix reports");
    } finally {
      setLoading(false);
    }
  };

  const avgOrderValue = dailySales.totalOrders > 0 
    ? (parseFloat(dailySales.totalRevenue) / dailySales.totalOrders).toFixed(2) 
    : '0.00';

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      
      {/* --- 🟢 HEADER & DATE FILTER --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          {/* <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <BarChart3 size={24} />
          </div> */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Analytics Overview
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Matrix performance tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 group hover:border-purple-200 transition-all">
          <Calendar size={18} className="text-purple-600" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Node Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent font-black text-sm text-slate-900 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* --- 🟢 KPI SUMMARY GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Total Revenue */}
        <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-500">
          {/* <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              <DollarSign size={28} />
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Revenue Node</span>
          </div> */}
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">TOTAL SALES</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            Rs. {parseFloat(dailySales.totalRevenue).toFixed(2)}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Updated for Today {selectedDate}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-500">
          {/* <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
              <ShoppingBag size={28} />
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Order Node</span>
          </div> */}
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">TOTAL ORDERS</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {dailySales.totalOrders} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Orders</span>
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">Completed Orders</span>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-500">
          {/* <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
              <Target size={28} />
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Average Node</span>
          </div> */}
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">AVERAGE ORDER VALUE</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            Rs. {avgOrderValue}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Average per Completed Order</span>
          </div>
        </div>

      </div>

      {/* --- 🟢 TOP SELLING ITEMS SECTION --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
               <Flame size={20} className="fill-purple-400 text-purple-400" />
            </div> */}
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Best Selling Matrix</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Top 5 Performing Nodes</p>
            </div>
          </div>
          <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-slate-100">
            Performance Index
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 font-black">Calculating Analytics...</p>
          </div>
        ) : topItems.length === 0 ? (
          <div className="py-20 text-center text-slate-300">
             <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
             <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No sales data initialized</p>
          </div>
        ) : (
          <div className="space-y-8">
            {topItems.map((item, index) => {
              const maxQty = topItems[0]?.totalQuantitySold || 1;
              const percentage = Math.round((item.totalQuantitySold / maxQty) * 100);

              return (
                <div key={item.menuItem?.id || index} className="space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border transition-all duration-300 ${
                        index === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200' :
                        'bg-slate-50 text-slate-400 border-slate-100 group-hover:border-purple-200 group-hover:text-purple-600'
                      }`}>
                        0{index + 1}
                      </span>
                      <div>
                        <span className="text-slate-900 font-black text-sm uppercase tracking-tight">{item.menuItem?.name || 'Item'}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[9px] font-black uppercase text-purple-500 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 shadow-sm">
                            {item.menuItem?.category?.name || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-900 font-black text-lg tracking-tighter">{item.totalQuantitySold} Units</span>
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-0.5">
                        Valuation: Rs. {parseFloat(item.menuItem?.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar with modern look */}
                  <div className="relative w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(147,51,234,0.3)]" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- 🟢 FOOTER BRAND LABEL --- */}
      <div className="pt-8 border-t border-slate-50 flex justify-center">
         <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Bloom Café Data Intelligence Node</span>
      </div>

    </div>
  );
};

export default ReportManager;