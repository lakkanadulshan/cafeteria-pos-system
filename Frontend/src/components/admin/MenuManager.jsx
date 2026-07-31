import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  Loader2, 
  Upload, 
  X, 
  CheckCircle, 
  XCircle,
  Search,
  Package,
  Edit3
} from 'lucide-react';

// Extract dynamic backend origin from Axios base URL
const BACKEND_ORIGIN = api.defaults.baseURL 
  ? new URL(api.defaults.baseURL).origin 
  : 'http://localhost:3000';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
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
  const [error, setError] = useState(null);

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
      setError("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Helper for safe URL formatting
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_ORIGIN}${cleanPath}`;
  };

  // Open Modal for Create or Edit
  const handleOpenModal = (item = null) => {
    setError(null);
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
      alert("Please select a category");
      return;
    }

    setSubmitting(true);
    setError(null);

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
      } else {
        await api.post('/menu', postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.put(`/menu/${item.id}`, { isAvailable: !item.isAvailable });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.delete(`/menu/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', imageFile: null });
    setImagePreview(null);
  };

  // Filter Logic
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategoryFilter === 'ALL' || item.categoryId === parseInt(selectedCategoryFilter, 10);
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-purple-600"
            />
          </div>

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-purple-600"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-purple-600 hover:bg-slate-900 text-white font-black px-5 py-2.5 rounded-2xl shadow-lg shadow-purple-200 transition-all text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Food Items Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
          <p className="text-xs font-bold">Loading Menu Items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs font-semibold border border-slate-200">
          No food items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const itemImageUrl = getFullImageUrl(item.imageUrl);

            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 relative flex items-center justify-center">
                    {itemImageUrl ? (
                      <img 
                        src={itemImageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Utensils size={24} className="text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                      {item.category?.name || 'Category'}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm truncate mt-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.description || 'No description'}</p>
                    
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="font-black text-slate-900 text-xs">Rs. {parseFloat(item.price).toFixed(2)}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${item.stock > 10 ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-700 font-extrabold'}`}>
                        <Package size={12} />
                        <span>{item.stock} in stock</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      item.isAvailable && item.stock > 0
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    {item.isAvailable && item.stock > 0 ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>{item.isAvailable && item.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-slate-400 hover:text-purple-600 rounded-xl transition-colors"
                      title="Edit Item & Update Stock"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-800 text-base">
                {editingItem ? 'Edit Item & Update Stock' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} className="text-slate-400" /></button>
            </div>

            {error && <div className="p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-2xl">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Item Name</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Category</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border rounded-2xl px-3 py-2.5 text-xs font-semibold"
                  >
                    <option value="">Select</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Price (Rs.)</label>
                  <input
                    type="number" step="0.01" required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Stock Count</label>
                  <input
                    type="number" required min="0"
                    placeholder="e.g. 50"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-purple-50/50 border border-purple-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-purple-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border rounded-2xl p-3 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Image Upload</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center">
                  {imagePreview ? (
                    <div className="relative h-28 rounded-xl overflow-hidden">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <button type="button" onClick={() => { setImagePreview(null); setFormData({ ...formData, imageFile: null }); }} className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-lg"><X size={12} /></button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1">
                      <Upload className="text-purple-600" size={24} />
                      <span className="text-xs font-bold text-slate-600">Select Image from PC</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 bg-slate-100 py-3 rounded-2xl text-xs font-bold">Cancel</button>
                <button type="submit" disabled={submitting} className="w-1/2 bg-purple-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-purple-200">
                  {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : (editingItem ? 'Update Item & Stock' : 'Save Food Item')}
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