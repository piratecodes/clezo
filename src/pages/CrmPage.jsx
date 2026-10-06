import { useState, useEffect, Fragment } from 'react';
import { fetchClient } from '@/api/fetchClient';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { motion } from 'framer-motion';

import LeadsHeader from '@/components/leads/LeadsHeader';
import LeadsTable from '@/components/leads/LeadsTable';
import LeadSlideOver from '@/components/leads/LeadSlideOver';
import CreateLeadDrawer from '@/components/leads/CreateLeadDrawer';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

export default function CrmPage() {
  useDocumentMeta("CRM | Clezo Express Laundry", "Manage and track all your leads in one place.");

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    mode: 'All',
    status: 'All',
    source: 'All Sources',
    pincode: 'All',
    quoteStatus: 'Any',
    createdDate: 'Any time', // Any time, Today, Yesterday, Last 7 days, Last 30 days
    pickupDate: 'Any', // Any, Today, Tomorrow, This week
    expectedVisitDate: 'Any', // Any, Today, Tomorrow, This week
    quickTab: 'All' // All, Today's pickups, Ready for collection, Pending quotes
  });
  
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Modal state for cancellation
  const [cancelModalState, setCancelModalState] = useState({ isOpen: false, lead: null, newStatus: null, reason: '' });
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, leadId: null });

  useEffect(() => {
    fetchLeads(filters, pagination.page);
  }, [filters, pagination.page]);

  const fetchLeads = async (currentFilters = filters, page = 1) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 50);

      // Search
      if (currentFilters.search) queryParams.append('search', currentFilters.search);
      
      // Mode & Status
      if (currentFilters.mode !== 'All') queryParams.append('mode', currentFilters.mode);
      if (currentFilters.status !== 'All') queryParams.append('status', currentFilters.status);

      // Extra Filters
      if (currentFilters.source !== 'All Sources') queryParams.append('source', currentFilters.source);
      if (currentFilters.pincode !== 'All') queryParams.append('pincode', currentFilters.pincode);
      if (currentFilters.quoteStatus !== 'Any') queryParams.append('quoteStatus', currentFilters.quoteStatus);

      // Date logic based on string enums
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      // createdDate mapping
      if (currentFilters.createdDate === 'Today') {
        queryParams.append('createdFrom', today.toISOString());
      } else if (currentFilters.createdDate === 'Yesterday') {
        queryParams.append('createdFrom', yesterday.toISOString());
        queryParams.append('createdTo', today.toISOString()); // up to today 00:00
      } else if (currentFilters.createdDate === 'Last 7 days') {
        queryParams.append('createdFrom', sevenDaysAgo.toISOString());
      } else if (currentFilters.createdDate === 'Last 30 days') {
        queryParams.append('createdFrom', thirtyDaysAgo.toISOString());
      }

      // pickupDate mapping
      if (currentFilters.mode === 'PICKUP_DROP') {
        if (currentFilters.pickupDate === 'Today') {
          queryParams.append('pickupFrom', today.toISOString());
          queryParams.append('pickupTo', tomorrow.toISOString());
        } else if (currentFilters.pickupDate === 'Tomorrow') {
          queryParams.append('pickupFrom', tomorrow.toISOString());
          const dayAfter = new Date(tomorrow);
          dayAfter.setDate(dayAfter.getDate() + 1);
          queryParams.append('pickupTo', dayAfter.toISOString());
        } else if (currentFilters.pickupDate === 'This week') {
          queryParams.append('pickupFrom', today.toISOString());
          queryParams.append('pickupTo', nextWeek.toISOString());
        }
      }

      // expectedVisitDate mapping
      if (currentFilters.mode === 'STORE_VISIT') {
        if (currentFilters.expectedVisitDate === 'Today') {
          queryParams.append('visitFrom', today.toISOString());
          queryParams.append('visitTo', tomorrow.toISOString());
        } else if (currentFilters.expectedVisitDate === 'Tomorrow') {
          queryParams.append('visitFrom', tomorrow.toISOString());
          const dayAfter = new Date(tomorrow);
          dayAfter.setDate(dayAfter.getDate() + 1);
          queryParams.append('visitTo', dayAfter.toISOString());
        } else if (currentFilters.expectedVisitDate === 'This week') {
          queryParams.append('visitFrom', today.toISOString());
          queryParams.append('visitTo', nextWeek.toISOString());
        }
      }

      const response = await fetchClient(`/leads?${queryParams.toString()}`);
      setLeads(response.data.data || []);
      setPagination(prev => ({ ...prev, total: response.data.total }));
    } catch (error) {
      toast.error('Failed to load leads from the server.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (lead, newStatus, cancelReason = null) => {
    if (newStatus === 'CANCELLED' && !cancelReason) {
      setCancelModalState({ isOpen: true, lead, newStatus, reason: '' });
      return;
    }

    const originalLeads = [...leads];
    setLeads(leads.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));

    try {
      const payload = { status: newStatus };
      if (cancelReason) {
        payload.cancelReason = cancelReason;
      }
      
      const response = await fetchClient(`/leads/${lead.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      
      if (response.success) {
        toast.success(`Lead status moved to ${newStatus}`);
        setLeads(leads.map(l => l.id === lead.id ? response.data.lead : l));
        // If drawer is open for this lead, update it too
        if (selectedLead?.id === lead.id) {
          setSelectedLead(response.data.lead);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setLeads(originalLeads);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const submitCancel = () => {
    if (cancelModalState.reason.trim().length < 3) {
      toast.error("Cancel reason must be at least 3 characters.");
      return;
    }
    handleStatusChange(cancelModalState.lead, cancelModalState.newStatus, cancelModalState.reason);
    setCancelModalState({ isOpen: false, lead: null, newStatus: null, reason: '' });
  };

  const openSlideOver = (lead) => {
    setSelectedLead(lead);
    setIsSlideOverOpen(true);
  };

  const handleLeadUpdated = (updatedLead) => {
    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    if (selectedLead?.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
  };

  const handleDeleteLead = (leadId) => {
    setDeleteModalState({ isOpen: true, leadId });
  };

  const confirmDeleteLead = async () => {
    const { leadId } = deleteModalState;
    if (!leadId) return;

    try {
      await fetchClient(`/leads/${leadId}`, { method: 'DELETE' });
      setLeads(leads.filter((lead) => lead.id !== leadId));
      toast.success('Lead permanently deleted.');
    } catch (error) {
      toast.error(error.message || 'Failed to delete lead');
    } finally {
      setDeleteModalState({ isOpen: false, leadId: null });
    }
  };

  // Filters are now handled server-side

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="max-w-[1600px] mx-auto relative z-10"
    >
      {/* 👇 Pass state to Header 👇 */}
      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
        <LeadsHeader 
          filters={filters}
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          onOpenCreateDrawer={() => setIsCreateDrawerOpen(true)}
        />
      </motion.div>

      {isLoading ? (
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="flex flex-col items-center justify-center py-20 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -z-10 animate-pulse"></div>
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <p className="text-slate-300 font-bold tracking-wide">Decrypting Pipeline Data...</p>
        </motion.div>
      ) : (
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <LeadsTable 
            leads={leads}
            onOpenSlideOver={openSlideOver} 
            onStatusChange={handleStatusChange} 
            onDeleteLead={handleDeleteLead}
            isFiltering={Object.values(filters).some(v => v !== 'All' && v !== 'Any time' && v !== 'Any' && v !== 'All Sources' && v !== '')}
          />
        </motion.div>
      )}

      <LeadSlideOver 
        isOpen={isSlideOverOpen} 
        setIsOpen={setIsSlideOverOpen} 
        lead={selectedLead}
        onLeadUpdated={handleLeadUpdated}
        onStatusChange={handleStatusChange} // 👈 Pass it down to drawer too!
      />

      {/* Cancellation Modal */}
      <Transition appear show={cancelModalState.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[70]" onClose={() => setCancelModalState({ ...cancelModalState, isOpen: false })}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-on-primary-fixed/95 backdrop-blur-3xl border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-extrabold leading-6 text-white"
                  >
                    Cancel Lead #{cancelModalState.lead?.leadNumber}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-slate-400 font-medium">
                      Please provide a reason for cancelling this lead. This will be logged in the lead history.
                    </p>
                    <textarea
                      rows={3}
                      className="mt-4 w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-white text-sm transition-all resize-none placeholder-slate-500"
                      placeholder="e.g. Customer found another provider..."
                      value={cancelModalState.reason}
                      onChange={(e) => setCancelModalState({ ...cancelModalState, reason: e.target.value })}
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl bg-white/5 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setCancelModalState({ ...cancelModalState, isOpen: false })}
                    >
                      Never mind
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors disabled:opacity-50"
                      onClick={submitCancel}
                      disabled={cancelModalState.reason.trim().length < 3}
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <CreateLeadDrawer 
        isOpen={isCreateDrawerOpen} 
        setIsOpen={setIsCreateDrawerOpen}
        onLeadCreated={fetchLeads}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        setIsOpen={(isOpen) => setDeleteModalState((prev) => ({ ...prev, isOpen }))}
        onConfirm={confirmDeleteLead}
        title="Delete Lead"
        message="Are you sure you want to permanently delete this lead? This action cannot be undone and will erase all data associated with it."
      />
    </motion.div>
  );
}