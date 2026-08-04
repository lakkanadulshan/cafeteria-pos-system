import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logoImg from '../assets/logo.png';
import toast from 'react-hot-toast';

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
  ShieldCheck,
  Package
} from 'lucide-react';

const PosMain = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Dynamic States
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, menuRes] = await Promise.all([
        api.get('/categories'),
        api.get('/menu')
      ]);
      setCategories(catRes.data || []);
      setFoods(menuRes.data || []);
    } catch (err) {
      toast.error("Network synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  // Direct Cloudinary / Full HTTP URL එක ලබා ගනී
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  // ADD TO CART WITH STOCK & AVAILABILITY CHECK
  const addToCart = (item) => {
    if (!item.isAvailable) {
      toast.error(`${item.name} is currently unavailable!`);
      return;
    }
    if (item.stock <= 0) {
      toast.error(`${item.name} is out of stock!`);
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;

    if (currentQtyInCart + 1 > item.stock) {
      toast.error(`Stock limit reached! Only ${item.stock} available.`, { duration: 2000 });
      return;
    }

    setCart((prevCart) => {
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added`, { duration: 1000, position: 'bottom-left' });
  };

  // QUANTITY UPDATE WITH STOCK LIMIT CHECK
  const updateQuantity = (id, delta) => {
    const targetItem = foods.find((f) => f.id === id);
    const cartItem = cart.find((c) => c.id === id);

    if (delta > 0 && cartItem && targetItem) {
      if (cartItem.quantity + 1 > targetItem.stock) {
        toast.error(`Stock limit reached! Only ${targetItem.stock} available.`, { duration: 1500 });
        return;
      }
    }

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

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.error("Item removed from cart", { duration: 1000, position: 'bottom-left' });
  };

  const filteredFoods = foods.filter((food) => {
    const categoryName = food.category?.name || food.category;
    const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  const handleCompleteOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading("Processing order...");
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
      toast.success("Order placed successfully!", { id: loadingToast });
      fetchData(); // Sync updated stock
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete order.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col h-screen overflow-hidden selection:bg-purple-100 selection:text-purple-900">
      
      {/* 1. MODERN HEADER */}
      <header className="bg-white border-b border-slate-100 px-8 h-20 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4 group">
          <div className="p-2 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:border-purple-300 transition-all">
            <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 uppercase">
              bloom café<span className="text-purple-600">.</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Active Terminal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {user.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 px-5 py-2.5 rounded-2xl border border-purple-100 transition-all text-[11px] font-bold uppercase tracking-widest"
            >
              <ShieldCheck size={16} /> Admin Portal
            </button>
          )}

          {/* CLICKABLE PROFILE BUTTON */}
          <button
            onClick={() => navigate('/profile')}
            className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-100 hover:opacity-80 transition-all cursor-pointer group text-left"
            title="View Profile & Shift Performance"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                {user.fullName || user.username || 'Staff'}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {user.role || 'Cashier'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-900 group-hover:bg-purple-600 text-white flex items-center justify-center font-bold text-sm transition-colors shadow-sm">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
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
      </header>

      {/* Main Grid View */}
      <div className="flex flex-1 overflow-hidden bg-slate-50/30">
        
        {/* 2. MENU DISPLAY (LEFT) */}
        <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
          
          {/* Controls: Search and Categories */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between shrink-0">
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === 'All' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Items
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id || cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    selectedCategory === cat.name ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Content */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-purple-600 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Syncing Menu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 pb-10">
              {filteredFoods.map((item) => {
                const isItemDisabled = !item.isAvailable || item.stock <= 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className={`group bg-white border rounded-[2rem] p-4 shadow-sm transition-all duration-300 flex flex-col relative ${
                      isItemDisabled 
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' 
                        : 'hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer border-slate-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="h-40 w-full rounded-2xl overflow-hidden mb-4 bg-slate-50 relative">
                      {getFullImageUrl(item.imageUrl) ? (
                        <img 
                          src={getFullImageUrl(item.imageUrl)} 
                          alt={item.name} 
                          className={`h-full w-full object-cover transition-transform duration-700 ${!isItemDisabled && 'group-hover:scale-110'}`} 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-200"><Coffee size={40} /></div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white text-[9px] font-bold text-purple-600 uppercase tracking-widest shadow-sm">
                        {item.category?.name || 'Item'}
                      </div>

                      {/* UNAVAILABLE / OUT OF STOCK BADGE */}
                      {isItemDisabled && (
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg">
                            {!item.isAvailable ? 'Unavailable' : 'Out of Stock'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-sm px-1 line-clamp-1">{item.name}</h3>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                      <div>
                        <p className="font-black text-slate-900 text-base">Rs. {Number(item.price).toFixed(2)}</p>
                        <p className={`text-[10px] font-bold flex items-center gap-1 ${item.stock <= 5 ? 'text-rose-500' : 'text-slate-400'}`}>
                          <Package size={12} /> Stock: {item.stock}
                        </p>
                      </div>

                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isItemDisabled 
                          ? 'bg-slate-200 text-slate-400' 
                          : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                      }`}>
                        <Plus size={18} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. ORDER CART PANEL (RIGHT) */}
        <div className="w-[400px] bg-white border-l border-slate-100 flex flex-col h-full shadow-2xl shrink-0 z-10">
          
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg uppercase tracking-tighter">Current Order</h2>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              {cart.reduce((total, i) => total + i.quantity, 0)} Units
            </span>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-300">
                <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-relaxed">
                  Terminal ready.<br/>Select items to initialize order.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-transparent hover:border-purple-100 hover:bg-white transition-all duration-300">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                    <p className="text-[10px] font-bold text-purple-500 mt-1">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-purple-600 transition-colors"><Minus size={14} /></button>
                    <span className="text-xs font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-purple-600 transition-colors"><Plus size={14} /></button>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors" title="Remove Item"><Trash2 size={16} /></button>
                </div>
              ))
            )}
          </div>

          {/* Summary & Checkout */}
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 space-y-6 shrink-0">
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
              <button onClick={() => setPaymentMethod('CASH')} className={`py-3 flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${paymentMethod === 'CASH' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                <Banknote size={16} /> Cash
              </button>
              <button onClick={() => setPaymentMethod('CARD')} className={`py-3 flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${paymentMethod === 'CARD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                <CreditCard size={16} /> Card
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Tax (8%)</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Grand Total</span>
                <span className="text-2xl font-black text-purple-600 tracking-tighter">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCompleteOrder}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full bg-slate-900 hover:bg-purple-600 text-white font-bold py-5 rounded-[1.5rem] shadow-xl shadow-slate-200 hover:shadow-purple-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> PLACE ORDER</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosMain;