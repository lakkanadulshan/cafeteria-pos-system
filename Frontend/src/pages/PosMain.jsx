import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logoImg from '../assets/logo.png';

import { 
  Coffee, 
  LogOut, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  Banknote,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Dynamic backend origin resolution via Axios config
const BACKEND_ORIGIN = api.defaults.baseURL 
  ? new URL(api.defaults.baseURL).origin 
  : 'http://localhost:3000';

const PosMain = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Dynamic States from Backend
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // POS Interaction States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Menu and Categories from Backend API on Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, menuRes] = await Promise.all([
        api.get('/categories'),
        api.get('/menu')
      ]);

      setCategories(catRes.data || []);
      setFoods(menuRes.data || []);
    } catch (err) {
      console.error('Failed to load POS data:', err);
      setError('Failed to fetch menu items or categories from server.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for cleaning and appending dynamic absolute image URLs
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_ORIGIN}${cleanPath}`;
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Add Item to Cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Update Item Quantity in Cart
  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove Item from Cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Filter Foods based on Search Input & Selected Category
  const filteredFoods = foods.filter((food) => {
    const categoryName = food.category?.name || food.category;
    const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% Tax
  const grandTotal = subtotal + tax;

  // Complete Order / Checkout API Trigger
  const handleCompleteOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const orderPayload = {
        paymentMethod,
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await api.post('/orders', orderPayload);
      setCart([]);
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Failed to submit order:', err);
      alert(err.response?.data?.message || 'Failed to complete order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col h-screen overflow-hidden antialiased selection:bg-purple-100 selection:text-purple-900">
      
      {/* 1. Header Bar */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm">
            <img src={logoImg} alt="Bloom Café Logo" className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900">
                Bloom Café <span className="text-purple-600">POS</span>
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-100/80 border border-slate-200/80 pl-3 pr-4 py-1.5 rounded-2xl">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-sm shadow-purple-200">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : 'C')}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user.fullName || user.username || 'Cashier'}
              </p>
              <span className="text-[9px] font-black tracking-wider text-purple-600 uppercase">
                {user.role || 'CASHIER'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3.5 py-2 rounded-2xl border border-rose-200/60 transition-all text-xs font-bold shadow-sm"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. Left Side Menu Display */}
        <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto bg-slate-50/50">
          
          {/* Controls: Search and Categories */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                placeholder="Search food, beverage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all shadow-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                  selectedCategory === 'All'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id || category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                    selectedCategory === category.name
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid / Loading State / Error State */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={36} className="animate-spin text-purple-600 mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Loading Live Menu...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-rose-600 bg-rose-50 border border-rose-200/80 rounded-3xl p-6">
              <AlertCircle size={32} className="mb-2 text-rose-500" />
              <p className="text-sm font-bold">{error}</p>
              <button 
                onClick={fetchData} 
                className="mt-4 px-4 py-2 bg-white border border-rose-200 text-xs font-bold text-rose-700 rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
              >
                Try Refreshing
              </button>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <p className="text-sm font-bold text-slate-700">No menu items found</p>
              <p className="text-xs text-slate-400 mt-1">Add items from Admin Panel or check your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-1">
              {filteredFoods.map((item) => {
                const imageUrl = getFullImageUrl(item.imageUrl);

                return (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-3xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-32 w-full rounded-2xl overflow-hidden mb-3 bg-slate-100 relative flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Coffee size={32} className="text-slate-300" />
                        )}

                        <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-wider text-purple-700 bg-white/90 backdrop-blur-md border border-purple-100 px-2 py-0.5 rounded-md shadow-sm">
                          {item.category?.name || item.category || 'General'}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-slate-800 text-sm mt-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-slate-100">
                      <p className="font-black text-slate-900 text-sm">
                        Rs. {Number(item.price).toFixed(2)}
                      </p>
                      <button className="p-2 bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white rounded-xl transition-all duration-200">
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Right Side Order Cart Panel */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg shrink-0 z-10">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-black text-slate-900 text-base tracking-tight">Current Order</h2>
            </div>
            <span className="bg-purple-50 border border-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full">
              {cart.reduce((total, i) => total + i.quantity, 0)} Items
            </span>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 text-slate-300">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Your order list is empty</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select menu items to populate order</p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black text-slate-800 px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Total & Checkout */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 shrink-0">
            
            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/60 rounded-2xl">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'CASH'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Banknote size={14} />
                <span>Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CreditCard size={14} />
                <span>Card</span>
              </button>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (8%)</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-base pt-2.5 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-purple-600">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCompleteOrder}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full bg-purple-600 hover:bg-slate-900 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-purple-200 transition-all duration-200 text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Complete & Print Receipt</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PosMain;