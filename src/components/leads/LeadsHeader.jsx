import { Search, Filter, X } from 'lucide-react';
import { Transition } from '@headlessui/react';
import { Fragment, useState, useRef, useEffect } from 'react';
import { fetchClient } from '@/api/fetchClient';
import CustomListbox from '../common/CustomListbox';

// Service Modes
const SERVICES = [
  { id: 'PICKUP_DROP', label: 'Pickup & Drop' },
  { id: 'STORE_VISIT', label: 'Store Visit' },
];

// Groups and full list of statuses
const STATUS_GROUPS = {
  Enquiry: [
    { label: 'New', value: 'NEW', modes: ['PICKUP_DROP'] },
    { label: 'Contacted', value: 'CONTACTED', modes: ['PICKUP_DROP'] },
    { label: 'Pending Quote', value: 'PENDING_QUOTE', modes: ['PICKUP_DROP'] },
    { label: 'Quote Sent', value: 'QUOTED', modes: ['PICKUP_DROP'] },
  ],
  'In Progress': [
    { label: 'Confirmed', value: 'CONFIRMED', modes: ['PICKUP_DROP'] },
    { label: 'Picked Up', value: 'PICKED_UP', modes: ['PICKUP_DROP'] },
    { label: 'Received (Store)', value: 'RECEIVED_AT_STORE', modes: ['STORE_VISIT'] },
    { label: 'Processing', value: 'PROCESSING', modes: ['STORE_VISIT', 'PICKUP_DROP'] },
    { label: 'Ready', value: 'READY', modes: ['STORE_VISIT', 'PICKUP_DROP'] },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY', modes: ['PICKUP_DROP'] },
  ],
  Completed: [
    { label: 'Delivered', value: 'DELIVERED', modes: ['PICKUP_DROP'] },
    { label: 'Collected', value: 'COLLECTED', modes: ['STORE_VISIT'] },
  ],
  Closed: [
    { label: 'Cancelled', value: 'CANCELLED', modes: ['STORE_VISIT', 'PICKUP_DROP'] },
  ]
};

