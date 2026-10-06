import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, MoreVertical, Edit2, Trash2, Loader2, EyeOff } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryAlbumFormDrawer from '@/components/gallery/GalleryUploader'; // Adjust import path if needed

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const loadAlbums = async () => {
    setIsLoading(true);
    try {
      const res = await fetchClient('/gallery/admin/all');
      setAlbums(res.data?.galleries || []);
    } catch (error) {
      toast.error('Failed to load gallery albums');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const openCreateDrawer = () => {
    setSelectedAlbum(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (album) => {
    setSelectedAlbum(album);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete the album "${name}"?`)) return;
    
    try {
      await fetchClient(`/gallery/${id}`, { method: 'DELETE' });
      toast.success('Album deleted');
      loadAlbums();
    } catch (error) {
      toast.error(error.message || 'Failed to delete album');
    }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="p-8 max-w-7xl mx-auto relative z-10"
    >
      {/* Header */}
      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Media Gallery</h1>
          <p className="text-slate-400 font-medium mt-1">Manage your service albums and event photos.</p>
        </div>
        <button 
          onClick={openCreateDrawer}
          className="flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5"
        >
          <Plus size={20} /> Create New Album
        </button>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="flex flex-col justify-center items-center h-64 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -z-10 animate-pulse"></div>
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-300 font-bold tracking-wide mt-4">Loading Media...</p>
        </motion.div>
      ) : albums.length === 0 ? (
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="text-center py-20 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <ImageIcon size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-bold text-white">No Albums Yet</h3>
          <p className="text-slate-400 mt-2 mb-6">Create your first album to start showcasing your work.</p>
          <button onClick={openCreateDrawer} className="text-primary font-bold hover:underline">Click here to create one</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {albums.map((album, index) => (
              <motion.div 
                key={album.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,174,230,0.15)] hover:border-primary/40 transition-all group relative"
              >
                
                {/* Draft Status Badge */}
                {!album.isPublished && (
                  <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <EyeOff size={14} /> Draft
                  </div>
                )}

                {/* Action Buttons (Show on hover) */}
                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditDrawer(album)} className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-lg text-slate-300 hover:text-white shadow-sm hover:bg-primary/50 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(album.id, album.categoryName)} className="bg-red-500/20 backdrop-blur-md border border-red-500/30 p-2 rounded-lg text-red-400 hover:text-white shadow-sm hover:bg-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Cover Photo */}
                <div className="aspect-4/3 w-full relative bg-black/20 overflow-hidden">
                  {album.featuredImage?.url ? (
                    <img src={album.featuredImage.url} alt={album.categoryName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={40} /></div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>

                {/* Details */}
                <div className="p-5 absolute bottom-0 w-full z-10">
                  <h3 className="font-bold text-white text-lg truncate drop-shadow-md">{album.categoryName}</h3>
                  <p className="text-slate-300 text-sm font-medium mt-0.5 flex items-center gap-1.5 drop-shadow-sm">
                    <ImageIcon size={14} className="text-primary" /> {album.images?.length || 0} Photos
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* The Dark Studio Drawer */}
      <GalleryAlbumFormDrawer 
        isOpen={isDrawerOpen} 
        setIsOpen={setIsDrawerOpen} 
        albumData={selectedAlbum} 
        onSuccess={loadAlbums} 
      />
    </motion.div>
  );
}