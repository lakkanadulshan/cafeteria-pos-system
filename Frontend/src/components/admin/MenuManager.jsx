import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  Loader2, 
  Upload, 
  X, 
  Search,
  Package,
  Edit3,
  Filter
} from 'lucide-react';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        api.get('/menu'),
        api.get('/categories')
      ]);
      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image selected");
    }
  };

  // Direct Cloudinary / Full HTTP URL එක ලබා ගනී
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path;
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        stock: item.stock,
        categoryId: item.categoryId,
        imageFile: null
      });
      setImagePreview(getFullImageUrl(item.imageUrl));
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a valid category");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading(editingItem ? "Updating item..." : "Adding new item...");

    const postData = new FormData();
    postData.append('name', formData.name);
    postData.append('description', formData.description);
    postData.append('price', formData.price);
    postData.append('stock', formData.stock || 0);
    postData.append('categoryId', formData.categoryId);
    if (formData.imageFile) {
      postData.append('image', formData.imageFile);
    }

    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem.id}`, postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Item updated successfully", { id: loadingToast });
      } else {
        await api.post('/menu', postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("New food item added", { id: loadingToast });
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      await api.put(`/menu/${item.id}`, { isAvailable: !item.isAvailable });
      toast.success(`${item.name} is now ${!item.isAvailable ? 'Available' : 'Unavailable'}`, { id: loadingToast });
      fetchData();
    } catch (err) {
      toast.error("Failed to update status", { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Food Item?',
      text: "Are you sure you want to remove this item from the menu?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Delete',
      borderRadius: '24px'
    });

    if (result.isConfirmed) {
      const loadingToast = toast.loading("Deleting item...");
      try {
        await api.delete(`/menu/${id}`);
        toast.success("Item deleted successfully", { id: loadingToast });
        fetchData();
      } catch (err) {
        toast.error("Failed to delete item", { id: loadingToast });
      }
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', imageFile: null });
    setImagePreview(null);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategoryFilter === 'ALL' || item.categoryId === parseInt(selectedCategoryFilter, 10);
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* FILTER & ACTION BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full md:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="relative w-full md:w-64 group">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-600 focus:bg-white focus:border-purple-600 outline-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="w-full lg:w-auto bg-slate-900 hover:bg-purple-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-purple-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} /> Add Food Item
        </button>
      </div>

      {/* MENU GRID */}
      {loading ? (
        <div className="py-32 text-center">
          <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 font-black">Loading Menu...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
           <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-100">
            <Utensils size={32} />
          </div>
          <p className="text-slate-900 font-black text-lg">No Food Items Found</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Add a new item to populate the menu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredItems.map(item => {
            const itemImageUrl = getFullImageUrl(item.imageUrl);
            return (
              <div key={item.id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="w-full h-52 rounded-[2rem] bg-slate-50 overflow-hidden relative border border-slate-50 shadow-inner">
                    {itemImageUrl ? (
                      <img src={itemImageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-200"><Utensils size={48} strokeWidth={1} /></div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black text-purple-600 uppercase tracking-widest border border-white shadow-sm">
                        {item.category?.name || 'Category'}
                      </span>
                    </div>
                  </div>

                  <div className="px-2">
                    <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-purple-600 transition-colors leading-none">{item.name}</h4>
                    <p className="text-slate-400 text-xs font-bold mt-2 line-clamp-2 leading-relaxed">{item.description || 'No description provided.'}</p>
                    
                    <div className="flex items-center gap-4 mt-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Price</span>
                        <span className="font-black text-slate-900 text-xl tracking-tighter">Rs. {parseFloat(item.price).toFixed(2)}</span>
                      </div>
                      <div className={`flex flex-col border-l border-slate-100 pl-4`}>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Stock</span>
                        <span className={`text-[11px] font-black flex items-center gap-1.5 ${item.stock > 10 ? 'text-slate-600' : 'text-rose-500'}`}>
                          <Package size={14} /> {item.stock} Units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      item.isAvailable && item.stock > 0
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable && item.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                    {item.isAvailable && item.stock > 0 ? 'Available' : 'Unavailable'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-purple-50 border border-slate-100 transition-all flex items-center justify-center active:scale-90"
                      title="Edit Item"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 transition-all flex items-center justify-center active:scale-90"
                      title="Delete Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white border border-slate-100 rounded-[3rem] max-w-xl w-full p-12 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 scrollbar-none">
            
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-black text-slate-900 text-3xl italic tracking-tight">
                  {editingItem ? 'Edit Food Item' : 'Add New Item'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure Item Details</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl flex items-center justify-center transition-all active:scale-90"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Item Name</label>
                <input
                  type="text" required placeholder="Item Name..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Category</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Price (Rs.)</label>
                  <input
                    type="number" step="0.01" required placeholder="0.00"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 ml-1">Stock</label>
                  <input
                    type="number" required min="0" placeholder="QTY"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-purple-50/50 border border-purple-100 rounded-[1.5rem] px-6 py-4 text-sm font-black text-purple-700 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Description</label>
                <textarea
                  rows="3" placeholder="Description..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 text-sm font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Item Image</label>
                <div className="border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2rem] p-8 text-center transition-colors hover:border-purple-200">
                  {imagePreview ? (
                    <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <button type="button" onClick={() => { setImagePreview(null); setFormData({ ...formData, imageFile: null }); }} className="absolute top-4 right-4 bg-slate-900/90 text-white w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md active:scale-90"><X size={16} /></button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform"><Upload size={28} /></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Upload Image</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-purple-600 transition-all active:scale-95">
                  {submitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuManager;