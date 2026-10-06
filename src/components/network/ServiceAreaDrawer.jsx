import { useState, useEffect } from 'react';
import { X, Save, MapPin, Map, Loader2, Tags } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function ServiceAreaDrawer({ isOpen, onClose, selectedArea, onSuccess }) {
  const [formData, setFormData] = useState({
    pincode: '',
    areaName: '',
    localities: [],
    isActive: true,
    notes: '',
  });

  const [localityInput, setLocalityInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRangeMode, setIsRangeMode] = useState(false);
  
  const [rangeData, setRangeData] = useState({
    fromPincode: '',
    toPincode: '',
    areaName: '',
    localities: [],
  });

  useEffect(() => {
    if (isOpen) {
      if (selectedArea) {
        setFormData({
          pincode: selectedArea.pincode,
          areaName: selectedArea.areaName,
          localities: selectedArea.localities || [],
          isActive: selectedArea.isActive,
          notes: selectedArea.notes || '',
        });
        setIsRangeMode(false);
      } else {
        setFormData({
          pincode: '',
          areaName: '',
          localities: [],
          isActive: true,
          notes: '',
        });
        setRangeData({
          fromPincode: '',
          toPincode: '',
          areaName: '',
          localities: [],
        });
      }
      setLocalityInput('');
    }
  }, [isOpen, selectedArea]);

  const handleAddLocality = (e, mode = 'single') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = localityInput.trim();
      if (val) {
        if (mode === 'single') {
          if (!formData.localities.includes(val)) {
            setFormData(prev => ({ ...prev, localities: [...prev.localities, val] }));
          }
        } else {
          if (!rangeData.localities.includes(val)) {
            setRangeData(prev => ({ ...prev, localities: [...prev.localities, val] }));
          }
        }
        setLocalityInput('');
      }
    }
  };

  const handleRemoveLocality = (locToRemove, mode = 'single') => {
    if (mode === 'single') {
      setFormData(prev => ({
        ...prev,
        localities: prev.localities.filter(l => l !== locToRemove)
      }));
    } else {
      setRangeData(prev => ({
        ...prev,
        localities: prev.localities.filter(l => l !== locToRemove)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRangeMode && !selectedArea) {
        // Bulk Create Mode
        await fetchClient('/service-areas/range', {
          method: 'POST',
          body: JSON.stringify(rangeData),
        });
        toast.success(`Successfully added pincode range!`);
      } else {
        // Single Edit / Create Mode
        if (selectedArea) {
          await fetchClient(`/service-areas/${selectedArea.id}`, {
            method: 'PATCH',
            body: JSON.stringify(formData),
          });
          toast.success('Service area updated!');
        } else {
          await fetchClient('/service-areas', {
            method: 'POST',
            body: JSON.stringify(formData),
          });
          toast.success('Service area added!');
        }
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to save service area');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0a0f1c] border-l border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="text-primary" size={24} />
              {selectedArea ? 'Edit Service Area' : 'Add Service Area'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {selectedArea ? 'Update pincode rules' : 'Define where you operate'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!selectedArea && (
            <div className="flex bg-white/5 p-1 rounded-xl mb-6">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${!isRangeMode ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsRangeMode(false)}
              >
                Single Pincode
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${isRangeMode ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsRangeMode(true)}
              >
                Bulk Range
              </button>
            </div>
          )}

          <form id="serviceAreaForm" onSubmit={handleSubmit} className="space-y-5">
            {isRangeMode && !selectedArea ? (
              // --- RANGE MODE ---
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">From Pincode</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. 400601"
                      value={rangeData.fromPincode}
                      onChange={(e) => setRangeData({ ...rangeData, fromPincode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">To Pincode</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. 400615"
                      value={rangeData.toPincode}
                      onChange={(e) => setRangeData({ ...rangeData, toPincode: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Default Area Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Thane City"
                    value={rangeData.areaName}
                    onChange={(e) => setRangeData({ ...rangeData, areaName: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Tags size={16} className="text-primary"/> Localities (Press Enter)
                  </label>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                    {rangeData.localities.map((loc) => (
                      <span key={loc} className="flex items-center gap-1 bg-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-md">
                        {loc}
                        <button type="button" onClick={() => handleRemoveLocality(loc, 'range')} className="hover:text-white">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none outline-none text-white text-sm min-w-[120px]"
                      placeholder="e.g. Majiwada..."
                      value={localityInput}
                      onChange={(e) => setLocalityInput(e.target.value)}
                      onKeyDown={(e) => handleAddLocality(e, 'range')}
                    />
                  </div>
                </div>
              </>
            ) : (
              // --- SINGLE MODE ---
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Pincode</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 400601"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Area Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Thane West"
                    value={formData.areaName}
                    onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Tags size={16} className="text-primary"/> Covered Localities (Press Enter to add)
                  </label>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all min-h-[50px]">
                    {formData.localities.map((loc) => (
                      <span key={loc} className="flex items-center gap-1 bg-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-md">
                        {loc}
                        <button type="button" onClick={() => handleRemoveLocality(loc, 'single')} className="hover:text-white transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none outline-none text-white text-sm min-w-[120px]"
                      placeholder="Add locality..."
                      value={localityInput}
                      onChange={(e) => setLocalityInput(e.target.value)}
                      onKeyDown={(e) => handleAddLocality(e, 'single')}
                    />
                  </div>
                  <p className="text-xs text-slate-500">List all major areas covered by this pincode.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mt-6">
                  <div>
                    <h4 className="text-sm font-bold text-white">Active Status</h4>
                    <p className="text-xs text-slate-400">Toggle serviceability for this pincode</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="space-y-1.5 mt-4">
                  <label className="text-sm font-medium text-slate-300">Admin Notes (Optional)</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all custom-scrollbar"
                    rows={3}
                    placeholder="Internal notes about this area..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-slate-300 font-semibold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="serviceAreaForm"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-[0_0_20px_rgba(0,174,230,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {selectedArea ? 'Save Changes' : (isRangeMode ? 'Bulk Add' : 'Add Area')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
