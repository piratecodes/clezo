import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ServiceModal({ isOpen, setIsOpen, categoryData, nextOrder, existingOrders = [], onSuccess }) {
  const isEditing = !!categoryData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'Shirt',
    description: '',
    order: nextOrder || 1,
    isActive: true
  });
  
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [orderAction, setOrderAction] = useState('push'); // 'push' or 'swap'

  // Helper to safely slugify
  const generateSlug = (text) => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setFormData({
          name: categoryData.name || '',
          slug: categoryData.slug || '',
          icon: categoryData.icon || 'Shirt',
          description: categoryData.description || '',
          order: categoryData.order || (nextOrder || 1),
          isActive: categoryData.isActive ?? true
        });
        setIsAutoSync(false); // Default to manual sync when editing
      } else {
        setFormData({
          name: '',
          slug: '',
          icon: 'Shirt',
          description: '',
          order: nextOrder || 1,
          isActive: true
        });
        setIsAutoSync(true); // Default to auto sync for new
      }
    }
  }, [isOpen, categoryData, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        order: formData.order ? parseInt(formData.order) : 0,
        orderAction: orderAction
      };

      if (isEditing) {
        await fetchClient(`/service-categories/${categoryData.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        toast.success('Service updated successfully');
      } else {
        await fetchClient('/service-categories', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success('Service created successfully');
      }
      
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#112440] border border-white/10 rounded-2xl w-full max-w-lg relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-extrabold text-white">
                {isEditing ? 'Edit Service' : 'Add Service'}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-300 mb-1">Service Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                      value={formData.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        if (isAutoSync) {
                          setFormData({...formData, name: newName, slug: generateSlug(newName)});
                        } else {
                          setFormData({...formData, name: newName});
                        }
                      }}
                      placeholder="e.g. Dry Cleaning"
                    />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-sm font-bold text-slate-300">URL Slug</label>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!isAutoSync) {
                            setIsAutoSync(true);
                            setFormData(prev => ({...prev, slug: generateSlug(prev.name)}));
                          }
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${isAutoSync ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600 hover:text-white cursor-pointer'}`}
                        title={isAutoSync ? 'Syncing with Service Name' : 'Click to reset Auto-Sync'}
                      >
                        {isAutoSync ? 'Auto Sync' : 'Manual Sync (Reset)'}
                      </button>
                    </div>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500 font-mono text-sm transition-all"
                      value={formData.slug}
                      onChange={(e) => {
                        setIsAutoSync(false);
                        setFormData({...formData, slug: generateSlug(e.target.value)});
                      }}
                      placeholder="e.g. dry-cleaning"
                    />
                  </div>
                </div>
                  
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-300 mb-1">Icon Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      placeholder="e.g. Shirt, Baby, Home"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-300 mb-1">Short Description</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Optional description"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">List Sequence (1 = Top)</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: e.target.value})}
                      placeholder={`e.g. ${nextOrder || 1}`}
                    />
                    
                    {/* SEQUENCE CONFLICT WARNING & ACTION TOGGLE */}
                    {formData.order && 
                     existingOrders.includes(Number(formData.order)) && 
                     (!isEditing || Number(formData.order) !== categoryData?.order) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                        <div className="flex items-start gap-2 text-amber-400">
                          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                          <div className="text-xs font-medium">
                            <p className="mb-2 font-bold">Sequence {formData.order} is already in use.</p>
                            
                            <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-lg border border-white/5">
                              <button 
                                type="button"
                                onClick={() => setOrderAction('push')}
                                className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold transition-all ${orderAction === 'push' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
                              >
                                Auto-Push Others Down
                              </button>
                              <button 
                                type="button"
                                onClick={() => setOrderAction('swap')}
                                className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold transition-all ${orderAction === 'swap' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
                              >
                                {isEditing ? 'Swap with Existing' : 'Swap (Move Existing to End)'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <div className={`block w-12 h-7 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.isActive ? 'translate-x-5' : ''}`}></div>
                      </div>
                      <span className="text-sm font-bold text-slate-300">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-fixed-variant transition-colors shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
