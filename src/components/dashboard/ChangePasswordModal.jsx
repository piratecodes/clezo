import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X, Save, Loader2, KeyRound } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function ChangePasswordModal({ isOpen, setIsOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    setIsLoading(true);

    try {
      // NOTE: You will need a backend route for this! (e.g., PATCH /auth/update-password)
      await fetchClient('/auth/update-password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          logoutOtherDevices
        })
      });
      
      toast.success('Password updated successfully!');
      setIsOpen(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLogoutOtherDevices(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={() => setIsOpen(false)}>
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-on-primary-fixed/95 backdrop-blur-2xl border border-white/10 text-left align-middle shadow-[0_20px_60px_rgba(0,174,230,0.15)] transition-all relative">
                
                {/* Modal Sky Glare */}
                <div className="absolute top-0 left-0 w-[250px] h-[150px] bg-primary/20 blur-[50px] pointer-events-none -z-10 rounded-full"></div>

                <div className="bg-white/5 border-b border-white/10 px-6 py-4 text-white flex items-center justify-between">
                  <DialogTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                    <KeyRound size={20} className="text-primary" /> Change Password
                  </DialogTitle>
                  <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Current Password</label>
                    <input type="password" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">New Password</label>
                    <input type="password" required minLength={8} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Confirm New Password</label>
                    <input type="password" required minLength={8} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-2 border-t border-white/10">
                    <input
                      type="checkbox"
                      id="logoutOtherDevices"
                      className="w-4 h-4 rounded text-primary bg-black/20 border-white/20 focus:ring-primary"
                      checked={logoutOtherDevices}
                      onChange={(e) => setLogoutOtherDevices(e.target.checked)}
                    />
                    <label htmlFor="logoutOtherDevices" className="text-sm font-medium text-slate-300 select-none">
                      Log out of all other devices
                    </label>
                  </div>

                  <div className="pt-4 mt-2">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_5px_20px_rgba(0,174,230,0.3)]">
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Update Password
                    </button>
                  </div>
                </form>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}