import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { X, Save, Loader2, UserCircle, Camera, Check, RotateCcw, ShieldCheck, Monitor, Smartphone, Globe, LogOut } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop'; 

// --- CANVAS API UTILITIES FOR CROPPING ---
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
};

const getImageUrl = (pic) => {
  if (!pic || pic === 'default-avatar.png') return null;
  if (pic.startsWith('http')) return pic;
  
  let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  baseUrl = baseUrl.replace('/api/v1', '').replace(/\/$/, '');
  return `${baseUrl}/uploads/${pic}`;
};
// ------------------------------------------

export default function MyAccountModal({ isOpen, setIsOpen, initialTab = 'profile', onProfileUpdate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // -- CROPPER STATES --
  const fileInputRef = useRef(null);
  const [imageToCrop, setImageToCrop] = useState(null); 
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // -- FINAL STATES --
  const [finalCroppedBlob, setFinalCroppedBlob] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', designation: '', bio: '', profilePic: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadMyProfile();
      setImageToCrop(null);
      setFinalCroppedBlob(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const loadMyProfile = async () => {
    setIsFetching(true);
    try {
      const response = await fetchClient('/auth/me'); 
      const me = response.data?.user || response.data?.admin;
      
      setFormData({
        name: me.name || '', email: me.email || '', phone: me.phone || '',
        designation: me.designation || '', bio: me.bio || '', profilePic: me.profilePic || ''
      });
    } catch (error) {
      toast.error('Failed to load profile data');
      setIsOpen(false);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File is too large! Max 5MB.");
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => setImageToCrop(reader.result));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setFinalCroppedBlob(croppedBlob);
      setPreviewUrl(URL.createObjectURL(croppedBlob));
      setImageToCrop(null); 
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('designation', formData.designation);
      payload.append('bio', formData.bio);
      
      if (finalCroppedBlob) {
        payload.append('photo', finalCroppedBlob, 'profile.jpg'); 
      }

      const response = await fetchClient('/admins/me/upload-photo', { 
        method: 'PATCH', 
        body: payload 
      });
      
      toast.success('Your profile has been updated!');
      
      if (onProfileUpdate && response?.data?.staff?.profilePic) {
        onProfileUpdate(response.data.staff.profilePic);
      }

      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const displayImage = previewUrl ? previewUrl : getImageUrl(formData.profilePic);

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
                <div className="absolute top-0 right-0 w-[300px] h-[150px] bg-primary/20 blur-[60px] pointer-events-none -z-10 rounded-full"></div>

                <div className="bg-white/5 border-b border-white/10 px-6 py-4 text-white flex items-center justify-between">
                  <DialogTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                    <UserCircle size={20} className="text-primary" /> {imageToCrop ? 'Adjust Photo' : 'My Account'}
                  </DialogTitle>
                  <button onClick={() => { setIsOpen(false); setImageToCrop(null); }} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                {imageToCrop ? (
                  <div className="p-6">
                    <div className="relative h-64 w-full bg-black/50 rounded-xl overflow-hidden mb-6 border border-white/10">
                      <Cropper
                        image={imageToCrop}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} 
                        cropShape="round" 
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    
                    <div className="mb-6 px-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block text-center">Zoom</label>
                      <input 
                        type="range" 
                        value={zoom} 
                        min={1} 
                        max={3} 
                        step={0.1} 
                        aria-labelledby="Zoom" 
                        onChange={(e) => setZoom(e.target.value)} 
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setImageToCrop(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors border border-white/10">
                        <RotateCcw size={18} /> Cancel
                      </button>
                      <button type="button" onClick={handleApplyCrop} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-colors shadow-lg shadow-emerald-500/30">
                        <Check size={18} strokeWidth={3} /> Apply Crop
                      </button>
                    </div>
                  </div>
                ) : (
                  
                  isFetching ? (
                    <div className="flex justify-center items-center p-20">
                      <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      
                      <div className="flex flex-col items-center mb-6">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative h-24 w-24 rounded-full bg-black/20 border border-white/10 shadow-[0_0_15px_rgba(0,174,230,0.2)] flex items-center justify-center overflow-hidden cursor-pointer group"
                        >
                            {displayImage ? (
                              <img src={displayImage} alt="Profile" className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" />
                            ) : (
                              <UserCircle size={48} className="text-slate-500 group-hover:opacity-50 transition-opacity" />
                            )}
                            
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera size={24} className="text-white" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Click to upload (JPG/PNG, Max 5MB)</p>
                        
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Full Name <span className="text-primary">*</span></label>
                          <input type="text" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Phone <span className="text-primary">*</span></label>
                          <input type="text" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Email <span className="text-primary">*</span></label>
                          <input type="email" required className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Job Title</label>
                          <input type="text" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Sales Manager" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Short Bio</label>
                        <textarea rows="2" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500 text-sm" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="A little bit about yourself..." />
                      </div>

                      <div className="pt-4 mt-2 border-t border-white/10">
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_5px_20px_rgba(0,174,230,0.3)]">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Save My Profile
                        </button>
                      </div>
                    </form>
                  )
                )}

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}