import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Save, Loader2, Image as ImageIcon, Images, Trash2, UploadCloud, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function GalleryAlbumFormDrawer({ isOpen, setIsOpen, albumData, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    categoryName: '',
    slug: '',
    description: '',
    isPublished: true,
    featuredImage: { url: '', alt: '' },
    images: [] 
  });

  useEffect(() => {
    if (albumData) {
      setFormData({
        categoryName: albumData.categoryName || '',
        slug: albumData.slug || '',
        description: albumData.description || '',
        isPublished: albumData.isPublished ?? true,
        featuredImage: { url: albumData.featuredImage?.url || '', alt: albumData.featuredImage?.alt || '' },
        images: albumData.images || []
      });
    } else {
      setFormData({
        categoryName: '', slug: '', description: '', isPublished: true,
        featuredImage: { url: '', alt: '' }, images: []
      });
    }
  }, [albumData, isOpen]);

  const autoGenerateSlug = (categoryName) => {
    if (albumData?.id) return;
    const newSlug = categoryName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, slug: newSlug }));
  };

  // 🌟 CLOUDINARY WIDGET (FIXED: Removed the pre-fetch, uses strictly POST Callback!)
  const openCloudinaryWidget = (uploadType) => {
    if (!window.cloudinary) return toast.error("Cloudinary script missing.");
    const isBulk = uploadType === 'gallery';

    window.cloudinary.openUploadWidget({
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
        folder: import.meta.env.MODE === 'development' ? 'dev/gallery' : 'gallery',
        cropping: !isBulk, 
        multiple: isBulk, 
        // 🌟 MAGIC CALLBACK FIX: Signs the parameters exactly when needed!
        uploadSignature: async (callback, params_to_sign) => {
          try {
            const res = await fetchClient('/cloudinary-signature', {
              method: 'POST',
              body: JSON.stringify(params_to_sign)
            });
            callback(res.data.signature);
          } catch (err) {
            toast.error("Signature failed");
          }
        },
        styles: { palette: { window: "#18181b", sourceBg: "#27272a", windowBorder: "#3f3f46", tabIcon: "#c5a059", inactiveTabIcon: "#a1a1aa", menuIcons: "#e4e4e7", link: "#c5a059", action: "#c5a059", inProgress: "#3b82f6", complete: "#10b981", error: "#ef4444", textDark: "#000000", textLight: "#ffffff" } }
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        const imageUrl = result.info.secure_url;
        
        if (uploadType === 'featured') {
          // Auto-delete old cover photo if replacing
          const oldCover = formData.featuredImage?.url;
          if (oldCover && oldCover !== imageUrl) {
             fetchClient('/location-pages/delete-image', { method: 'POST', body: JSON.stringify({ imageUrl: oldCover }) }).catch(console.error);
          }
          setFormData(prev => ({ ...prev, featuredImage: { ...prev.featuredImage, url: imageUrl } }));
          toast.success("Cover photo uploaded!");
        } else {
          setFormData(prev => ({ ...prev, images: [...prev.images, { url: imageUrl, alt: '' }] }));
        }
      }
      if (!error && result && result.event === "queues-end" && isBulk) {
         toast.success("All gallery images uploaded!");
      }
    });
  };

  // Destroy image from Cloudinary when clicking the trash can in the gallery grid
  const removeGalleryImage = async (index) => {
    const targetImage = formData.images[index];
    if (targetImage?.url) {
      await fetchClient('/location-pages/delete-image', { method: 'POST', body: JSON.stringify({ imageUrl: targetImage.url }) }).catch(console.error);
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateGalleryAltText = (index, newAlt) => {
    const newImages = [...formData.images];
    newImages[index].alt = newAlt;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.featuredImage.url) return toast.error("Cover photo is required!");
    
    setIsLoading(true);
    try {
      if (albumData) {
        await fetchClient(`/gallery/${albumData.id}`, { method: 'PATCH', body: JSON.stringify(formData) });
        toast.success('Album updated');
      } else {
        await fetchClient('/gallery', { method: 'POST', body: JSON.stringify(formData) });
        toast.success('Album published!');
      }
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to publish album");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntireAlbum = async () => {
    if (!window.confirm("WARNING: This will permanently delete this album and all its data. Continue?")) return;
    setIsDeleting(true);
    try {
      await fetchClient(`/gallery/${albumData.id}`, { method: 'DELETE' });
      toast.success('Album permanently deleted');
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Transition show={isOpen ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={() => setIsOpen(false)}>
        <TransitionChild as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                
                <DialogPanel className="pointer-events-auto w-screen max-w-3xl">
                  <form onSubmit={handleSubmit} className="flex h-full flex-col bg-on-primary-fixed/95 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,174,230,0.15)] border-l border-white/10 relative overflow-hidden">
                    
                    {/* Drawer Sky Glare */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[80px] pointer-events-none -z-10 rounded-full"></div>

                    {/* HEADER */}
                    <div className="bg-white/5 border-b border-white/10 px-6 py-5 shrink-0 relative z-10">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-extrabold flex items-center gap-2 text-white">
                          <Images size={20} className="text-primary" />
                          {albumData ? 'Studio: Edit Album' : 'Studio: New Album'}
                        </DialogTitle>
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => setFormData({...formData, isPublished: !formData.isPublished})} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${formData.isPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-black/40 text-slate-400 border border-white/10'}`}>
                            {formData.isPublished ? <Eye size={14}/> : <EyeOff size={14}/>}
                            {formData.isPublished ? 'Published' : 'Draft Mode'}
                          </button>
                          <button type="button" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                      </div>
                    </div>

                    {/* SCROLLABLE BODY */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
                      
                      {/* 1. ALBUM DETAILS */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/10 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1. Album Details</h3>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Album Title <span className="text-primary">*</span></label>
                          <input type="text" required className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none font-bold text-white placeholder-slate-500 transition-all" value={formData.categoryName} onChange={(e) => { setFormData({...formData, categoryName: e.target.value}); autoGenerateSlug(e.target.value); }} placeholder="e.g., Premium Car Transport in Delhi" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">URL Slug <span className="text-primary">*</span></label>
                          <input type="text" required className="w-full p-3 bg-black/40 border border-white/5 rounded-xl focus:ring-1 focus:ring-primary outline-none font-bold text-slate-400 placeholder-slate-600 transition-all" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g., premium-car-transport" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1">Short Description</label>
                          <textarea rows="2" className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white placeholder-slate-500 transition-all" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Briefly describe this project or category..." />
                        </div>
                      </div>

                      {/* 2. COVER PHOTO */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">2. Featured Cover Photo <span className="text-primary">*</span></h3>
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          <div className="shrink-0 flex flex-col gap-3 w-full sm:w-1/3">
                            {formData.featuredImage.url ? (
                              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                <img src={formData.featuredImage.url} alt="Cover Preview" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-slate-500 bg-black/20">
                                <ImageIcon size={24} className="mb-2 opacity-50" />
                              </div>
                            )}
                            
                            {/* 🌟 ADDED COVER PHOTO REMOVE BUTTON 🌟 */}
                            <div className="flex gap-2 w-full">
                              <button type="button" onClick={() => openCloudinaryWidget('featured')} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-xl hover:bg-white/10 hover:text-white transition-colors flex justify-center items-center gap-1.5">
                                <UploadCloud size={14} /> {formData.featuredImage.url ? 'Change' : 'Upload Cover'}
                              </button>
                              
                              {formData.featuredImage.url && (
                                <button 
                                  type="button" 
                                  onClick={async () => {
                                    await fetchClient('/location-pages/delete-image', { method: 'POST', body: JSON.stringify({ imageUrl: formData.featuredImage.url }) }).catch(console.error);
                                    setFormData(prev => ({ ...prev, featuredImage: { url: '', alt: '' } }));
                                  }} 
                                  className="px-3 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                          </div>
                          <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-slate-300 mb-1">Alt Text (SEO) <span className="text-primary">*</span></label>
                            <input type="text" required={!!formData.featuredImage.url} className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white placeholder-slate-500 transition-all" value={formData.featuredImage.alt} onChange={(e) => setFormData(prev => ({...prev, featuredImage: { ...prev.featuredImage, alt: e.target.value }}))} placeholder="e.g., White BMW safely loaded onto trailer" />
                          </div>
                        </div>
                      </div>

                      {/* 3. BULK GALLERY IMAGES */}
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Album Photos ({formData.images.length})</h3>
                           <button type="button" onClick={() => openCloudinaryWidget('gallery')} className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-fixed-variant transition-colors shadow-[0_5px_15px_rgba(0,174,230,0.3)]">
                             <UploadCloud size={16}/> Bulk Upload Photos
                           </button>
                        </div>
                        
                        {formData.images.length === 0 ? (
                          <div className="text-center py-12 bg-black/20 rounded-xl border border-dashed border-white/20">
                            <Images size={32} className="mx-auto text-slate-500 mb-3" />
                            <p className="text-sm font-bold text-slate-400">No photos in this album.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formData.images.map((img, index) => (
                              <div key={index} className="flex gap-4 p-3 bg-black/40 border border-white/10 rounded-xl relative group">
                                <button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-500/20 border border-red-500/50 text-red-400 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                                
                                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10">
                                  <img src={img.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alt Text</label>
                                  <input type="text" className="w-full p-2 bg-black/40 border border-white/10 rounded-lg outline-none text-xs text-white focus:border-primary placeholder-slate-600" value={img.alt} onChange={(e) => updateGalleryAltText(index, e.target.value)} placeholder="Describe photo..." />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 🌟 DELETE ALBUM ZONE */}
                      {albumData && (
                        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2"><AlertTriangle size={16}/> Danger Zone</h3>
                              <p className="text-xs text-slate-400 mt-1">Permanently delete this album and all its images from the database.</p>
                            </div>
                            <button type="button" onClick={handleDeleteEntireAlbum} disabled={isDeleting} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/30 rounded-lg text-sm font-bold transition-colors">
                              {isDeleting ? 'Deleting...' : 'Delete Album'}
                           </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-white/10 px-6 py-4 bg-white/5 shrink-0 relative z-10">
                      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 font-bold py-3.5 rounded-xl transition-all text-white shadow-[0_5px_15px_rgba(0,174,230,0.3)]">
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {albumData ? 'Save Changes' : 'Publish Album'}
                      </button>
                    </div>

                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}