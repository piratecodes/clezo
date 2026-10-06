import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown, Eye, Search, AlertCircle, MessageCircle } from 'lucide-react';

export default function TicketsTable({ tickets, onOpenSlideOver, onStatusChange, isFiltering }) {
  
  const statusColors = {
    'PENDING': 'bg-orange-500/20 text-orange-400 ring-orange-500/30',
    'IN_PROGRESS': 'bg-primary/20 text-primary ring-primary/30',
    'WAITING_CUSTOMER': 'bg-yellow-500/20 text-yellow-400 ring-yellow-500/30',
    'RESOLVED': 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30',
    'CLOSED': 'bg-slate-500/20 text-slate-400 ring-slate-500/30',
  };

  const statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Waiting on Customer', value: 'WAITING_CUSTOMER' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' }
  ];

  return (
    <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden relative z-10">
      
      {/* Glare effect */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none -z-10"></div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/40 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-bold">Ticket No.</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold">Customer</th>
              <th className="px-6 py-4 font-bold">Subject</th>
              <th className="px-6 py-4 font-bold">Created On</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
                  
                  {/* Ticket No */}
                  <td className="px-6 py-4">
                    <span className="font-bold text-white block">{ticket.ticketNumber}</span>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                      ticket.type === 'COMPLAINT' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {ticket.type === 'COMPLAINT' ? <AlertCircle size={14} /> : <MessageCircle size={14} />}
                      {ticket.type === 'COMPLAINT' ? 'COMPLAINT' : 'ENQUIRY'}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">{ticket.name}</div>
                    <div className="text-xs text-slate-400">{ticket.phone}</div>
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-4 max-w-[200px] truncate text-slate-300">
                    {ticket.subject || <span className="text-slate-500 italic">No Subject</span>}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="text-slate-300">
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(ticket.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-6 py-4">
                      <Menu as="div" className="relative inline-block text-left z-20">
                        <MenuButton className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${statusColors[ticket.status]} hover:bg-opacity-30 transition-all`}>
                          {statusOptions.find(opt => opt.value === ticket.status)?.label || ticket.status}
                          <ChevronDown size={14} className="opacity-70" />
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
                        <MenuItems anchor="bottom end" className="w-48 rounded-xl bg-on-primary-fixed border border-white/10 shadow-2xl shadow-black focus:outline-none overflow-hidden z-[100] [--anchor-gap:8px]">
                          <div className="p-1">
                            {statusOptions.map((opt) => (
                              <MenuItem key={opt.value}>
                                {({ active }) => (
                                  <button
                                    onClick={() => onStatusChange(ticket.id, opt.value)}
                                    className={`${
                                      active ? 'bg-primary/20 text-primary' : 'text-slate-300'
                                    } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors`}
                                  >
                                    {opt.label}
                                    {ticket.status === opt.value && (
                                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,174,230,0.8)]"></div>
                                    )}
                                  </button>
                                )}
                              </MenuItem>
                            ))}
                          </div>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenSlideOver(ticket)}
                        className="p-2 bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-primary rounded-lg transition-colors border border-white/5 hover:border-primary/30 group-hover:bg-white/10"
                        title="View & Reply"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-bold text-slate-400">No Tickets Found</p>
                    <p className="text-sm">
                      {isFiltering 
                        ? "Try adjusting your filters or search query." 
                        : "Your inbox is completely clear! Great job."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
