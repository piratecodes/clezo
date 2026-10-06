import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, MapPin, Phone, Calendar, Truck, Save, Loader2, Clock, Store, MapPinned, FileText, IndianRupee, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { ALL_MODE_STATUSES } from '@/utils/lead.config';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/style/DateRangeSelector.css'; // Reusing custom styles
import EditLeadItems from './EditLeadItems';

export default function LeadSlideOver({ isOpen, setIsOpen, lead, onLeadUpdated, onStatusChange }) {
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [historyToDelete, setHistoryToDelete] = useState(null);
  const [isEditingItems, setIsEditingItems] = useState(false);

  useEffect(() => {
    if (lead) setAdminNotes(lead.adminNotes || '');
    setIsEditingItems(false);
  }, [lead]);

  const handleSaveNotes = async () => {
    if (!lead) return;
    setIsSaving(true);
    try {
      const response = await fetchClient(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ adminNotes }),
      });
      toast.success('Notes saved securely');
      onLeadUpdated(response.data.lead || response.data);
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateUpdate = async (field, date) => {
    if (!lead) return;
    try {
      const response = await fetchClient(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ [field]: date }),
      });
      toast.success('Schedule updated');
      onLeadUpdated(response.data.lead || response.data);
    } catch (error) {
      toast.error('Failed to update schedule');
    }
  };

  const handleHistoryDateUpdate = async (historyId, date) => {
    if (!lead) return;
    try {
      const response = await fetchClient(`/leads/${lead.id}/history/${historyId}`, {
        method: 'PATCH',
        body: JSON.stringify({ createdAt: date }),
      });
      toast.success('Timeline updated');
      onLeadUpdated(response.data.lead || response.data);
    } catch (error) {
      toast.error('Failed to update timeline');
    }
  };

  const handleDeleteHistory = (historyId) => {
    setHistoryToDelete(historyId);
  };

  const confirmDeleteHistory = async () => {
    if (!lead || !historyToDelete) return;
    try {
      const response = await fetchClient(`/leads/${lead.id}/history/${historyToDelete}`, {
        method: 'DELETE',
      });
      toast.success('Timeline entry deleted');
      onLeadUpdated(response.data.lead || response.data);
    } catch (error) {
      toast.error('Failed to delete timeline entry');
    } finally {
      setHistoryToDelete(null);
    }
  };

  if (!lead) return null;

  const isPickup = lead.serviceMode === 'PICKUP_DROP';
  const allowedNextStatuses = (ALL_MODE_STATUSES[lead.serviceMode] || []).filter(s => s !== lead.status);

  const statusColors = {
    'NEW': 'bg-primary/20 text-primary border-primary/30',
    'CONTACTED': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'PENDING_QUOTE': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'QUOTED': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'CONFIRMED': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'RECEIVED_AT_STORE': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'PICKED_UP': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'PROCESSING': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'READY': 'bg-green-500/20 text-green-400 border-green-500/30',
    'OUT_FOR_DELIVERY': 'bg-blue-600/20 text-blue-500 border-blue-600/30',
    'DELIVERED': 'bg-emerald-600/20 text-emerald-500 border-emerald-600/30',
    'COLLECTED': 'bg-emerald-600/20 text-emerald-500 border-emerald-600/30',
    'CANCELLED': 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusLabels = {
    'NEW': 'New',
    'CONTACTED': 'Contacted',
    'PENDING_QUOTE': 'Pending Quote',
    'QUOTED': 'Quote Sent',
    'CONFIRMED': 'Confirmed',
    'RECEIVED_AT_STORE': 'Received (Store)',
    'PICKED_UP': 'Picked Up',
    'PROCESSING': 'Processing',
    'READY': 'Ready',
    'OUT_FOR_DELIVERY': 'Out for Delivery',
    'DELIVERED': 'Delivered',
    'COLLECTED': 'Collected',
    'CANCELLED': 'Cancelled',
  };

  return (
    <Fragment>
      <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={() => {
        if (isEditingItems) {
          setIsEditingItems(false);
        } else {
          setIsOpen(false);
        }
      }}>
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
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-on-primary-fixed/95 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,174,230,0.15)] border-l border-white/10 relative">
                    
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[80px] pointer-events-none -z-10 rounded-full"></div>

                    <div className="bg-white/5 border-b border-white/10 px-6 py-6 text-white sm:px-8 relative z-10">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                          <FileText size={20} className="text-primary"/> Lead #{lead.leadNumber}
                        </DialogTitle>
                        <button
                          type="button"
                          className="rounded-full text-white/50 hover:text-white p-2 transition-colors focus:outline-none"
                          onClick={() => setIsOpen(false)}
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="text-2xl font-bold text-primary">{lead.customerName}</p>
                          <p className="text-slate-300 text-sm mt-1 flex items-center gap-2 font-bold tracking-wide">
                            {isPickup ? <Truck size={14} className="text-primary" /> : <Store size={14} className="text-orange-400" />}
                            {isPickup ? 'HOME PICKUP & DROP' : 'STORE VISIT'}
                          </p>
                        </div>
                        
                        {/* Status Dropdown */}
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton 
                            disabled={allowedNextStatuses.length === 0}
                            className={`inline-flex items-center justify-between w-40 gap-x-1.5 rounded-full px-4 py-2 text-xs uppercase font-black border ${statusColors[lead.status] || 'bg-slate-500/20 text-slate-400'} ${allowedNextStatuses.length === 0 ? 'opacity-80 cursor-not-allowed' : 'hover:brightness-110'}`}
                          >
                            {statusLabels[lead.status] || lead.status}
                            {allowedNextStatuses.length > 0 && <ChevronDown size={14} aria-hidden="true" />}
                          </MenuButton>

                          {allowedNextStatuses.length > 0 && (
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-[#0f172a] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 focus:outline-none overflow-hidden">
                                <div className="py-1">
                                  {allowedNextStatuses.map((statusVal) => (
                                    <MenuItem key={statusVal}>
                                      {({ focus }) => (
                                        <button
                                          onClick={() => onStatusChange(lead, statusVal)}
                                          className={`block w-full text-left px-4 py-2.5 text-sm font-bold ${
                                            focus ? 'bg-white/10 text-primary' : 'text-slate-300'
                                          } ${statusVal === 'CANCELLED' ? 'text-red-400 hover:text-red-300' : ''}`}
                                        >
                                          {statusLabels[statusVal] || statusVal}
                                        </button>
                                      )}
                                    </MenuItem>
                                  ))}
                                </div>
                              </MenuItems>
                            </Transition>
                          )}
                        </Menu>
                      </div>
                    </div>

                    <div className="relative flex-1 px-6 py-6 sm:px-8 space-y-8 custom-scrollbar z-10">
                      
                      {/* Contact Info */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                        <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3 text-sm text-white font-medium">
                            <Phone size={16} className="text-primary" /> {lead.customerPhone}
                          </div>
                          {lead.createdAt && (
                            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium border-t border-white/10 pt-3 mt-1">
                              <Clock size={16} className="text-primary/70" /> 
                              Received: {new Date(lead.createdAt).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer Comment */}
                      {lead.customerComment && (
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Customer Comment</h3>
                          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-sm text-amber-200/90 font-medium italic">
                            "{lead.customerComment}"
                          </div>
                        </div>
                      )}

                      {/* Cancellation Reason */}
                      {lead.status === 'CANCELLED' && lead.cancelReason && (
                        <div>
                          <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Cancellation Reason</h3>
                          <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-sm text-red-200/90 font-medium">
                            {lead.cancelReason}
                          </div>
                        </div>
                      )}

                      {/* Scheduling & Address Info */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Service Details</h3>
                        <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/10">
                          {isPickup && lead.addressLine && (
                            <div className="flex items-start gap-3">
                              <MapPin size={18} className="text-emerald-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-slate-400 font-bold">ADDRESS</p>
                                <p className="text-sm font-medium text-white mt-0.5 leading-snug">{lead.addressLine}</p>
                                <p className="text-sm font-medium text-white">{lead.locality}{lead.locality && ','} {lead.pincode}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className={`flex items-center gap-3 ${isPickup && lead.addressLine ? 'border-t border-white/10 pt-3' : ''}`}>
                            <Calendar size={18} className="text-primary" />
                            <div className="flex-1">
                              <p className="text-xs text-slate-400 font-bold">{isPickup ? 'PICKUP SCHEDULE' : 'EXPECTED VISIT / COLLECTION'}</p>
                              <div className="mt-1 custom-datepicker-container">
                                <DatePicker
                                  selected={isPickup ? (lead.pickupDate ? new Date(lead.pickupDate) : null) : (lead.expectedVisitAt ? new Date(lead.expectedVisitAt) : null)}
                                  onChange={(date) => handleDateUpdate(isPickup ? 'pickupDate' : 'expectedVisitAt', date)}
                                  dateFormat={isPickup ? "dd MMM yyyy" : "dd MMM yyyy h:mm aa"}
                                  showTimeSelect={!isPickup}
                                  timeFormat="HH:mm"
                                  timeIntervals={15}
                                  placeholderText="Click to set schedule date"
                                  className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer hover:text-primary transition-colors border-none p-0"
                                  popperPlacement="bottom-end"
                                  popperClassName="custom-popper custom-datepicker-container z-[9999]"
                                  portalId="root"
                                />
                                {isPickup && (
                                  <Menu as="div" className="relative inline-block text-left ml-2">
                                    <MenuButton className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-1 focus:outline-none">
                                      • {lead.pickupSlot || 'Set Time Slot'}
                                    </MenuButton>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <MenuItems className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-xl bg-[#0f172a] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 focus:outline-none overflow-hidden">
                                        <div className="py-1">
                                          {['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'].map((slot) => (
                                            <MenuItem key={slot}>
                                              {({ focus }) => (
                                                <button
                                                  onClick={() => handleDateUpdate('pickupSlot', slot)}
                                                  className={`block w-full text-left px-4 py-2 text-sm font-bold ${
                                                    focus ? 'bg-white/10 text-primary' : 'text-slate-300'
                                                  }`}
                                                >
                                                  {slot}
                                                </button>
                                              )}
                                            </MenuItem>
                                          ))}
                                        </div>
                                      </MenuItems>
                                    </Transition>
                                  </Menu>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="relative mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requested Services</h3>
                          {!isEditingItems && (
                            <button 
                              onClick={() => setIsEditingItems(true)}
                              className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-bold bg-primary/10 px-2 py-1 rounded-md transition-colors"
                            >
                              <Edit2 size={12} /> Edit Items
                            </button>
                          )}
                        </div>

                        {isEditingItems ? (
                          <EditLeadItems 
                            lead={lead} 
                            onCancel={() => setIsEditingItems(false)}
                            onSaved={(updatedLead) => {
                              setIsEditingItems(false);
                              onLeadUpdated(updatedLead);
                              if (lead.status === 'PENDING_QUOTE') {
                                toast((t) => (
                                  <span className="flex flex-col gap-2">
                                    <span className="font-bold">Items updated!</span>
                                    <span className="text-sm">Would you like to mark this quote as Sent?</span>
                                    <div className="flex gap-2 mt-1">
                                      <button onClick={() => { onStatusChange('QUOTED'); toast.dismiss(t.id); }} className="bg-primary text-white text-xs px-3 py-1 rounded">Yes, Mark Quoted</button>
                                      <button onClick={() => toast.dismiss(t.id)} className="bg-slate-700 text-white text-xs px-3 py-1 rounded">No</button>
                                    </div>
                                  </span>
                                ), { duration: 6000 });
                              }
                            }}
                          />
                        ) : (
                          lead.items && lead.items.length > 0 ? (
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
                              {lead.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                  <div>
                                    <p className="font-bold text-white">{item.itemName}</p>
                                    <p className="text-xs text-slate-400">{item.serviceName}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.quantity} x ₹{Number(item.unitPrice)}</p>
                                    {item.quoteStatus === 'PENDING' && (
                                      <span className="inline-block mt-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full">TBD</span>
                                    )}
                                  </div>
                                  <span className="font-bold text-primary">
                                    {item.quoteStatus === 'PENDING' ? 'TBD' : `₹${(Number(item.unitPrice) * item.quantity).toFixed(2)}`}
                                  </span>
                                </div>
                              ))}
                              
                              {lead.subtotal != null && (
                                <div className="flex justify-between items-center text-xs pt-3 border-t border-primary/20 text-slate-400">
                                  <span className="font-bold">SUBTOTAL</span>
                                  <span className="font-bold">₹{lead.subtotal}</span>
                                </div>
                              )}

                              {lead.discount > 0 && (
                                <div className="flex justify-between items-center text-xs pt-1 text-emerald-400">
                                  <span className="font-bold">DISCOUNT {lead.discountType === 'PERCENTAGE' ? `(${lead.discount}%)` : '(FIXED)'}</span>
                                  <span className="font-bold">- ₹{(Number(lead.subtotal) - Number(lead.total)).toFixed(2)}</span>
                                </div>
                              )}

                              <div className="flex justify-between items-center text-sm pt-2 mt-2 border-t border-white/5">
                                <span className="font-extrabold text-slate-300">ESTIMATED TOTAL</span>
                                <span className="font-black text-emerald-400 text-lg flex items-center">
                                  <IndianRupee size={16} />{lead.total}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-500 italic bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                              No items currently in this lead.
                            </div>
                          )
                        )}
                      </div>

                      {/* Status History */}
                      {lead.history && lead.history.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Timeline</h3>
                          <div className="space-y-4">
                            {lead.history.map((hist, idx) => (
                              <div key={idx} className="flex gap-4 relative group">
                                {idx !== lead.history.length - 1 && (
                                  <div className="absolute top-6 left-2 w-0.5 h-full bg-white/10" />
                                )}
                                <div className="w-4 h-4 mt-1 rounded-full bg-primary/20 border-2 border-primary ring-4 ring-black/40 z-10 shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-white">{hist.toStatus.replace(/_/g, ' ')}</p>
                                    <button 
                                      onClick={() => handleDeleteHistory(hist.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-white/5"
                                      title="Delete timeline entry"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                  <div className="text-xs text-slate-400 mt-0.5 custom-datepicker-container max-w-[200px]">
                                    <DatePicker
                                      selected={new Date(hist.createdAt)}
                                      onChange={(date) => handleHistoryDateUpdate(hist.id, date)}
                                      showTimeSelect
                                      timeFormat="HH:mm"
                                      timeIntervals={15}
                                      dateFormat="MMM d, yyyy, hh:mm aa"
                                      className="bg-transparent border-none p-0 w-full focus:outline-none cursor-pointer hover:text-primary transition-colors text-slate-400 hover:bg-transparent"
                                      popperPlacement="bottom-end"
                                      popperClassName="custom-popper custom-datepicker-container z-[9999]"
                                      portalId="root"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Admin Notes */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Internal Admin Notes</h3>
                        <textarea
                          rows={4}
                          className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white text-sm transition-all resize-none placeholder-slate-500"
                          placeholder="Add private notes for the team here..."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                        />
                        <button
                          onClick={handleSaveNotes}
                          disabled={isSaving || adminNotes === (lead.adminNotes || '')}
                          className="mt-4 w-full bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)]"
                        >
                          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Save Notes
                        </button>
                      </div>

                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>

    {/* Delete Confirmation Modal */}
    <Transition appear show={!!historyToDelete} as={Fragment}>
      <Dialog as="div" className="relative z-[70]" onClose={() => setHistoryToDelete(null)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0f172a] p-6 text-left align-middle shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 transition-all">
                <DialogTitle as="h3" className="text-lg font-black text-white flex items-center gap-2">
                  <Trash2 className="text-red-400" size={20} />
                  Delete Timeline Entry
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-slate-400 font-medium">
                    Are you sure you want to delete this timeline entry? This action cannot be undone. 
                    The lead's main status will automatically revert to match the previous log.
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                    onClick={() => setHistoryToDelete(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/30 transition-colors border-red-500/30"
                    onClick={confirmDeleteHistory}
                  >
                    Delete Entry
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
    </Fragment>
  );
}