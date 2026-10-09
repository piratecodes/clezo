import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Save, Loader2, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'SALES_AGENT', name: 'Sales Agent' },
  { id: 'ADMIN', name: 'Manager (Admin)' },
  { id: 'SUPER_ADMIN', name: 'Super Admin (Boss)' }
];

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
              <DialogPanel className="w-full max-w-lg transform rounded-2xl bg-on-primary-fixed/95 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,174,230,0.15)] border border-white/10 text-left align-middle transition-all relative overflow-visible">
                
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
                      <Listbox value={formData.role} onChange={(val) => setFormData({...formData, role: val})}>
                        <div className="relative">
                          <ListboxButton className="relative w-full cursor-default rounded-xl bg-black/20 border border-white/10 py-3 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white sm:text-sm font-bold transition-all shadow-sm">
                            <span className="block truncate">{ROLES.find(r => r.id === formData.role)?.name || 'Select Role'}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                              <ChevronDown size={18} aria-hidden="true" />
                            </span>
                          </ListboxButton>
                          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-900 border border-white/10 text-base shadow-2xl focus:outline-none sm:text-sm ring-1 ring-black/5 p-1">
                              {ROLES.map((role) => (
                                <ListboxOption
                                  key={role.id}
                                  className={({ focus }) =>
                                    `relative cursor-default select-none py-2.5 pl-10 pr-4 transition-colors rounded-lg ${
                                      focus ? 'bg-primary/20 text-white' : 'text-slate-300'
                                    }`
                                  }
                                  value={role.id}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className={`block truncate ${selected ? 'font-bold text-primary' : 'font-medium'}`}>
                                        {role.name}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                          <Check size={16} aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </Transition>
                        </div>
                      </Listbox>
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