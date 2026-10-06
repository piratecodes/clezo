import { Search, Filter, X } from 'lucide-react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const TYPES = [
  { label: 'Enquiry', value: 'ENQUIRY' },
  { label: 'Complaint / Claim', value: 'COMPLAINT' },
];

const STATUSES = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Waiting on Customer', value: 'WAITING_CUSTOMER' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Closed', value: 'CLOSED' }
];

export default function TicketsHeader({ 
  searchQuery, onSearchChange, 
  statusFilter, onStatusFilterChange, 
  typeFilter, onTypeFilterChange 
}) {
  
  // Calculate if any filters are active
  const activeFiltersCount = (statusFilter !== 'All' ? 1 : 0) + (typeFilter !== 'All' ? 1 : 0);

  const clearFilters = () => {
    onStatusFilterChange('All');
    onTypeFilterChange('All');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Support Inbox</h1>
        <p className="text-slate-400 font-medium mt-1">Manage all enquiries & claims.</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search name, phone, ticket..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm text-white placeholder-slate-500 transition-all font-medium"
          />
        </div>

        {/* Headless UI Popover for Filters */}
        <Popover className="relative z-50">
          <PopoverButton className="flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary relative">
            <Filter size={18} /> Filters
            {/* Show a red dot if filters are applied */}
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-black">
                {activeFiltersCount}
              </span>
            )}
          </PopoverButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute right-0 z-50 mt-2 w-72 origin-top-right bg-[#0B202D]/95 backdrop-blur-3xl rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 focus:outline-none overflow-hidden">
              <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <span className="font-extrabold text-primary">Filter Tickets</span>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1">
                    <X size={14} /> Clear All
                  </button>
                )}
              </div>

              <div className="p-4 space-y-5">
                
                {/* Status Filter */}
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2 block">Ticket Status</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onStatusFilterChange('All')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        statusFilter === 'All' 
                          ? 'bg-primary/20 text-primary border-primary/30' 
                          : 'bg-black/30 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      All Statuses
                    </button>
                    {STATUSES.map(status => (
                      <button
                        key={status.value}
                        onClick={() => onStatusFilterChange(status.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          statusFilter === status.value 
                            ? 'bg-primary/20 text-primary border-primary/30' 
                            : 'bg-black/30 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2 block">Ticket Type</label>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => onTypeFilterChange('All')}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                        typeFilter === 'All' 
                          ? 'bg-primary/20 text-primary border-primary/30' 
                          : 'bg-black/30 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>All Types</span>
                      {typeFilter === 'All' && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,174,230,0.8)]"></div>}
                    </button>
                    {TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => onTypeFilterChange(type.value)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                          typeFilter === type.value 
                            ? 'bg-primary/20 text-primary border-primary/30' 
                            : 'bg-black/30 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{type.label}</span>
                        {typeFilter === type.value && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,174,230,0.8)]"></div>}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
      </div>
    </div>
  );
}
