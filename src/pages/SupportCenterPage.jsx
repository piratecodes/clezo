import { useState, useEffect } from 'react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { motion } from 'framer-motion';

import TicketsHeader from '@/components/support/TicketsHeader';
import TicketsTable from '@/components/support/TicketsTable';
import TicketSlideOver from '@/components/support/TicketSlideOver';

export default function SupportCenterPage() {
  useDocumentMeta("Support Center | Clezo OS", "Manage customer enquiries and complaints.");

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetchClient('/support-tickets');
      if (Array.isArray(response)) {
        setTickets(response);
      } else if (response && Array.isArray(response.data)) {
        setTickets(response.data);
      } else {
        setTickets([]); // Fallback
      }
    } catch (error) {
      toast.error('Failed to load support tickets from the server.');
      console.error(error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    const originalTickets = [...tickets];
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));

    try {
      await fetchClient(`/support-tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Ticket status moved to ${newStatus}`);
    } catch (error) {
      setTickets(originalTickets);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const openSlideOver = (ticket) => {
    setSelectedTicket(ticket);
    setIsSlideOverOpen(true);
  };

  const handleTicketUpdated = (updatedTicket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  // The Filter Engine
  const filteredTickets = tickets.filter((ticket) => {
    // 1. Search Query Match
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (ticket.ticketNumber && ticket.ticketNumber.toLowerCase().includes(query)) ||
      (ticket.name && ticket.name.toLowerCase().includes(query)) ||
      (ticket.phone && ticket.phone.toLowerCase().includes(query)) ||
      (ticket.subject && ticket.subject.toLowerCase().includes(query));

    // 2. Status Match
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;

    // 3. Type Match
    const matchesType = typeFilter === 'All' || ticket.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="max-w-[1600px] mx-auto relative z-10"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
        <TicketsHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </motion.div>

      {isLoading ? (
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="flex flex-col items-center justify-center py-20 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -z-10 animate-pulse"></div>
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <p className="text-slate-300 font-bold tracking-wide">Loading Inbox...</p>
        </motion.div>
      ) : (
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <TicketsTable 
            tickets={filteredTickets}
            onOpenSlideOver={openSlideOver} 
            onStatusChange={handleStatusChange} 
            isFiltering={searchQuery !== '' || statusFilter !== 'All' || typeFilter !== 'All'}
          />
        </motion.div>
      )}

      {selectedTicket && (
        <TicketSlideOver 
          isOpen={isSlideOverOpen} 
          setIsOpen={setIsSlideOverOpen} 
          ticketId={selectedTicket.id}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </motion.div>
  );
}
