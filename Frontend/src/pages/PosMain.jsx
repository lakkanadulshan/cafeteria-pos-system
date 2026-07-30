import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle2
} from 'lucide-react';

// Sample Food Categories & Items Mock Data
const CATEGORIES = ['All', 'Coffee', 'Tea', 'Bakery', 'Desserts'];

const MOCK_FOODS = [
  { id: 1, name: 'Espresso Single', price: 650, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300' },
  { id: 2, name: 'Cappuccino Large', price: 950, category: 'Coffee', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300' },
  { id: 3, name: 'Iced Latte', price: 1100, category: 'Coffee', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300' },
  { id: 4, name: 'Ceylon Milk Tea', price: 450, category: 'Tea', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300' },
  { id: 5, name: 'Chocolate Donut', price: 550, category: 'Bakery', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300' },
  { id: 6, name: 'Butter Croissant', price: 600, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300' },
  { id: 7, name: 'Blueberry Cheesecake', price: 1350, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300' },
];

const PosMain = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

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

  // Update Item Quantity
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

  // Remove Item
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Filtered Food Items
  const filteredFoods = MOCK_FOODS.filter((food) => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% Tax
  const grandTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col h-screen overflow-hidden">
      
      {/* 1. Header Bar */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl">
            <Coffee size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wide leading-tight">Bloom Café POS</h1>
            <p className="text-[11px] text-slate-400">Cashier Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold">{user.fullName || 'Cashier'}</p>
            <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              {user.role || 'CASHIER'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-3 py-1.5 rounded-xl border border-rose-500/30 transition-all text-xs font-bold"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. Left Menu & Card Section */}
        <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
          
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search food or beverage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all shadow-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                      : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-1">
            {filteredFoods.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white border border-slate-200/80 hover:border-purple-400 rounded-3xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="h-32 w-full rounded-2xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1.5 line-clamp-1">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                  <p className="font-black text-slate-900 text-sm">
                    Rs. {item.price.toFixed(2)}
                  </p>
                  <button className="p-2 bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white rounded-xl transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Right Side Bill / Cart Section */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg shrink-0">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-purple-600" />
              <h2 className="font-black text-slate-800 text-base">Current Order</h2>
            </div>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {cart.reduce((total, i) => total + i.quantity, 0)} Items
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <ShoppingBag size={40} className="opacity-30 stroke-1" />
                <p className="text-xs font-semibold">No items added to order yet.</p>
                <p className="text-[11px] text-slate-300">Click on menu items to add them.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black text-slate-800 px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Bill Summary & Checkout */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 shrink-0">
            
            {/* Payment Method Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/60 rounded-2xl">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all ${
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
                className={`py-2 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CreditCard size={14} />
                <span>Card</span>
              </button>
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Government Tax (8%)</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-purple-600">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Print & Complete Order Button */}
            <button
              disabled={cart.length === 0}
              className="w-full bg-purple-600 hover:bg-slate-900 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-purple-200 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={16} />
              <span>Complete & Print Bill</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PosMain;