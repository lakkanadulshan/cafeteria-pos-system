import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Tag, Plus, Trash2, Loader2, AlertCircle, Layers } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAdding(true);
    setError(null);

    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Add Category Form Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
          <Tag size={18} className="text-purple-600" />
          <span>Add New Food Category</span>
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            type="text"
            required
            placeholder="Category Name (e.g. Hot Drinks, Cold Beverages, Pastries)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-purple-600 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-purple-200 transition-all text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Categories Grid List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
          <Layers size={18} className="text-purple-600" />
          <span>Existing Categories ({categories.length})</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
            <p className="text-xs font-bold">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-semibold">
            No categories created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 hover:border-purple-300 transition-all"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{cat.name}</h4>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {cat._count?.menuItems || 0} Items Listed
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CategoryManager;