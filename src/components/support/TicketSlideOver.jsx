import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { X, Phone, Mail, User, Send, Paperclip, Loader2, Link, MapPin, MessageCircle } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function TicketSlideOver({ isOpen, setIsOpen, ticketId, onTicketUpdated }) {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && ticketId) {
      loadTicket();
    } else {
      setTicket(null);
      setReplyBody('');
    }
  }, [isOpen, ticketId]);

  const loadTicket = async () => {
    setIsLoading(true);
    try {
      const response = await fetchClient(`/support-tickets/${ticketId}`);
      setTicket(response);
    } catch (error) {
      toast.error('Failed to load ticket details.');
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const handleSendReply = async () => {
    if (!replyBody.trim()) return;
    setIsSending(true);
    try {
      await fetchClient(`/support-tickets/${ticketId}/messages/staff`, {
        method: 'POST',
        body: JSON.stringify({ body: replyBody, isInternal }),
      });
      toast.success(isInternal ? 'Internal note added' : 'Reply sent');
      setReplyBody('');
      loadTicket(); // Reload to get new messages
    } catch (error) {
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-on-primary-fixed/60 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-2xl bg-on-primary-fixed shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l border-white/10 relative">
                  <div className="flex flex-col h-full">
                  
                  {/* Glare effect */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] pointer-events-none -z-10 rounded-full mix-blend-screen"></div>

                  {isLoading || !ticket ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-primary mb-4" size={40} />
                      <p className="text-slate-400">Loading Ticket Details...</p>
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="flex items-start justify-between p-6 border-b border-white/5 bg-black/20 shrink-0">
                        <div>
                          <DialogTitle className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            {ticket.ticketNumber}
                            <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase ${
                              ticket.type === 'COMPLAINT' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {ticket.type}
                            </span>
                          </DialogTitle>
                          <p className="text-lg text-slate-300 font-medium">{ticket.subject || 'No Subject'}</p>
                        </div>
                        <button
                          type="button"
                          className="rounded-full bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors border border-white/5"
                          onClick={() => setIsOpen(false)}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Content Area (Scrollable) */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                        
                        {/* Customer Info Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <User size={14} /> Customer Details
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Name</p>
                              <p className="text-sm font-semibold text-white">{ticket.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Phone (Required)</p>
                              <a href={`tel:${ticket.phone}`} className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline">
                                <Phone size={14} /> {ticket.phone}
                              </a>
                            </div>
                            {ticket.email && (
                              <div className="col-span-2">
                                <p className="text-xs text-slate-500 mb-1">Email</p>
                                <a href={`mailto:${ticket.email}`} className="text-sm text-slate-300 flex items-center gap-1.5 hover:text-white hover:underline">
                                  <Mail size={14} /> {ticket.email}
                                </a>
                              </div>
                            )}
                            {ticket.leadId && (
                              <div className="col-span-2 pt-2 border-t border-white/5">
                                <p className="text-xs text-slate-500 mb-1">Linked Order</p>
                                <div className="text-sm text-blue-400 flex items-center gap-1.5 cursor-pointer hover:underline">
                                  <Link size={14} /> View Lead #{ticket.leadId}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Original Message */}
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Original Message</h3>
                            <span className="text-xs text-slate-500">
                              {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - {new Date(ticket.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
                        </div>

                        {/* Thread (Replies) */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">Conversation History</h3>
                          {ticket.messages?.length > 0 ? (
                            ticket.messages.map((msg) => {
                              const isStaff = msg.authorType === 'STAFF';
                              return (
                                <div key={msg.id} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                                  {isStaff && msg.isInternal && (
                                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-t-md mb-[-2px] z-10 border border-yellow-500/20 border-b-0 uppercase tracking-widest">Internal Note</span>
                                  )}
                                  <div className={`max-w-[85%] rounded-2xl p-4 relative z-0 ${
                                    isStaff 
                                      ? msg.isInternal 
                                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-100 rounded-tr-sm' 
                                        : 'bg-primary/20 border border-primary/30 text-white rounded-tr-sm'
                                      : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm'
                                  }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs font-bold opacity-70">
                                        {isStaff ? (msg.author?.name || 'Staff') : ticket.name}
                                      </span>
                                      <span className="text-[10px] opacity-50">• {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}, {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4 bg-white/5 rounded-2xl border border-white/10 border-dashed text-center">
                              <MessageCircle className="w-10 h-10 text-slate-500 mb-3 opacity-50" />
                              <p className="text-slate-300 font-bold mb-1">No replies yet</p>
                              <p className="text-slate-500 text-xs">There are no messages in this conversation. Be the first to reply!</p>
                            </div>
                          )}
                        </div>
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Reply Box */}
                      <div className="p-6 bg-black/40 border-t border-white/5 shrink-0">
                        <div className="flex items-center gap-4 mb-3">
                          <button
                            onClick={() => setIsInternal(true)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${isInternal ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'}`}
                          >
                            Internal Note
                          </button>
                          <button
                            onClick={() => setIsInternal(false)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${!isInternal ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'}`}
                          >
                            Public Reply
                          </button>
                        </div>
                        <div className="relative">
                          <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder={isInternal ? "Write a private note for the team..." : "Write a reply to the customer..."}
                            className={`w-full bg-white/5 border rounded-xl p-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 resize-none h-32 transition-all custom-scrollbar ${
                              isInternal ? 'border-yellow-500/30 focus:ring-yellow-500/50' : 'border-white/10 focus:ring-primary/50'
                            }`}
                          />
                          <button
                            onClick={handleSendReply}
                            disabled={!replyBody.trim() || isSending}
                            className={`absolute bottom-4 right-4 p-2 rounded-lg transition-all ${
                              !replyBody.trim() ? 'bg-white/5 text-slate-500 cursor-not-allowed' :
                              isInternal ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-primary text-white hover:bg-primary-light shadow-[0_0_15px_rgba(0,174,230,0.4)]'
                            }`}
                          >
                            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={replyBody.trim() ? "ml-0.5" : ""} />}
                          </button>
                        </div>
                      </div>
                    </>
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
