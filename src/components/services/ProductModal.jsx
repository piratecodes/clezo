import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Save, Loader2, Tag } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Listbox, ListboxButton, ListboxOptions, ListboxOption, Switch } from '@headlessui/react';
import { ChevronDown, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductModal({ isOpen, setIsOpen, categoryData, activeServiceId, nextOrder, existingOrders = [], availableTags = [], onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [tagQuery, setTagQuery] = useState('');
  
  const [formData, setFormData] = useState({
    categoryName: '',
    serviceType: '', // Parent Service Slug
    productTag: '',  // Tag like Men, Women
    basePrice: '',
    pricingUnit: 'per piece',
    offerPrice: '',
    isOfferActive: false,
    description: '',
    order: nextOrder || 1,
    isCustomPricing: false,
    customPriceLabel: 'Contact Support'
  });
  
  const [orderAction, setOrderAction] = useState('push'); // 'push' or 'swap'

  useEffect(() => {
    // If we don't have an activeServiceId, we need to fetch the dynamic list of services for the dropdown
    if (!activeServiceId && isOpen) {
      fetchClient('/service-categories').then(res => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        setServicesList(Array.isArray(list) ? list : []);
        if (list.length > 0 && !formData.serviceType && !categoryData) {
          setFormData(prev => ({ ...prev, serviceType: list[0].slug }));
        }
      }).catch(console.error);
    }
  }, [isOpen, activeServiceId]);

  useEffect(() => {
    if (categoryData) {
      setFormData({
        categoryName: categoryData.categoryName || '',
        serviceType: categoryData.serviceType || '',
        productTag: categoryData.productTag || '',
        basePrice: categoryData.basePrice || '',
        pricingUnit: categoryData.pricingUnit || 'per piece',
        offerPrice: categoryData.offerPrice || '',
        isOfferActive: categoryData.isOfferActive || false,
        description: categoryData.description || '',
        order: categoryData.order || (nextOrder || 1),
        isCustomPricing: categoryData.isCustomPricing || false,
        customPriceLabel: categoryData.customPriceLabel || 'Contact Support'
      });
    } else {
      setFormData({ categoryName: '', serviceType: servicesList.length > 0 ? servicesList[0].slug : '', productTag: '', basePrice: '', pricingUnit: 'per piece', offerPrice: '', isOfferActive: false, description: '', order: nextOrder || 1, isCustomPricing: false, customPriceLabel: 'Contact Support' });
    }
  }, [categoryData, isOpen, servicesList, nextOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      categoryName: formData.categoryName,
      // Use the prop if it exists (from Services page), otherwise use the dropdown value (from Dashboard)
      serviceType: activeServiceId || formData.serviceType, 
      productTag: formData.productTag,
      basePrice: formData.isCustomPricing ? null : Number(formData.basePrice),
      pricingUnit: formData.pricingUnit,
      offerPrice: (formData.isCustomPricing || !formData.offerPrice) ? null : Number(formData.offerPrice),
      isOfferActive: formData.isCustomPricing ? false : formData.isOfferActive,
      description: formData.description,
      order: Number(formData.order),
      orderAction: orderAction,
      isCustomPricing: formData.isCustomPricing,
      customPriceLabel: formData.isCustomPricing ? formData.customPriceLabel : null
    };

    try {
      if (categoryData) {
        await fetchClient(`/service-options/${categoryData.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        toast.success('Product updated successfully');
      } else {
        await fetchClient('/service-options', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('New product added');
      }
      if (onSuccess) onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTags =
    tagQuery === ''
      ? availableTags
      : availableTags.filter((tag) => {
          return tag.toLowerCase().includes(tagQuery.toLowerCase());
        });

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={() => setIsOpen(false)}>
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-on-primary-fixed/95 backdrop-blur-2xl border border-white/10 text-left align-middle shadow-[0_20px_60px_rgba(0,174,230,0.15)] transition-all relative">
                
                {/* Modal Sky Glare */}
                <div className="absolute top-0 right-0 w-[250px] h-[150px] bg-primary/20 blur-[50px] pointer-events-none -z-10 rounded-full"></div>

                <div className="bg-white/5 border-b border-white/10 px-6 py-4 text-white flex items-center justify-between">
                  <DialogTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                    <Tag size={18} className="text-primary" />
                    {categoryData ? 'Edit Product' : 'Quick Add Product'}
                  </DialogTitle>
                  <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  
                  {!activeServiceId && (
                    <div className="relative z-[70]">
                      <label className="block text-sm font-bold text-slate-300 mb-1">Select Parent Service <span className="text-primary">*</span></label>
                      <Listbox value={formData.serviceType} onChange={(val) => setFormData({...formData, serviceType: val})}>
                        <div className="relative mt-1">
                          <ListboxButton className="relative w-full cursor-default rounded-xl bg-black/20 border border-white/10 py-3 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-white font-bold">
                            <span className="block truncate">
                              {servicesList.find(s => s.slug === formData.serviceType)?.name || 'Select a Service'}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </span>
                          </ListboxButton>
                          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <ListboxOptions className="absolute z-[99] mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-xl bg-slate-800 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] focus:outline-none sm:text-sm">
                              {servicesList.length === 0 ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-slate-400">No Services found. Add one first.</div>
                              ) : (
                                servicesList.map((service) => (
                                  <ListboxOption
                                    key={service.id}
                                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary text-white' : 'text-slate-200'}`}
                                    value={service.slug}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{service.name}</span>
                                        {selected ? (
                                          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-primary'}`}>
                                            <Check className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </ListboxOption>
                                ))
                              )}
                            </ListboxOptions>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-bold text-slate-300 mb-1">Product Name (e.g., Wash & Fold) <span className="text-primary">*</span></label>
                      <input type="text" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.categoryName} onChange={(e) => setFormData({...formData, categoryName: e.target.value})} />
                    </div>

                    <div className="col-span-2 sm:col-span-1 relative z-50">
                      <label className="block text-sm font-bold text-slate-300 mb-1">Product Tag (e.g., Men, Women)</label>
                      <Combobox value={formData.productTag} onChange={(val) => setFormData({...formData, productTag: val})}>
                        <div className="relative">
                          <ComboboxInput
                            className="w-full p-3 pr-10 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500"
                            displayValue={(tag) => tag}
                            onChange={(event) => setTagQuery(event.target.value)}
                            placeholder="Type to search or add new..."
                          />
                          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </ComboboxButton>
                        </div>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setTagQuery('')}>
                          <ComboboxOptions className="absolute z-[99] mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-xl bg-slate-800 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] focus:outline-none sm:text-sm">
                            {filteredTags.length === 0 && tagQuery !== '' ? (
                              <ComboboxOption value={tagQuery} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-primary text-white' : 'text-slate-200'}`}>
                                Create "{tagQuery}"
                              </ComboboxOption>
                            ) : (
                              <>
                                {filteredTags.map((tag) => (
                                  <ComboboxOption
                                    key={tag}
                                    value={tag}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-primary text-white' : 'text-slate-200'
                                      }`
                                    }
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                          {tag}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active ? 'text-white' : 'text-primary'
                                            }`}
                                          >
                                            <Check className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </ComboboxOption>
                                ))}
                                {tagQuery !== '' && !filteredTags.some(t => t.toLowerCase() === tagQuery.toLowerCase()) && (
                                  <ComboboxOption value={tagQuery} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 border-t border-white/5 mt-1 pt-2 ${active ? 'bg-primary text-white' : 'text-slate-200'}`}>
                                    Create new "{tagQuery}"
                                  </ComboboxOption>
                                )}
                              </>
                            )}
                          </ComboboxOptions>
                        </Transition>
                      </Combobox>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-300">Require Inspection / Custom Pricing</label>
                        <Switch
                          checked={formData.isCustomPricing}
                          onChange={(val) => setFormData({ ...formData, isCustomPricing: val })}
                          className={`${
                            formData.isCustomPricing ? 'bg-amber-500' : 'bg-slate-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
                        >
                          <span
                            className={`${
                              formData.isCustomPricing ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 pr-12">Check this if the item requires assessment before quoting a price.</p>
                    </div>

                    <AnimatePresence>
                      {formData.isCustomPricing ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <label className="block text-sm font-bold text-slate-300 mb-1">Pricing Label (Displayed to Customer) <span className="text-primary">*</span></label>
                          <input type="text" required className="w-full p-3 bg-black/40 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.customPriceLabel} onChange={(e) => setFormData({...formData, customPriceLabel: e.target.value})} placeholder="e.g. Price upon Inspection" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10 space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-slate-300 mb-1">Base Price (₹) <span className="text-primary">*</span></label>
                              <input type="number" required={!formData.isCustomPricing} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-300 mb-1">Unit (e.g., / kg)</label>
                              <input type="text" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.pricingUnit} onChange={(e) => setFormData({...formData, pricingUnit: e.target.value})} placeholder="per piece" />
                            </div>
                          </div>

                          <div className="bg-black/20 rounded-xl p-4">
                             <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-300">Enable Promotional Offer</label>
                                <Switch
                                  checked={formData.isOfferActive}
                                  onChange={(val) => setFormData({...formData, isOfferActive: val})}
                                  className={`${formData.isOfferActive ? 'bg-primary' : 'bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                                >
                                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isOfferActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </Switch>
                             </div>
                             {formData.isOfferActive && (
                                <div className="mt-4">
                                   <label className="block text-sm font-bold text-slate-300 mb-1">Offer Price (₹) <span className="text-primary">*</span></label>
                                   <input type="number" required className="w-full p-3 bg-black/40 border border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.offerPrice} onChange={(e) => setFormData({...formData, offerPrice: e.target.value})} />
                                </div>
                             )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">List Sequence (1 = Top)</label>
                    <input type="number" min="1" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} placeholder={`e.g. ${nextOrder || 1}`} />
                  
                    {/* SEQUENCE CONFLICT WARNING & ACTION TOGGLE */}
                    {formData.order && 
                     existingOrders.includes(Number(formData.order)) && 
                     (!categoryData || Number(formData.order) !== categoryData.order) && (
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
                                {categoryData ? 'Swap with Existing' : 'Swap (Move Existing to End)'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Short Description</label>
                    <textarea rows="2" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 text-white font-bold py-3 rounded-xl transition-all shadow-[0_5px_20px_rgba(0,174,230,0.3)]">
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {categoryData ? 'Update Product' : 'Save Product'}
                    </button>
                  </div>
                </form>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}