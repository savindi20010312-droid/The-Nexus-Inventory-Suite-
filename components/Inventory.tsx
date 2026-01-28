
import React, { useState } from 'react';
import { Product, Category, PriorityLevel, ProductStatus } from '../types';
import { inventoryService } from '../services/inventoryService';
import { Plus, Edit2, Trash2, ArrowUpDown, ChevronRight, PackageCheck, AlertCircle } from 'lucide-react';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(inventoryService.getProducts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: Category.ELECTRONICS,
    price: 0,
    quantity: 0
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: Category.ELECTRONICS, price: 0, quantity: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      inventoryService.updateProduct(editingProduct.id, formData);
    } else {
      inventoryService.addProduct(formData);
    }
    setProducts(inventoryService.getProducts());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently remove this product from Nexus Tech inventory?')) {
      inventoryService.deleteProduct(id);
      setProducts(inventoryService.getProducts());
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.CRITICAL: 
        return 'bg-rose-50 text-rose-600 border-rose-200 ring-rose-500/20';
      case PriorityLevel.HIGH: 
        return 'bg-orange-50 text-orange-600 border-orange-200 ring-orange-500/20';
      case PriorityLevel.MEDIUM: 
        return 'bg-blue-50 text-blue-600 border-blue-200 ring-blue-500/20';
      case PriorityLevel.LOW: 
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 ring-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 font-medium">Global stock registry and procurement tracking.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/20 active:scale-95"
        >
          <Plus size={20} />
          <span>New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Product Information</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Health Status</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Restock Priority</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-base">{product.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">SKU: {product.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-slate-900">{product.quantity}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-tighter">${product.price.toLocaleString()} ea</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center space-x-1 text-[10px] font-black uppercase ${
                        product.status === ProductStatus.OUT_OF_STOCK ? 'text-rose-600' : 
                        product.status === ProductStatus.LOW_STOCK ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {product.status === ProductStatus.IN_STOCK ? <PackageCheck size={12} /> : <AlertCircle size={12} />}
                        <span>{product.status}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-2 ring-inset ${getPriorityBadge(product.priority)}`}>
                        {product.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 pb-0 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingProduct ? 'Update Product' : 'Register Product'}</h3>
                <p className="text-sm text-slate-400 font-medium">Fill in the details for Nexus stock management.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors font-black text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Product Designation</label>
                  <input 
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 transition-all"
                    placeholder="Enter full product name..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Sector</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 appearance-none"
                    >
                      {Object.values(Category).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Unit Price ($)</label>
                    <input 
                      type="number" required min="0" value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Current Quantity</label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" required min="0" value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    />
                    <div className="text-[10px] font-black uppercase text-slate-400 w-24 leading-tight">
                      System will auto-calculate priority
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all active:scale-95"
                >
                  {editingProduct ? 'Commit Changes' : 'Confirm Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
