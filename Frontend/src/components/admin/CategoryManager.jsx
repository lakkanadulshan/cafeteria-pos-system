import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast'; 
import Swal from 'sweetalert2'; 
import { Tag, Plus, Trash2, Loader2, AlertCircle, Layers, Search } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error("Failed to load category directory");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAdding(true);
    const loadingToast = toast.loading("Adding new category...");

    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      toast.success("Category added successfully!", { id: loadingToast });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category", { id: loadingToast });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const targetId = parseInt(id, 10);
    
    if (isNaN(targetId)) {
      toast.error("Invalid Category ID");
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Category?',
      text: "All items linked to this category might be affected.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Delete',
     
      customClass: {
        popup: 'rounded-[24px]' 
      }
    });

    if (result.isConfirmed) {
      const loadingToast = toast.loading("Purging category...");
      try {
        await api.delete(`/categories/${targetId}`);
        toast.success("Category removed", { id: loadingToast });
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed", { id: loadingToast });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- 🟢 ADD CATEGORY MODULE --- */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
            <Tag size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Create Category</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define new food or beverage sectors</p>
          </div>
        </div>

        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="text"
              required
              placeholder="e.g. Specialty Coffee, Organic Pastries..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-600 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="bg-slate-900 hover:bg-purple-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-purple-200 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            <span>Deploy Category</span>
          </button>
        </form>
      </div>

      {/* --- 🟢 CATEGORIES GRID --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-slate-50 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Category Matrix</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Currently Active Segments</p>
            </div>
          </div>
          <span className="bg-purple-50 text-purple-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-purple-100">
            {categories.length} Nodes
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Synchronizing...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center text-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Tag size={28} className="opacity-20" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest">No segments initialized</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group p-6 bg-slate-50/50 border border-slate-100 rounded-[1.8rem] flex items-center justify-between gap-4 hover:bg-white hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
              >
                <div className="flex flex-col">
                  <h4 className="font-black text-slate-900 text-sm tracking-tight group-hover:text-purple-600 transition-colors uppercase italic">{cat.name}</h4>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {cat._count?.menuItems || 0} Linked Items
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="w-10 h-10 rounded-xl bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 transition-all flex items-center justify-center active:scale-90"
                  title="Purge Category"
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