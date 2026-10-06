import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, X } from 'lucide-react';
import CustomListbox from '@/components/common/CustomListbox';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function EditLeadItems({ lead, onCancel, onSaved }) {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clone existing items
    if (lead?.items) {
      setItems(lead.items.map(i => ({
        ...i,
        originalPrice: Number(i.unitPrice),
        price: Number(i.unitPrice),
        overrideReason: '',
        totalPrice: Number(i.unitPrice) * i.quantity
      })));
    }
    loadServices();
  }, [lead]);

  const loadServices = async () => {
    try {
      const [catRes, optRes] = await Promise.all([
        fetchClient('/service-categories'),
        fetchClient('/service-options')
      ]);
      const categories = Array.isArray(catRes) ? catRes : (catRes.data || []);
      const options = optRes.data?.options || optRes.data || [];

      const parsedServices = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        options: options.filter(o => o.serviceType === cat.slug && o.isActive).map(o => ({
          ...o,
          categoryName: o.categoryName || o.serviceType // fallback
        }))
      }));
      setServices(parsedServices);
    } catch (error) {
      toast.error('Failed to load services metadata');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { serviceId: '', itemId: '', price: 0, originalPrice: 0, quantity: 1, totalPrice: 0, overrideReason: '', notes: '', itemName: '', serviceName: '' }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === 'serviceId') {
      item.serviceId = value;
      item.itemId = '';
      item.price = 0;
      item.originalPrice = 0;
      item.totalPrice = 0;
      item.itemName = '';
      item.serviceName = services.find(s => s.id === parseInt(value))?.name || '';
    } else if (field === 'itemId') {
      item.itemId = value;
      const cat = services.find(s => s.id === parseInt(item.serviceId));
      const opt = cat?.options.find(o => o.id === parseInt(value));
      if (opt) {
        item.itemName = opt.categoryName || opt.serviceType;
        item.price = (opt.isOfferActive && opt.offerPrice) ? opt.offerPrice : (opt.basePrice || 0);
        item.originalPrice = item.price;
        item.totalPrice = item.price * item.quantity;
      }
    } else if (field === 'price') {
      item.price = value === '' ? '' : parseFloat(value);
      item.totalPrice = (item.price || 0) * item.quantity;
    } else if (field === 'quantity') {
      item.quantity = parseInt(value) || 1;
      item.totalPrice = item.price * item.quantity;
    } else {
      item[field] = value;
    }
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const validate = () => {
    for (const item of items) {
      if (!item.serviceId || !item.itemId) return 'Service and Item must be selected for all rows';
      if (item.overrideReason === '' && item.itemId) {
        const cat = services.find(s => s.id === parseInt(item.serviceId));
        const opt = cat?.options.find(o => o.id === parseInt(item.itemId));
        const defaultPrice = (opt?.isOfferActive && opt?.offerPrice) ? opt.offerPrice : (opt?.basePrice || 0);
        
        const isModifiedFromDefault = parseFloat(item.price) !== defaultPrice;
        const isModifiedFromOriginal = parseFloat(item.price) !== item.originalPrice;
        
        // Only require reason if the price is BOTH different from default AND different from what they started with
        if (isModifiedFromDefault && isModifiedFromOriginal && !item.overrideReason) {
          return 'Reason is required when overriding price';
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) return toast.error(err);

    const cleanItems = items.map(item => ({
      itemName: item.itemName,
      serviceName: item.serviceName,
      serviceId: parseInt(item.serviceId),
      itemId: parseInt(item.itemId),
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      totalPrice: item.totalPrice,
      overrideReason: item.overrideReason || undefined,
      notes: item.notes || undefined,
      quoteStatus: item.quoteStatus || undefined,
    }));

    setIsSaving(true);
    try {
      const response = await fetchClient(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ items: cleanItems }),
      });
      toast.success('Items updated successfully');
      onSaved(response.data?.lead || response.data);
    } catch (error) {
      toast.error('Failed to update items');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  return (
    <div className="bg-black/40 p-4 rounded-xl border border-primary/30 mt-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Edit Items</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-white p-1 bg-white/5 rounded-md"><X size={16} /></button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const cat = services.find(s => s.id === parseInt(item.serviceId));
          const options = cat?.options || [];
          const opt = options.find(o => o.id === parseInt(item.itemId));
          const defaultPrice = (opt?.isOfferActive && opt?.offerPrice) ? opt.offerPrice : (opt?.basePrice || 0);
          
          const isModifiedFromDefault = parseFloat(item.price) !== defaultPrice;
          const isModifiedFromOriginal = parseFloat(item.price) !== item.originalPrice;
          const isPriceOverridden = item.itemId && isModifiedFromDefault && isModifiedFromOriginal;

          return (
            <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3 relative group">
              <button 
                onClick={() => removeItem(index)}
                className="absolute -top-2 -right-2 bg-red-500/20 text-red-400 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
              >
                <Trash2 size={14} />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <CustomListbox
                  value={item.serviceId}
                  onChange={(val) => updateItem(index, 'serviceId', val)}
                  options={services.map(s => ({ value: s.id, label: s.name }))}
                  placeholder="Select Service"
                />
                <CustomListbox
                  value={item.itemId}
                  onChange={(val) => updateItem(index, 'itemId', val)}
                  options={options.map(o => ({ value: o.id, label: o.categoryName || o.serviceType }))}
                  placeholder="Select Item"
                  disabled={!item.serviceId}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Price (₹)</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    className="w-full bg-black/40 text-white text-sm border border-white/10 rounded-lg px-3 py-2 mt-1 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full bg-black/40 text-white text-sm border border-white/10 rounded-lg px-3 py-2 mt-1 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Total</label>
                  <div className="w-full bg-white/5 text-primary font-bold text-sm border border-white/10 rounded-lg px-3 py-2 mt-1">
                    ₹{item.totalPrice}
                  </div>
                </div>
              </div>

              {isPriceOverridden && (
                <div>
                  <label className="text-[10px] text-yellow-500 font-bold uppercase ml-1">Reason for Price Change *</label>
                  <input
                    type="text"
                    value={item.overrideReason || ''}
                    onChange={(e) => updateItem(index, 'overrideReason', e.target.value)}
                    className="w-full bg-yellow-500/10 text-yellow-200 text-sm border border-yellow-500/30 rounded-lg px-3 py-2 mt-1 focus:border-yellow-500 focus:outline-none placeholder-yellow-500/30"
                    placeholder="E.g., Special fabric, Extra stain"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleAddItem}
        className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add Another Item
      </button>

      <div className="flex justify-between items-center bg-black/60 p-4 rounded-xl border border-white/10">
        <span className="text-sm font-bold text-slate-400">NEW SUBTOTAL</span>
        <span className="text-lg font-black text-white">₹{subtotal.toFixed(2)}</span>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {isSaving ? 'Saving Items...' : 'Save Changes'}
      </button>
    </div>
  );
}
