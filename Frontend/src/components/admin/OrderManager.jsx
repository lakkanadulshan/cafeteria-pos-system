import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast'; 
import Swal from 'sweetalert2'; 
import { 
  ShoppingBag, 
  Search, 
  Calendar, 
  Filter, 
  Eye, 
  Printer, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  X,
  CreditCard,
  Banknote,
  Receipt,
  ChevronRight
} from 'lucide-react';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/orders', { params });
      setOrders(response.data);
    } catch (err) {
      toast.error("Failed to sync order history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (orderId) => {
    setLoadingReceipt(true);
    setIsModalOpen(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (err) {
      toast.error("Receipt loading failed");
      setIsModalOpen(false);
    } finally {
      setLoadingReceipt(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const result = await Swal.fire({
      title: 'Update Status?',
      text: `Change order #${orderId} to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Confirm Update',
      borderRadius: '24px'
    });

    if (result.isConfirmed) {
      const loadingToast = toast.loading("Updating order status...");
      try {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        toast.success(`Order ${newStatus.toLowerCase()} successfully`, { id: loadingToast });
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      } catch (err) {
        toast.error("Failed to update status", { id: loadingToast });
      }
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* --- 🟢 FILTER MODULE --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
            <Calendar size={16} className="text-purple-600" />
            <input 
              type="date" value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-center text-slate-300">
            <ChevronRight size={16} />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
            <Calendar size={16} className="text-purple-600" />
            <input 
              type="date" value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
            />
          </div>

          <div className="relative group min-w-[180px]">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-700 focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 outline-none appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm">
          <ShoppingBag size={18} className="text-purple-600" />
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* --- 🟢 ORDERS TABLE --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="py-32 text-center">
            <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 font-black">Syncing Order Nodes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
               <Receipt size={32} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Empty Log</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">No orders match the current filter matrix.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6">Timestamp</th>
                  <th className="px-10 py-6">Cashier Node</th>
                  <th className="px-10 py-6">Payment Mode</th>
                  <th className="px-10 py-6 text-center">Valuation</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Matrix Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-7">
                      <span className="font-black text-purple-600 text-sm tracking-widest">#{ord.id}</span>
                    </td>
                    <td className="px-10 py-7">
                      <p className="text-slate-900 font-bold text-xs uppercase">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                           {ord.user?.fullName ? ord.user.fullName.charAt(0) : 'C'}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{ord.user?.fullName || 'Cashier'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 border border-slate-200 shadow-sm">
                        {ord.paymentMethod === 'CARD' ? <CreditCard size={14} /> : <Banknote size={14} />}
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span className="font-black text-slate-900 text-base tracking-tighter">Rs. {parseFloat(ord.totalAmount).toFixed(2)}</span>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                        ord.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        ord.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ord.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : ord.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <button
                        onClick={() => handleViewReceipt(ord.id)}
                        className="bg-slate-900 hover:bg-purple-600 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center gap-2 ml-auto"
                      >
                        <Eye size={14} /> View Node
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- 🟢 DIGITAL RECEIPT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white border border-slate-100 rounded-[3rem] max-w-sm w-full p-10 shadow-2xl relative z-10 animate-in zoom-in-95 duration-500 overflow-hidden">
            
            <div className="flex justify-between items-center mb-10 print:hidden">
              <h3 className="font-black text-slate-900 text-2xl uppercase tracking-tighter ">Bill Preview</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all active:scale-90"><X size={20} /></button>
            </div>

            {loadingReceipt ? (
              <div className="py-20 text-center">
                <Loader2 size={32} className="animate-spin text-purple-600 mx-auto" />
              </div>
            ) : selectedOrder && (
              <div className="font-sans space-y-8">
                
                {/* Brand Header */}
                <div className="text-center space-y-2 pb-6 border-b border-dashed border-slate-100">
                  <h2 className="font-black text-2xl text-slate-900 tracking-tighter uppercase leading-none">bloom café<span className="text-purple-600">.</span></h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Matrix Terminal #01</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Node Identity</span>
                    <span className="text-slate-900">#{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Timestamp</span>
                    <span className="text-slate-900">{new Date(selectedOrder.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Validation</span>
                    <span className={`px-2 py-0.5 rounded-lg border ${selectedOrder.status === 'COMPLETED' ? 'border-emerald-100 text-emerald-600 bg-emerald-50' : 'border-rose-100 text-rose-600 bg-rose-50'}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="flex justify-between group">
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight uppercase">{item.menuItem?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} x Rs. {parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      <span className="font-black text-slate-900 text-sm">
                        Rs. {(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Grand Total */}
                <div className="pt-6 border-t border-dashed border-slate-200">
                   <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black text-purple-600 tracking-tighter">Rs. {parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 print:hidden">
                  {selectedOrder.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                      className="w-1/2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 bg-slate-900 hover:bg-purple-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Printer size={16} /> Print Bill
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManager;