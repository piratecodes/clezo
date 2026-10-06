import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown, MapPinned, Eye, Trash2, Search } from 'lucide-react';
import { ALL_MODE_STATUSES } from '@/utils/lead.config';

export default function LeadsTable({ leads, onOpenSlideOver, onStatusChange, onDeleteLead }) {
  
  const statusColors = {
    'NEW': 'bg-primary/20 text-primary ring-primary/30',
    'CONTACTED': 'bg-blue-500/20 text-blue-400 ring-blue-500/30',
    'PENDING_QUOTE': 'bg-yellow-500/20 text-yellow-400 ring-yellow-500/30',
    'QUOTED': 'bg-orange-500/20 text-orange-400 ring-orange-500/30',
    'CONFIRMED': 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30',
    'RECEIVED_AT_STORE': 'bg-teal-500/20 text-teal-400 ring-teal-500/30',
    'PICKED_UP': 'bg-indigo-500/20 text-indigo-400 ring-indigo-500/30',
    'PROCESSING': 'bg-purple-500/20 text-purple-400 ring-purple-500/30',
    'READY': 'bg-green-500/20 text-green-400 ring-green-500/30',
    'OUT_FOR_DELIVERY': 'bg-blue-600/20 text-blue-500 ring-blue-600/30',
    'DELIVERED': 'bg-emerald-600/20 text-emerald-500 ring-emerald-600/30',
    'COLLECTED': 'bg-emerald-600/20 text-emerald-500 ring-emerald-600/30',
    'CANCELLED': 'bg-red-500/20 text-red-400 ring-red-500/30',
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
    <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden relative z-10">
      
      {/* Glare effect */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none -z-10"></div>

      <div className="overflow-x-auto relative z-10 custom-scrollbar">
        <table className="min-w-full divide-y divide-white/5 text-left">
          
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Service Mode</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location & Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/5 bg-transparent">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-10 w-10 text-slate-500 mb-3" />
                    <p className="text-white font-extrabold text-lg">No leads found</p>
                    <p className="text-slate-400 font-medium mt-1">Try adjusting your search or clearing your filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
            leads.map((lead) => {
                const allowedNextStatuses = (ALL_MODE_STATUSES[lead.serviceMode] || []).filter(s => s !== lead.status);
                
                return (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                    {/* Lead Info */}
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                        {lead.customerName}
                        {lead.leadNumber && <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">#{lead.leadNumber}</span>}
                      </div>
                      <div className="text-sm text-slate-400 mt-0.5">{lead.customerPhone}</div>
                    </td>
                    
                    {/* Service Mode */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-extrabold tracking-wide ${lead.serviceMode === 'PICKUP_DROP' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                        {lead.serviceMode === 'PICKUP_DROP' ? '🚚 Pickup & Drop' : '🏪 Store Visit'}
                      </span>
                    </td>
                    
                    {/* Location & Date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm font-medium">
                        {lead.pincode ? (
                          <div className="flex items-center gap-1.5 text-white">
                            <MapPinned size={14} className="text-primary" /> {lead.locality ? `${lead.locality}, ${lead.pincode}` : lead.pincode}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-xs italic">No address</div>
                        )}
                        {lead.pickupDate && (
                          <div className="flex items-center gap-1.5 text-slate-400 mt-1 text-xs font-bold">
                            🕒 {new Date(lead.pickupDate).toLocaleDateString()} {lead.pickupTimeSlot ? `| ${lead.pickupTimeSlot}` : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Status Dropdown (Headless UI) */}
                    <td className="px-6 py-4">
                      <Menu as="div" className="relative inline-block text-left">
                        <MenuButton 
                          disabled={allowedNextStatuses.length === 0}
                          className={`inline-flex items-center justify-between w-36 gap-x-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase font-extrabold ring-1 ring-inset transition-all ${statusColors[lead.status] || 'bg-slate-500/20 text-slate-400'} ${allowedNextStatuses.length === 0 ? 'opacity-80 cursor-not-allowed' : 'hover:brightness-110'}`}
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
                            <MenuItems anchor="bottom start" className="z-50 [--anchor-gap:4px] w-40 rounded-xl bg-[#0f172a] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 focus:outline-none overflow-hidden py-1">
                              <div className="py-1">
                                {allowedNextStatuses.map((statusVal) => (
                                  <MenuItem key={statusVal}>
                                    {({ focus }) => (
                                      <button
                                        onClick={() => onStatusChange(lead, statusVal)}
                                        className={`block w-full text-left px-4 py-2 text-sm font-bold ${
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
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenSlideOver(lead)}
                          className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-slate-300 shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Eye size={16} className="text-primary" /> View
                        </button>
                        
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-500/5 px-3 py-2 text-sm font-bold text-red-400 shadow-sm ring-1 ring-inset ring-red-500/20 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}