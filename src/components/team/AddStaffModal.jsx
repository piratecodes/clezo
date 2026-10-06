import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Save, Loader2, ShieldCheck } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function AddStaffModal({ isOpen, setIsOpen, staffData, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', phone: '', role: 'SALES_AGENT', password: ''
  });

  // Populate or clear form when modal opens
  useEffect(() => {
    if (staffData) {
      setFormData({
        name: staffData.name || '',
        username: staffData.username || '',
        email: staffData.email || '',
        phone: staffData.phone || '',
        role: staffData.role || 'SALES_AGENT',
        password: '' // Kept empty, backend rejects password updates here
      });
    } else {
      setFormData({ name: '', username: '', email: '', phone: '', role: 'SALES_AGENT', password: '' });
    }
  }, [staffData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (staffData) {
        // UPDATE (Remove password and username from payload so backend doesn't throw an error)
        const { password, username, ...updateData } = formData;
        await fetchClient(`/admins/${staffData.id}`, { method: 'PATCH', body: JSON.stringify(updateData) });
        toast.success('Staff profile updated');
      } else {
        // CREATE NEW
        await fetchClient('/admins', { method: 'POST', body: JSON.stringify(formData) });
        toast.success('New team member created');
      }
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save staff member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-on-primary-fixed/95 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,174,230,0.15)] border border-white/10 text-left align-middle transition-all relative">
                
                {/* Modal Sky Glare */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[60px] pointer-events-none -z-10 rounded-full"></div>

                <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between relative z-10">
                  <DialogTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-white drop-shadow-md">
                    <ShieldCheck size={18} className="text-primary" />
                    {staffData ? 'Edit Team Member' : 'Add New Staff'}
                  </DialogTitle>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2 border border-white/10"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1">Full Name <span className="text-primary">*</span></label>
                      <input type="text" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1">Username <span className="text-primary">*</span></label>
                      <input type="text" required disabled={!!staffData} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none disabled:opacity-50" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1">Email <span className="text-primary">*</span></label>
                      <input type="email" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1">Phone <span className="text-primary">*</span></label>
                      <input type="text" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1">System Role <span className="text-primary">*</span></label>
                      <select required className="w-full p-3 bg-slate-900 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white font-bold outline-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                        <option value="SALES_AGENT">Sales Agent</option>
                        <option value="ADMIN">Manager (Admin)</option>
                        <option value="SUPER_ADMIN">Super Admin (Boss)</option>
                      </select>
                    </div>
                    
                    {/* Only show password if we are creating a NEW user */}
                    {!staffData && (
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Temporary Password <span className="text-primary">*</span></label>
                        <input type="text" required minLength={8} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Min 8 chars" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5">
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {staffData ? 'Update Profile' : 'Create Account'}
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