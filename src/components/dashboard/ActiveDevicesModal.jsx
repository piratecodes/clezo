import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Loader2, Monitor, Smartphone, Globe, LogOut } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function ActiveDevicesModal({ isOpen, setIsOpen }) {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setIsSessionsLoading(true);
    try {
      const response = await fetchClient('/sessions');
      setSessions(response.data?.sessions || []);
      setCurrentSessionId(response.data?.currentSessionId || null);
    } catch (error) {
      toast.error('Failed to load active sessions');
    } finally {
      setIsSessionsLoading(false);
    }
  };

  const revokeSession = async (sessionId) => {
    try {
      await fetchClient(`/sessions/${sessionId}`, { method: 'DELETE' });
      toast.success('Session revoked successfully');
      loadSessions();
    } catch (error) {
      toast.error(error.message || 'Failed to revoke session');
    }
  };

  const revokeAllOtherSessions = async () => {
    try {
      await fetchClient('/sessions/others', { method: 'DELETE' });
      toast.success('All other devices have been logged out');
      loadSessions();
    } catch (error) {
      toast.error(error.message || 'Failed to revoke sessions');
    }
  };

  const getDeviceIcon = (deviceInfo) => {
    const info = (deviceInfo || '').toLowerCase();
    if (info.includes('mobile') || info.includes('iphone') || info.includes('android')) return <Smartphone className="text-primary/70" size={24} />;
    if (info.includes('windows') || info.includes('mac') || info.includes('linux')) return <Monitor className="text-primary/70" size={24} />;
    return <Globe className="text-primary/70" size={24} />;
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[70]" onClose={() => setIsOpen(false)}>
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-on-primary-fixed/95 backdrop-blur-2xl border border-white/10 text-left align-middle shadow-[0_20px_60px_rgba(0,174,230,0.15)] transition-all relative">
                
                {/* Modal Sky Glare */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-primary/10 blur-[60px] pointer-events-none -z-10 rounded-full"></div>

                <div className="bg-white/5 border-b border-white/10 px-6 py-4 text-white flex items-center justify-between">
                  <DialogTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                    <Monitor size={20} className="text-primary" /> Active Devices
                  </DialogTitle>
                  <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white">Your Active Sessions</h3>
                    <button
                      onClick={revokeAllOtherSessions}
                      disabled={!sessions.some(s => s.id !== currentSessionId)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-transparent ${
                        sessions.some(s => s.id !== currentSessionId)
                          ? 'text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 border-red-500/20 hover:border-red-500'
                          : 'text-slate-500 bg-white/5 cursor-not-allowed border-white/5'
                      }`}
                    >
                      Log out of all other devices
                    </button>
                  </div>
                  
                  {isSessionsLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={24} /></div>
                  ) : (
                    <div className="space-y-3 max-h-75 overflow-y-auto pr-1 custom-scrollbar">
                      {sessions.map((session) => {
                        const isCurrent = session.id === currentSessionId;
                        return (
                          <div key={session.id} className={`flex items-center justify-between p-4 rounded-xl border ${isCurrent ? 'border-primary/40 bg-primary/10' : 'border-white/10 bg-white/5'}`}>
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${isCurrent ? 'bg-primary/20' : 'bg-black/20 border border-white/5'}`}>
                                {getDeviceIcon(session.deviceInfo)}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-white flex items-center gap-2">
                                  {session.deviceInfo || 'Unknown Device'}
                                  {isCurrent && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Current</span>}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            {!isCurrent && (
                              <button
                                onClick={() => revokeSession(session.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                title="Revoke Session"
                              >
                                <LogOut size={18} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
