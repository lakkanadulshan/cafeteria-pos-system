import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
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
  Receipt
} from 'lucide-react';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Receipt Modal State
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
      console.error("Failed to fetch orders:", err);
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
      alert("Failed to load receipt details");
      setIsModalOpen(false);
    } finally {
      setLoadingReceipt(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change order #${orderId} status to ${newStatus}?`)) return;

    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Browser Direct Thermal Print Trigger
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Start Date */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-slate-400 font-bold">From:</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-slate-400 font-bold">To:</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

        </div>

        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <ShoppingBag size={16} className="text-purple-600" />
          <span>Total Placed Orders: {orders.length}</span>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
            <p className="text-xs font-bold">Fetching Orders History...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-semibold">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Billed By (Cashier)</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Receipt / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="p-4 pl-6 font-black text-purple-600">
                      #{ord.id}
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {new Date(ord.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>

                    <td className="p-4 font-bold text-slate-800">
                      {ord.user?.fullName || 'Cashier'}
                    </td>

                    <td className="p-4 text-slate-500 font-bold">
                      {ord._count?.orderItems || 0} Items
                    </td>

                    <td className="p-4 font-bold text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        {ord.paymentMethod === 'CARD' ? <CreditCard size={14} /> : <Banknote size={14} />}
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4 font-black text-slate-900">
                      Rs. {parseFloat(ord.totalAmount).toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                        ord.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                        ord.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {ord.status === 'COMPLETED' && <CheckCircle2 size={12} />}
                        {ord.status === 'PENDING' && <Clock size={12} />}
                        {ord.status === 'CANCELLED' && <XCircle size={12} />}
                        <span>{ord.status}</span>
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleViewReceipt(ord.id)}
                        className="bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye size={14} />
                        <span>View Bill</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THERMAL RECEIPT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 print:hidden">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <Receipt size={16} className="text-purple-600" />
                <span>Order Receipt #{selectedOrder?.id}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            {loadingReceipt ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-bold">Loading receipt details...</p>
              </div>
            ) : selectedOrder && (
              <div className="space-y-4 font-mono text-xs">
                
                {/* Receipt Header */}
                <div className="text-center space-y-1">
                  <h2 className="font-black text-sm text-slate-900 uppercase tracking-widest">BLOOM CAFÉ</h2>
                  <p className="text-[10px] text-slate-500 font-sans">No. 123, Main Street, Colombo</p>
                  <p className="text-[10px] text-slate-500 font-sans">Tel: +94 77 123 4567</p>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-dashed border-slate-200">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Info Bar */}
                <div className="text-[11px] space-y-0.5 border-b border-dashed border-slate-200 pb-2">
                  <p className="flex justify-between"><span>Order ID:</span> <span className="font-bold">#{selectedOrder.id}</span></p>
                  <p className="flex justify-between"><span>Cashier:</span> <span className="font-bold">{selectedOrder.user?.fullName}</span></p>
                  <p className="flex justify-between"><span>Pay Mode:</span> <span className="font-bold">{selectedOrder.paymentMethod}</span></p>
                </div>

                {/* Items List */}
                <div className="space-y-2 py-1 border-b border-dashed border-slate-200">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="flex justify-between text-[11px]">
                      <div>
                        <p className="font-bold text-slate-800">{item.menuItem?.name}</p>
                        <p className="text-[10px] text-slate-400">{item.quantity} x Rs. {parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      <span className="font-bold text-slate-900">
                        Rs. {(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-1 space-y-1 text-slate-900 font-bold">
                  <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-900">
                    <span>GRAND TOTAL:</span>
                    <span>Rs. {parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Print & Action Buttons */}
                <div className="flex gap-2 pt-3 print:hidden">
                  {selectedOrder.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                      className="w-1/2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white py-2.5 rounded-xl font-bold text-[11px] transition-all"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 bg-purple-600 hover:bg-slate-900 text-white font-black py-2.5 rounded-xl text-[11px] shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Printer size={14} />
                    <span>Print Receipt</span>
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