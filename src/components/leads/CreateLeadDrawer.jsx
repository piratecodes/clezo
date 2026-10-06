import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Tab, TabGroup, TabList, TabPanels, TabPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Save, Loader2, Store, Truck, Info, IndianRupee, MapPin, Upload, FileText, CheckCircle2, Copy, Printer } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import CustomListbox from '../common/CustomListbox';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

export default function CreateLeadDrawer({ isOpen, setIsOpen, onLeadCreated }) {
  const [isSaving, setIsSaving] = useState(false);
  const [successLead, setSuccessLead] = useState(null);

  // Form State
  const [mode, setMode] = useState('STORE_VISIT'); // 'STORE_VISIT' | 'PICKUP_DROP'
  const [source, setSource] = useState('WALK_IN');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Pickup & Drop specific
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [localities, setLocalities] = useState([]);
  const [locality, setLocality] = useState('');
  const [areaName, setAreaName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupSlot, setPickupSlot] = useState('');

  // Store Visit specific
  const [expectedVisitAt, setExpectedVisitAt] = useState('');

  // Items
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('FIXED'); // 'FIXED' | 'PERCENTAGE'

  // Other
  const [customerComment, setCustomerComment] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [initialStatus, setInitialStatus] = useState('RECEIVED_AT_STORE');

  // Metadata for dropdowns
  const [serviceAreas, setServiceAreas] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (isOpen && !successLead) {
      loadMetadata();
      // Set to current IST time
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (330 * 60000));
      setExpectedVisitAt(istDate);
    }
  }, [isOpen, successLead]);

  useEffect(() => {
    if (mode === 'STORE_VISIT') {
      setSource('WALK_IN');
      setInitialStatus('RECEIVED_AT_STORE');
    } else {
      setSource('PHONE_CALL');
      setInitialStatus('CONFIRMED');
    }
  }, [mode]);

  useEffect(() => {
    if (pincode.length === 6 && serviceAreas.length > 0) {
      const area = serviceAreas.find(a => a.pincode === pincode);
      if (!area || !area.isActive) {
        setPincodeError('Not a serviceable pincode');
        setLocalities([]);
        setLocality('');
      } else {
        setPincodeError('');
        setAreaName(area.areaName); // Auto set area name
        const availableLocalities = area.localities?.length > 0 ? area.localities : [area.areaName];
        setLocalities(availableLocalities);
        if (!availableLocalities.includes(locality)) {
          setLocality(availableLocalities[0]);
        }
      }
    } else if (areaName) {
      setPincodeError('');
      const areas = serviceAreas.filter(a => a.isActive && a.areaName === areaName);
      const allLocs = new Set();
      areas.forEach(a => {
        if (a.localities?.length > 0) {
          a.localities.forEach(l => allLocs.add(l));
        } else {
          allLocs.add(a.areaName);
        }
      });
      setLocalities(Array.from(allLocs).sort());
    } else {
      setPincodeError('');
      const allLocs = new Set();
      serviceAreas.forEach(a => {
        if (a.isActive) {
          if (a.localities?.length > 0) {
            a.localities.forEach(l => allLocs.add(l));
          } else {
            allLocs.add(a.areaName);
          }
        }
      });
      setLocalities(Array.from(allLocs).sort());
    }
  }, [pincode, areaName, serviceAreas]);

  const loadMetadata = async () => {
    try {
      const [areasRes, categoriesRes, optionsRes] = await Promise.all([
        fetchClient('/service-areas'),
        fetchClient('/service-categories'),
        fetchClient('/service-options')
      ]);
      setServiceAreas(Array.isArray(areasRes) ? areasRes : (areasRes.data || []));
      
      const categories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.data || []);
      const options = optionsRes.data?.options || [];

      const parsedServices = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        options: options.filter(o => o.serviceType === cat.slug && o.isActive)
      }));
      setServices(parsedServices);
    } catch (err) {
      toast.error('Failed to load form dependencies');
      console.error(err);
    }
  };

  const handleAddItem = () => {
    setItems([...items, {
      serviceId: '',
      itemId: '',
      itemName: '',
      serviceName: '',
      quantity: 1,
      price: 0,
      totalPrice: 0,
      overrideReason: '',
      brand: '',
      notes: '',
      quoteStatus: 'NOT_REQUIRED',
      images: []
    }]);
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    const item = newItems[index];
    item[field] = value;

    if (field === 'serviceId' || field === 'itemId') {
      const cat = services.find(s => s.id === parseInt(item.serviceId));
      const opt = cat?.options.find(o => o.id === parseInt(item.itemId));
      if (opt) {
        item.itemName = opt.categoryName || opt.serviceType;
        item.serviceName = cat.name;
        item.price = (opt.isOfferActive && opt.offerPrice) ? opt.offerPrice : (opt.basePrice || 0);
        item.quoteStatus = opt.isCustomPricing ? 'PENDING' : 'NOT_REQUIRED';
      }
    }

    if (field === 'price' || field === 'quantity' || field === 'serviceId' || field === 'itemId') {
      item.totalPrice = item.price * item.quantity;
    }

    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const validate = () => {
    if (!customerName) return 'Customer Name is required';
    if (!customerPhone || customerPhone.length !== 10) return 'Valid 10-digit phone is required';
    
    if (mode === 'PICKUP_DROP') {
      if (!pincode || pincodeError) return 'Valid serviceable pincode is required';
      if (!areaName) return 'Area Name is required';
      if (!addressLine) return 'Address Line is required';
      if (!pickupDate) return 'Pickup Date is required';
      if (!pickupSlot) return 'Pickup Slot is required';
      
      const today = new Date();
      today.setHours(0,0,0,0);
      const selected = new Date(pickupDate);
      if (selected < today) return 'Pickup date cannot be in the past';
    }

    for (const item of items) {
      if (!item.serviceId || !item.itemId) return 'Service and Item must be selected for all rows';
      if (item.overrideReason === '' && item.itemId) {
        const cat = services.find(s => s.id === parseInt(item.serviceId));
        const opt = cat?.options.find(o => o.id === parseInt(item.itemId));
        const defaultPrice = (opt?.isOfferActive && opt?.offerPrice) ? opt.offerPrice : (opt?.basePrice || 0);
        if (parseFloat(item.price) !== defaultPrice && !item.overrideReason) {
          return 'Reason is required when overriding price';
        }
      }
    }

    return null;
  };

  const handleSubmit = async (forceSave = false) => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        serviceMode: mode,
        source,
        customerName,
        customerPhone,
        customerEmail,
        initialStatus,
        customerComment,
        adminNotes,
        discount: parseFloat(discount) || 0,
        discountType,
        items: items.map(i => ({
          ...i,
          serviceId: parseInt(i.serviceId),
          itemId: parseInt(i.itemId),
          price: parseFloat(i.price),
          quantity: parseInt(i.quantity),
          totalPrice: parseFloat(i.price) * parseInt(i.quantity)
        })),
        forceSave
      };

      if (mode === 'PICKUP_DROP') {
        payload.pincode = pincode;
        payload.locality = locality || areaName;
        payload.addressLine = addressLine;
        payload.landmark = landmark;
        payload.pickupDate = pickupDate ? new Date(pickupDate).toISOString() : null;
        payload.pickupSlot = pickupSlot;
      } else if (expectedVisitAt) {
        payload.expectedVisitAt = new Date(expectedVisitAt).toISOString();
      }

      const response = await fetchClient('/leads/admin', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response.success === false && response.message.includes('DUPLICATE_WARNING')) {
        const confirm = window.confirm(response.message);
        if (confirm) {
          await handleSubmit(true);
        } else {
          setIsSaving(false);
        }
        return;
      }

      if (response.success === false) {
        throw new Error(response.message);
      }

      toast.success('Lead created successfully!');
      setSuccessLead(response.data.lead);
      if (onLeadCreated) onLeadCreated();

    } catch (err) {
      toast.error(err.message || 'Failed to create lead');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSuccessLead(null);
    setMode('STORE_VISIT');
    setSource('WALK_IN');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setPincode('');
    setLocality('');
    setAddressLine('');
    setLandmark('');
    setPickupDate('');
    setPickupSlot('');
    setExpectedVisitAt('');
    setItems([]);
    setDiscount(0);
    setDiscountType('FIXED');
    setCustomerComment('');
    setAdminNotes('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300); // Reset after closing animation
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'rgba(0, 0, 0, 0.2)',
      border: state.isFocused ? '1px solid #00aee6' : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '9999px',
      padding: '4px 8px',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }
    }),
    menu: (base) => ({
      ...base,
      background: '#0f172a',
      borderRadius: '1rem',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 100
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected ? '#00aee6' : state.isFocused ? 'rgba(0, 174, 230, 0.2)' : 'transparent',
      color: state.isSelected ? '#fff' : state.isFocused ? '#fff' : '#cbd5e1',
      cursor: 'pointer',
      padding: '10px 16px',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#fff',
      fontSize: '14px',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#94a3b8',
      fontSize: '14px',
    }),
    input: (base) => ({
      ...base,
      color: '#fff'
    })
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-hidden bg-on-primary-fixed/95 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,174,230,0.15)] border-l border-white/10 relative">
                    
                    <div className="bg-white/5 border-b border-white/10 px-6 py-6 text-white sm:px-8 relative z-10 flex justify-between items-center">
                      <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                        Create New Lead
                      </DialogTitle>
                      <button
                        type="button"
                        className="rounded-full text-white/50 hover:text-white p-2 transition-colors focus:outline-none"
                        onClick={handleClose}
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="relative flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-8 custom-scrollbar z-10">
                      {successLead ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <CheckCircle2 size={64} className="text-emerald-400 mb-6" />
                          <h2 className="text-2xl font-bold text-white mb-2">Lead Created Successfully!</h2>
                          <p className="text-slate-300 mb-8">Lead Number: <span className="font-bold text-primary">{successLead.leadNumber}</span></p>
                          
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`https://clezo.com/track/${successLead.leadNumber}`);
                                toast.success('Tracking link copied');
                              }}
                              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors border border-white/10"
                            >
                              <Copy size={18} /> Copy Tracking Link
                            </button>
                            <button
                              onClick={() => {
                                window.print(); // Simplistic receipt print for demo
                              }}
                              className="bg-primary hover:bg-primary-fixed-variant text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-[0_5px_15px_rgba(0,174,230,0.3)]"
                            >
                              <Printer size={18} /> Print Receipt
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Mode Toggle */}
                          <div className="flex p-1 bg-black/30 rounded-xl border border-white/10">
                            <button
                              onClick={() => setMode('STORE_VISIT')}
                              className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'STORE_VISIT' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                              <Store size={16} /> Store Visit
                            </button>
                            <button
                              onClick={() => setMode('PICKUP_DROP')}
                              className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'PICKUP_DROP' ? 'bg-primary/20 text-primary shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                              <Truck size={16} /> Pickup & Drop
                            </button>
                          </div>

                          {/* Source & Initial Status */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Source</label>
                              <CustomListbox 
                                value={source}
                                onChange={(value) => {
                                  setSource(value);
                                  if (value === 'WALK_IN') setMode('STORE_VISIT');
                                }}
                                options={[
                                  { value: 'WEBSITE', label: 'Website' },
                                  { value: 'WALK_IN', label: 'Walk-in' },
                                  { value: 'PHONE_CALL', label: 'Phone Call' },
                                  { value: 'WHATSAPP', label: 'WhatsApp' },
                                  { value: 'REFERRAL', label: 'Referral' },
                                  { value: 'OTHER', label: 'Other' },
                                ]}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Initial Status</label>
                              <CustomListbox 
                                value={initialStatus}
                                onChange={(value) => setInitialStatus(value)}
                                options={mode === 'STORE_VISIT' ? [
                                  { value: 'RECEIVED_AT_STORE', label: 'Received at Store' }
                                ] : [
                                  { value: 'NEW', label: 'New' },
                                  { value: 'CONTACTED', label: 'Contacted' },
                                  { value: 'CONFIRMED', label: 'Confirmed' }
                                ]}
                              />
                            </div>
                          </div>

                          {/* Customer */}
                          <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Customer Details</h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <input 
                                    type="text" 
                                    placeholder="Customer Name *" 
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <input 
                                    type="number" 
                                    placeholder="Phone Number *" 
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  />
                                </div>
                              </div>
                              <input 
                                type="email" 
                                placeholder="Email Address (Optional)" 
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                          </div>

                          {/* Pickup & Drop Details */}
                          {mode === 'PICKUP_DROP' && (
                            <div>
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Pickup Details</h3>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <input 
                                      type="number" 
                                      placeholder="Pincode *" 
                                      value={pincode}
                                      onChange={(e) => setPincode(e.target.value)}
                                      className={`w-full bg-black/20 border ${pincodeError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    {pincodeError && <p className="text-xs text-red-400 mt-1">{pincodeError}</p>}
                                  </div>
                                  <div>
                                    <CustomListbox 
                                      value={areaName}
                                      onChange={(value) => {
                                        setAreaName(value);
                                        setLocality('');
                                      }}
                                      placeholder="Select Area Name *"
                                      options={Array.from(new Set(serviceAreas.filter(a => a.isActive).map(a => a.areaName))).sort().map(a => ({ value: a, label: a }))}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <CustomListbox 
                                    value={locality}
                                    onChange={(value) => {
                                      setLocality(value);
                                      if (pincode.length !== 6) {
                                        const matchingArea = serviceAreas.find(a => 
                                          a.isActive && (a.localities?.includes(value) || (!a.localities?.length && a.areaName === value))
                                        );
                                        if (matchingArea) {
                                          setPincode(matchingArea.pincode);
                                        }
                                      }
                                    }}
                                    disabled={localities.length === 0}
                                    placeholder="Select Locality *"
                                    options={localities.map(l => ({ value: l, label: l }))}
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="Address Line *" 
                                  value={addressLine}
                                  onChange={(e) => setAddressLine(e.target.value)}
                                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Landmark (Optional)" 
                                  value={landmark}
                                  onChange={(e) => setLandmark(e.target.value)}
                                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                  <DatePicker 
                                    selected={pickupDate}
                                    onChange={(date) => setPickupDate(date)}
                                    className="w-full bg-black/20 border border-white/10 rounded-full px-4 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer min-h-[42px]"
                                    placeholderText="Pickup Date *"
                                    minDate={new Date()}
                                  />
                                  <CustomListbox 
                                    value={pickupSlot}
                                    onChange={(value) => setPickupSlot(value)}
                                    placeholder="Select Slot *"
                                    options={[
                                      { value: '9:00 AM - 12:00 PM', label: '9:00 AM - 12:00 PM' },
                                      { value: '12:00 PM - 3:00 PM', label: '12:00 PM - 3:00 PM' },
                                      { value: '3:00 PM - 6:00 PM', label: '3:00 PM - 6:00 PM' }
                                    ]}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Store Visit Details */}
                          {mode === 'STORE_VISIT' && (
                            <div>
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Store Visit</h3>
                              <DatePicker 
                                selected={expectedVisitAt}
                                onChange={(date) => setExpectedVisitAt(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className="w-full bg-black/20 border border-white/10 rounded-full px-4 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer min-h-[42px]"
                                placeholderText="Expected Visit At *"
                              />
                            </div>
                          )}

                          {/* Items */}
                          <div>
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items</h3>
                              <button onClick={handleAddItem} className="text-primary text-xs font-bold hover:text-white transition-colors">+ Add Item</button>
                            </div>
                            
                            <div className="space-y-4">
                              {items.map((item, idx) => (
                                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 relative">
                                  <button onClick={() => handleRemoveItem(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-400">
                                    <X size={14}/>
                                  </button>
                                  
                                  <div className="grid grid-cols-12 gap-3 mb-3">
                                    <div className="col-span-5">
                                      <CustomListbox 
                                        value={item.serviceId}
                                        onChange={val => handleUpdateItem(idx, 'serviceId', val)}
                                        placeholder="Select Service"
                                        options={services.map(s => ({ value: s.id, label: s.name }))}
                                      />
                                    </div>
                                    <div className="col-span-4">
                                      <CustomListbox 
                                        disabled={!item.serviceId}
                                        value={item.itemId}
                                        onChange={val => handleUpdateItem(idx, 'itemId', val)}
                                        placeholder="Select Option"
                                        options={(services.find(s => s.id === parseInt(item.serviceId))?.options || []).map(o => ({ value: o.id, label: o.categoryName || o.serviceType }))}
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <input type="number" min="1" value={item.quantity} onChange={e => handleUpdateItem(idx, 'quantity', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none text-center" />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-4 flex flex-col">
                                      <span className="text-[10px] text-slate-400 uppercase">Unit Price</span>
                                      <input type="number" value={item.price} onChange={e => handleUpdateItem(idx, 'price', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none" />
                                    </div>
                                    <div className="col-span-8 flex flex-col">
                                      <span className="text-[10px] text-slate-400 uppercase">Override Reason</span>
                                      <input type="text" placeholder="Required if changed" value={item.overrideReason} onChange={e => handleUpdateItem(idx, 'overrideReason', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none" />
                                    </div>
                                  </div>
                                  
                                  {item.quoteStatus === 'PENDING' && (
                                    <div className="mt-2 inline-block bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                                      Quote Needed
                                    </div>
                                  )}
                                </div>
                              ))}
                              {items.length === 0 && (
                                <div className="text-center py-6 text-slate-500 text-sm border border-dashed border-white/10 rounded-xl">
                                  No items added yet
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4 space-y-2 text-sm border-t border-white/10 pt-4">
                              <div className="flex justify-between text-slate-300">
                                <span>Subtotal</span>
                                <span>₹{calculateSubtotal()}</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-300">
                                <span>Discount</span>
                                <div className="flex items-center gap-2">
                                  <CustomListbox 
                                    value={discountType}
                                    onChange={(value) => setDiscountType(value)}
                                    className="w-32"
                                    buttonClassName="!py-1"
                                    options={[
                                      { value: 'FIXED', label: '₹ Fixed' },
                                      { value: 'PERCENTAGE', label: '% Percent' }
                                    ]}
                                  />
                                  <input 
                                    type="number" 
                                    min="0"
                                    max={discountType === 'PERCENTAGE' ? "100" : undefined}
                                    value={discount} 
                                    onChange={e => setDiscount(e.target.value)} 
                                    className="w-20 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none text-right" 
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between text-white font-bold pt-2 border-t border-white/5">
                                <span>Total</span>
                                <span className="text-primary text-lg">
                                  ₹{Math.max(0, calculateSubtotal() - (discountType === 'PERCENTAGE' ? (calculateSubtotal() * (parseFloat(discount) || 0) / 100) : (parseFloat(discount) || 0)))}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Notes</h3>
                            <div className="space-y-4">
                              <textarea 
                                placeholder="Customer Comment" 
                                rows={2}
                                value={customerComment}
                                onChange={(e) => setCustomerComment(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                              />
                              <textarea 
                                placeholder="Admin Notes (Internal)" 
                                rows={2}
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {!successLead && (
                      <div className="border-t border-white/10 bg-white/5 px-6 py-4 sm:px-8 z-10 flex gap-4">
                        <button
                          type="button"
                          className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                          onClick={handleClose}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-fixed-variant disabled:opacity-50 transition-colors shadow-[0_5px_15px_rgba(0,174,230,0.3)] flex items-center justify-center gap-2"
                          onClick={() => handleSubmit()}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Create Lead
                        </button>
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
