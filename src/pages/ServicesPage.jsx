import { useState, useEffect } from 'react';
import { Package, Truck, Factory, Shield, Wrench, CheckSquare, Plus, Edit3, Trash2, Loader2, Shirt, Baby, Home, User } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { motion, AnimatePresence } from 'framer-motion';

import ProductModal from '@/components/services/ProductModal';
import ServiceModal from '@/components/services/ServiceModal';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

// We will now fetch these dynamically!
// Import icons to map from string to component dynamically
const IconMap = { User, Baby, Home, Shirt };

export default function ServicesPage() {
  //Title & Description for SEO
  useDocumentMeta("Fleet & Services | Clezo Express Laundry", "Manage dynamic dropdown categories for customer lead forms, ensuring your service offerings are always up-to-date and relevant for your customers.");
  
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null });

  // Extract unique tags from current products list
  const availableTags = [...new Set(products.map(p => p.productTag).filter(Boolean))];

  // Fetch all core services first
  const loadServicesList = async () => {
    setIsLoadingServices(true);
    try {
      const response = await fetchClient('/service-categories');
      const categoriesData = Array.isArray(response) ? response : (response?.data || []);
      setServices(Array.isArray(categoriesData) ? categoriesData : []);
      
      if (Array.isArray(categoriesData) && categoriesData.length > 0 && !activeService) {
        setActiveService(categoriesData[0]);
      }
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    loadServicesList();
  }, []);

  // Fetch specific products for the active service
  const loadProducts = async () => {
    if (!activeService) return;
    setIsLoadingProducts(true);
    try {
      const response = await fetchClient(`/service-options?serviceType=${activeService.slug}`);
      let productsData = [];
      if (Array.isArray(response)) productsData = response;
      else if (response?.data?.options) productsData = response.data.options;
      else if (response?.options) productsData = response.options;
      else if (Array.isArray(response?.data)) productsData = response.data;
      
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [activeService]);

  const handleOpenNew = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenCatNew = () => {
    setSelectedServiceItem(null);
    setIsServiceModalOpen(true);
  };

  const handleEditCat = (cat) => {
    setSelectedServiceItem(cat);
    setIsServiceModalOpen(true);
  };

  const handleToggleStatus = async (productId) => {
    const original = [...products];
    setProducts(products.map(s => s.id === productId ? { ...s, isActive: !s.isActive } : s));
    try {
      await fetchClient(`/service-options/${productId}/toggle`, { method: 'PATCH' });
      toast.success('Status updated');
    } catch (error) {
      setProducts(original);
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = (id, type = 'product') => {
    setDeleteModal({ isOpen: true, id, type });
  };

  const handleDelete = async () => {
    const { id, type } = deleteModal;
    if (!id) return;
    
    try {
      if (type === 'service') {
        await fetchClient(`/service-categories/${id}`, { method: 'DELETE' });
        toast.success('Service deleted permanently');
        if (activeService?.id === id) setActiveService(null);
        loadServicesList();
      } else {
        await fetchClient(`/service-options/${id}`, { method: 'DELETE' });
        toast.success('Product deleted permanently');
        loadProducts(); // Instantly refresh the table
      }
    } catch (error) {
      toast.error(error.message || `Failed to delete ${type}`);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col relative z-10">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative z-10"
      >
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Services & Products</h1>
        <p className="text-slate-400 font-medium mt-1">Manage dynamic dropdown services and their specific products.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 relative z-10">
        
        {/* LEFT PANE: The Fixed Services (Tabs) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-full md:w-80 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col overflow-hidden relative"
        >
          {/* Ambient inner glare */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 blur-[40px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Services (Tabs)</span>
            <button 
              onClick={handleOpenCatNew}
              className="text-primary hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
              title="Add Service"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar">
            {isLoadingServices ? (
               <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : services.length === 0 ? (
               <div className="text-center p-6 text-slate-500 font-medium text-sm">
                 <p>List is empty.</p>
                 <button onClick={handleOpenCatNew} className="text-primary mt-2 hover:underline">Add one now</button>
               </div>
            ) : services.map((cat, index) => {
              const isActive = activeService?.id === cat.id;
              const Icon = IconMap[cat.icon] || Shirt; // Fallback to Shirt icon
              return (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={cat.id}
                  onClick={() => setActiveService(cat)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all relative group overflow-hidden ${
                    isActive
                      ? 'bg-primary/20 text-white border border-primary/40 shadow-[0_0_15px_rgba(0,174,230,0.3)]'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-primary/20 -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                    <span className="text-sm relative z-10">{cat.name}</span>
                  </div>
                  <div className={`flex gap-1 z-10 ml-auto transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditCat(cat); }}
                      className={`text-slate-400 hover:text-primary p-1.5 hover:bg-primary/20 rounded transition-all hover:scale-110 active:scale-95 ${isActive ? 'text-primary/70 bg-black/20 hover:text-white hover:bg-black/40' : ''}`}
                      title="Edit Service"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); confirmDelete(cat.id, 'service'); }}
                      className={`text-slate-400 hover:text-red-400 p-1.5 hover:bg-red-500/20 rounded transition-all hover:scale-110 active:scale-95 ${isActive ? 'text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20' : ''}`}
                      title="Delete Service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT PANE: The Dynamic Categories */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
          className="flex-1 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col overflow-hidden relative"
        >
          {/* Ambient inner glare right */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div>
              <AnimatePresence mode="wait">
                {activeService ? (() => {
                  const Icon = IconMap[activeService.icon] || Shirt;
                  return (
                    <motion.h2 
                      key={activeService.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-xl font-extrabold text-white flex items-center gap-2 drop-shadow-md"
                    >
                      <Icon className="text-primary" size={24} />
                      {activeService.name} Options
                    </motion.h2>
                  );
                })() : (
                  <motion.h2 className="text-xl font-extrabold text-slate-400">
                    No Service Selected
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={handleOpenNew}
              className="flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:scale-105 active:scale-95"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-6 custom-scrollbar relative z-10">
            {isLoadingProducts || isLoadingServices ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : !activeService ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 border-2 border-dashed border-white/20 bg-black/20 rounded-2xl flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Plus className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Services Yet</h3>
                <p className="text-slate-400 font-medium max-w-sm mb-6">You need to create your first Service before you can add any specific products to it.</p>
                <button onClick={handleOpenCatNew} className="bg-primary hover:bg-primary-fixed-variant text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)]">
                  Create First Service
                </button>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 border-2 border-dashed border-white/20 bg-black/20 rounded-2xl"
              >
                <p className="text-slate-400 font-medium">No custom products found for this service.</p>
                <button onClick={handleOpenNew} className="mt-4 text-primary font-bold hover:underline hover:text-white transition-colors">Create the first one</button>
              </motion.div>
            ) : (
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-4 pl-4">Sequence</th>
                    <th className="pb-4">Product Name</th>
                    <th className="pb-4">Tag</th>
                    <th className="pb-4">Pricing</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {products.map((cat, idx) => (
                      <motion.tr 
                        key={cat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/5 group transition-colors"
                      >
                        <td className="py-4 pl-4 text-sm text-slate-500 font-bold">#{cat.order || 0}</td>
                        <td className="py-4 font-bold text-white">
                          {cat.categoryName}
                          {cat.description && <p className="text-xs text-slate-400 font-medium mt-1">{cat.description}</p>}
                        </td>
                        <td className="py-4">
                          {cat.productTag && <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-slate-300 font-medium">{cat.productTag}</span>}
                        </td>
                        <td className="py-4 text-sm font-bold">
                          {cat.isCustomPricing ? (
                            <span className="text-amber-400 text-sm px-3 py-1 bg-amber-400/10 rounded-full border border-amber-400/20">{cat.customPriceLabel || 'Contact Support'}</span>
                          ) : cat.isOfferActive && cat.offerPrice ? (
                            <div className="flex flex-col">
                              <span className="text-emerald-400 text-lg">₹{cat.offerPrice} <span className="text-xs text-slate-400 font-medium">{cat.pricingUnit || 'per piece'}</span></span>
                              <span className="text-slate-500 line-through text-xs">₹{cat.basePrice}</span>
                            </div>
                          ) : (
                            <span className="text-emerald-400 text-lg">₹{cat.basePrice || '--'} <span className="text-xs text-slate-400 font-medium">{cat.pricingUnit || 'per piece'}</span></span>
                          )}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleStatus(cat.id)}
                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                              cat.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            {cat.isActive ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="py-4 pr-4 text-right flex justify-end gap-1">
                          <button onClick={() => handleEdit(cat)} className="text-primary hover:text-white p-2 bg-white/0 hover:bg-primary/20 rounded-lg transition-all" title="Edit Product">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => confirmDelete(cat.id)} className="text-red-400 hover:text-red-300 p-2 bg-white/0 hover:bg-red-500/20 rounded-lg transition-all" title="Delete Product">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

      </div>

      <ProductModal 
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        categoryData={selectedProduct}
        activeServiceId={activeService?.slug}
        nextOrder={products.length > 0 ? Math.max(...products.map(s => s.order || 0)) + 1 : 1}
        existingOrders={products.map(s => s.order)}
        availableTags={availableTags}
        onSuccess={loadProducts}
      />
      <ServiceModal
        isOpen={isServiceModalOpen}
        setIsOpen={setIsServiceModalOpen}
        categoryData={selectedServiceItem}
        nextOrder={services.length > 0 ? Math.max(...services.map(c => c.order || 0)) + 1 : 1}
        existingOrders={services.map(c => c.order)}
        onSuccess={loadServicesList}
      />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        setIsOpen={(isOpen) => setDeleteModal({ ...deleteModal, isOpen })}
        onConfirm={handleDelete}
        title={deleteModal.type === 'service' ? "Delete Service?" : "Delete Product?"}
        message={`Are you absolutely sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
      />
    </div>
  );
}