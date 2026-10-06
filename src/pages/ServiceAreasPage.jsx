import { useState, useEffect } from 'react';
import { fetchClient } from '@/api/fetchClient';
import { motion } from 'framer-motion';
import { MapPin, Plus, Loader2, Edit3, Trash2, CheckCircle2, XCircle, Search } from 'lucide-react';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import ServiceAreaDrawer from '@/components/network/ServiceAreaDrawer';
import toast from 'react-hot-toast';

export default function ServiceAreasPage() {
  useDocumentMeta("Service Areas | Clezo Admin", "Manage active pincodes and localities for Clezo Express Laundry");

  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const res = await fetchClient('/service-areas');
      if (res?.data) {
        setAreas(res.data);
      }
    } catch (err) {
      toast.error('Failed to load service areas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service area?")) return;
    try {
      await fetchClient(`/service-areas/${id}`, { method: 'DELETE' });
      toast.success('Deleted successfully');
      fetchAreas();
    } catch (err) {
      toast.error('Failed to delete area');
    }
  };

  const handleToggleActive = async (area) => {
    try {
      await fetchClient(`/service-areas/${area.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !area.isActive }),
      });
      toast.success(`Area ${!area.isActive ? 'activated' : 'deactivated'}`);
      fetchAreas();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredAreas = areas.filter(a => 
    a.pincode.includes(searchTerm) || 
    a.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.localities.some(l => l.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1600px] mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-on-primary-fixed/60 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <MapPin className="text-primary" size={32} />
            Service Areas
          </h1>
          <p className="text-slate-400 mt-1">Define and manage active pincodes and localities for Doorstep Pickup.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search pincode or locality..."
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary outline-none min-w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setSelectedArea(null); setIsDrawerOpen(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,174,230,0.4)] hover:scale-105 transition-all"
          >
            <Plus size={18} /> Add Area
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-xs uppercase tracking-widest text-slate-400 font-bold">
                <th className="px-6 py-4">Pincode</th>
                <th className="px-6 py-4">Area Name</th>
                <th className="px-6 py-4 min-w-[200px]">Covered Localities</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto text-primary mb-2" size={24} />
                    Loading service areas...
                  </td>
                </tr>
              ) : filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No service areas found.
                  </td>
                </tr>
              ) : (
                filteredAreas.map((area) => (
                  <tr key={area.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-bold text-white tracking-wider">
                      {area.pincode}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {area.areaName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {area.localities?.slice(0, 3).map(loc => (
                          <span key={loc} className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-slate-300">
                            {loc}
                          </span>
                        ))}
                        {area.localities?.length > 3 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-400">
                            +{area.localities.length - 3} more
                          </span>
                        )}
                        {!area.localities?.length && <span className="text-slate-500 italic text-xs">None specified</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleActive(area)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          area.isActive 
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                        }`}
                      >
                        {area.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {area.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => { setSelectedArea(area); setIsDrawerOpen(true); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 text-slate-300 transition-all"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(area.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 hover:scale-110 active:scale-95 text-rose-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceAreaDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedArea={selectedArea}
        onSuccess={() => {
          setIsDrawerOpen(false);
          fetchAreas();
        }}
      />
    </motion.div>
  );
}