export default function LeadsHeader({ 
  filters,
  onApplyFilters,
  onOpenCreateDrawer
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filterRef = useRef(null);
  
  // Draft filters for the popover
  const [draftFilters, setDraftFilters] = useState(filters);
  const [serviceAreas, setServiceAreas] = useState([]);

  useEffect(() => {
    // Sync draft filters when parent filters change
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    // Fetch service areas for Pincode dropdown
    fetchClient('/service-areas').then(res => {
      if(res.data?.serviceAreas) {
        setServiceAreas(res.data.serviceAreas);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        if (!event.target.closest('[role="listbox"]')) {
          setIsFiltersOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Calculate active filters (excluding search and quickTab)
  const activeFiltersCount = Object.keys(filters).filter(k => 
    k !== 'search' && k !== 'quickTab' && 
    filters[k] !== 'All' && filters[k] !== 'Any time' && filters[k] !== 'Any' && filters[k] !== 'All Sources'
  ).length;

  const handleDraftChange = (key, value) => {
    setDraftFilters(prev => {
      const next = { ...prev, [key]: value };
      
      // RESET RULES
      if (key === 'mode') {
        // Reset status to Active Leads if current status is not valid for new mode
        if (next.status !== 'All') {
          let isValid = false;
          Object.values(STATUS_GROUPS).flat().forEach(status => {
            if (status.value === next.status && status.modes.includes(value)) {
              isValid = true;
            }
          });
          if (!isValid) next.status = 'All'; // 'All' translates to Active Leads
        }

        // Clear irrelevant fields
        if (value === 'STORE_VISIT' || value === 'All') {
          next.pincode = 'All';
          next.pickupDate = 'Any';
        }
        if (value === 'PICKUP_DROP' || value === 'All') {
          next.expectedVisitDate = 'Any';
        }
      }
      return next;
    });
  };

  const applyFilters = () => {
    // clear quick tab when manually applying filters
    onApplyFilters({ ...draftFilters, quickTab: 'All' });
    setIsFiltersOpen(false);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      ...filters,
      mode: 'All',
      status: 'All',
      source: 'All Sources',
      pincode: 'All',
      quoteStatus: 'Any',
      createdDate: 'Any time',
      pickupDate: 'Any',
      expectedVisitDate: 'Any',
      quickTab: 'All'
    };
    setDraftFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    setIsFiltersOpen(false);
  };

  const handleQuickTab = (tab) => {
    let newFilters = { ...filters, quickTab: tab };
    if (tab === 'All') {
      newFilters = { ...newFilters, mode: 'All', status: 'All', pickupDate: 'Any', quoteStatus: 'Any' };
    } else if (tab === "Today's pickups") {
      newFilters = { ...newFilters, mode: 'PICKUP_DROP', pickupDate: 'Today' };
    } else if (tab === 'Ready for collection') {
      newFilters = { ...newFilters, mode: 'STORE_VISIT', status: 'READY' };
    } else if (tab === 'Pending quotes') {
      newFilters = { ...newFilters, quoteStatus: 'PENDING' };
    }
    setDraftFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const getStatusOptions = () => {
    if (draftFilters.mode === 'All') {
      return [
        { value: 'All', label: 'Active Leads' },
        ...Object.entries(STATUS_GROUPS).flatMap(([groupName, statuses]) => {
          if (statuses.length === 0) return [];
          // For All Modes, we combine and deduplicate. Since we just have raw statuses, we just use the modes filter.
          return [
            { isGroup: true, label: groupName, value: `group-${groupName}` },
            ...statuses.map(status => ({ value: status.value, label: status.label, isGroupItem: true }))
          ];
        })
      ];
    }

    const validStatuses = Object.values(STATUS_GROUPS).flat().filter(s => s.modes.includes(draftFilters.mode));
    return [
      { value: 'All', label: 'Active Leads' },
      ...validStatuses.map(s => ({ value: s.value, label: s.label }))
    ];
  };

  const pincodeOptions = [
    { value: 'All', label: 'All Pincodes' },
    ...serviceAreas.map(sa => ({ value: sa.pincode, label: sa.pincode }))
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Leads Pipeline</h1>
          <p className="text-slate-400 font-medium mt-1">Manage and update your customer quotes.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search name, phone, lead#..."
              value={filters.search}
              onChange={(e) => onApplyFilters({...filters, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm text-white placeholder-slate-500 transition-all font-medium"
            />
          </div>

          {/* Custom Controlled Popover for Filters */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary relative"
            >
              <Filter size={18} /> Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <Transition
              show={isFiltersOpen}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <div className="absolute right-0 z-50 mt-2 w-80 max-h-[85vh] flex flex-col origin-top-right bg-on-primary-fixed/95 backdrop-blur-3xl rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 focus:outline-none">
                <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
                  <span className="font-extrabold text-primary">Filter Leads</span>
                </div>
                
                <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                  
                  {/* Mode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service Mode</label>
                    <CustomListbox 
                      value={draftFilters.mode} 
                      onChange={(v) => handleDraftChange('mode', v)}
                      options={[{ value: 'All', label: 'All Modes' }, ...SERVICES.map(s => ({ value: s.id, label: s.label }))]}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lead Status</label>
                    <CustomListbox 
                      value={draftFilters.status} 
                      onChange={(v) => handleDraftChange('status', v)}
                      options={getStatusOptions()}
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Source</label>
                    <CustomListbox 
                      value={draftFilters.source} 
                      onChange={(v) => handleDraftChange('source', v)}
                      options={[
                        { value: 'All Sources', label: 'All Sources' },
                        { value: 'WEBSITE', label: 'Website' },
                        { value: 'WALK_IN', label: 'Walk-in' },
                        { value: 'PHONE_CALL', label: 'Phone Call' },
                        { value: 'WHATSAPP', label: 'WhatsApp' },
                        { value: 'REFERRAL', label: 'Referral' },
                        { value: 'OTHER', label: 'Other' },
                      ]}
                    />
                  </div>

                  {/* Created Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Created Date</label>
                    <CustomListbox 
                      value={draftFilters.createdDate} 
                      onChange={(v) => handleDraftChange('createdDate', v)}
                      options={[
                        { value: 'Any time', label: 'Any time' },
                        { value: 'Today', label: 'Today' },
                        { value: 'Yesterday', label: 'Yesterday' },
                        { value: 'Last 7 days', label: 'Last 7 days' },
                        { value: 'Last 30 days', label: 'Last 30 days' },
                      ]}
                    />
                  </div>

                  {/* Quote Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quote Status</label>
                    <CustomListbox 
                      value={draftFilters.quoteStatus} 
                      onChange={(v) => handleDraftChange('quoteStatus', v)}
                      options={[
                        { value: 'Any', label: 'Any' },
                        { value: 'PENDING', label: 'Pending' },
                        { value: 'QUOTED', label: 'Sent' },
                        { value: 'APPROVED', label: 'Approved' },
                      ]}
                    />
                  </div>

                  {/* Pickup & Drop specific filters */}
                  {draftFilters.mode === 'PICKUP_DROP' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pincode</label>
                        <CustomListbox 
                          value={draftFilters.pincode} 
                          onChange={(v) => handleDraftChange('pincode', v)}
                          options={pincodeOptions}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pickup Date</label>
                        <CustomListbox 
                          value={draftFilters.pickupDate} 
                          onChange={(v) => handleDraftChange('pickupDate', v)}
                          options={[
                            { value: 'Any', label: 'Any' },
                            { value: 'Today', label: 'Today' },
                            { value: 'Tomorrow', label: 'Tomorrow' },
                            { value: 'This week', label: 'This week' },
                          ]}
                        />
                      </div>
                    </>
                  )}

                  {/* Store Visit specific filters */}
                  {draftFilters.mode === 'STORE_VISIT' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expected Visit Date</label>
                      <CustomListbox 
                        value={draftFilters.expectedVisitDate} 
                        onChange={(v) => handleDraftChange('expectedVisitDate', v)}
                        options={[
                          { value: 'Any', label: 'Any' },
                          { value: 'Today', label: 'Today' },
                          { value: 'Tomorrow', label: 'Tomorrow' },
                          { value: 'This week', label: 'This week' },
                        ]}
                      />
                    </div>
                  )}

                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-white/5 border-t border-white/10 shrink-0 flex gap-2">
                  <button 
                    onClick={clearAllFilters} 
                    className="flex-1 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-black/20 rounded-xl"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="flex-1 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-fixed-variant transition-colors rounded-xl shadow-lg"
                  >
                    Apply
                  </button>
                </div>

              </div>
            </Transition>
          </div>
          
          <button 
            onClick={onOpenCreateDrawer}
            className="bg-primary hover:bg-primary-fixed-variant text-white font-bold h-12 px-5 rounded-2xl flex items-center gap-2 transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:shadow-[0_8px_25px_rgba(0,174,230,0.4)] whitespace-nowrap"
          >
            <span className="text-xl leading-none">+</span> <span className="hidden md:inline">Create Lead</span>
          </button>
        </div>
      </div>

      {/* Quick Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {['All', "Today's pickups", 'Ready for collection', 'Pending quotes'].map(tab => (
          <button
            key={tab}
            onClick={() => handleQuickTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              filters.quickTab === tab 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-black/20 text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
