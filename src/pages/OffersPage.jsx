import React, { useState, useEffect } from 'react';
import { 
  Plus, Tag, Edit2, Trash2, Loader2, Sparkles, Clock, 
  CheckCircle2, XCircle, ExternalLink, Flame, Copy, Bell, ChevronDown, Check, Info 
} from 'lucide-react';
import { Popover, PopoverButton, PopoverPanel, Switch } from '@headlessui/react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import OfferFormDrawer from '@/components/offers/OfferFormDrawer';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetchClient('/offers/admin/all');
      setOffers(res.data?.offers || []);
    } catch (error) {
      toast.error('Failed to load offers from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const openCreateDrawer = () => {
    setSelectedOffer(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (offer) => {
    setSelectedOffer(offer);
    setIsDrawerOpen(true);
  };

  const toggleStatus = async (offer) => {
    try {
      const updated = !offer.isActive;
      await fetchClient(`/offers/${offer.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: updated })
      });
      toast.success(updated ? 'Offer activated on live website!' : 'Offer deactivated');
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, isActive: updated } : o));
    } catch (err) {
      toast.error('Failed to toggle offer status');
    }
  };

  const toggleUrgencyTicker = async (offer) => {
    if (offer.isLimitedTime === false) {
      toast.error('Permanent / Lifetime offers cannot be shown in the urgency ticker.');
      return;
    }
    const updated = !offer.showInUrgencyTicker;
    try {
      await fetchClient(`/offers/${offer.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ showInUrgencyTicker: updated })
      });
      toast.success(updated ? `Urgency Ticker enabled for "${offer.title}"!` : `Urgency Ticker disabled for "${offer.title}"`);
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, showInUrgencyTicker: updated } : o));
    } catch (err) {
      toast.error('Failed to update urgency ticker');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the offer "${title}"?`)) return;

    try {
      await fetchClient(`/offers/${id}`, { method: 'DELETE' });
      toast.success('Offer deleted successfully!');
      loadOffers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete offer');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied!`);
  };

  const activeCount = offers.filter(o => o.isActive).length;
  const tickerActiveCount = offers.filter(o => o.isActive && o.isLimitedTime !== false && o.showInUrgencyTicker === true).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="max-w-[1600px] mx-auto relative z-10 space-y-8"
    >
      {/* Top Header */}
      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Promotions &amp; Offers
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {activeCount} Active
            </span>
          </div>
          <p className="text-slate-400 font-medium mt-1">
            Manage live discount coupons, countdown timers, and mobile app conversion deals.
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Ticker Controls Dropdown */}
          <Popover className="relative">
            {({ open }) => (
              <>
                <PopoverButton className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all border outline-none cursor-pointer ${
                  tickerActiveCount > 0
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    tickerActiveCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
                  }`} />
                  <span>⚡ Urgency Ticker: {tickerActiveCount > 0 ? `${tickerActiveCount} Active` : 'Hidden on Site'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </PopoverButton>

                <PopoverPanel 
                  transition
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700/80 p-4 shadow-2xl z-50 backdrop-blur-2xl transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white">
                      <Bell size={14} className="text-amber-400" />
                      <span>Urgency Ticker Controls</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tickerActiveCount > 0 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {tickerActiveCount > 0 ? 'Live on Frontend' : 'Hidden on Frontend'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Check which limited-time deals appear in the rotating ticker. If 0 are enabled, the ticker section automatically disappears on the website.
                  </p>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {offers.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No offers available</p>
                    ) : offers.map(offer => {
                      const isLifetime = offer.isLimitedTime === false;
                      return (
                        <div 
                          key={offer.id} 
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                            isLifetime 
                              ? 'bg-slate-950/40 border-slate-800/80 opacity-60' 
                              : offer.showInUrgencyTicker 
                                ? 'bg-amber-500/10 border-amber-500/30' 
                                : 'bg-slate-800/50 border-slate-700/60'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs text-white truncate block">
                              {offer.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] text-emerald-400 font-bold">{offer.code}</span>
                              {isLifetime ? (
                                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 rounded">♾️ Lifetime (N/A)</span>
                              ) : (
                                <span className="text-[9px] text-slate-400">⏳ Limited-Time</span>
                              )}
                            </div>
                          </div>

                          {isLifetime ? (
                            <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                              Off
                            </span>
                          ) : (
                            <Switch
                              checked={offer.showInUrgencyTicker}
                              onChange={() => toggleUrgencyTicker(offer)}
                              className={`${
                                offer.showInUrgencyTicker ? 'bg-amber-500' : 'bg-slate-700'
                              } relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                            >
                              <span
                                className={`${
                                  offer.showInUrgencyTicker ? 'translate-x-4 bg-white' : 'translate-x-0 bg-slate-300'
                                } pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </PopoverPanel>
              </>
            )}
          </Popover>

          <button
            onClick={openCreateDrawer}
            className="flex items-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus size={18} /> Launch New Offer
          </button>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <Tag size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{offers.length}</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Campaigns</div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Flame size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{activeCount}</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Deals On Site</div>
          </div>
        </div>
      </div>

      {/* Offers Cards List */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-slate-900/40 rounded-2xl border border-white/10">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-300 font-bold mt-4">Loading Offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/10">
          <Tag size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Active Offers Yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Launch your first promotion to drive laundry pickups and mobile app conversions.
          </p>
          <button
            onClick={openCreateDrawer}
            className="bg-primary hover:bg-primary-fixed-variant text-white px-5 py-2.5 rounded-xl font-bold text-sm"
          >
            Create Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const isExpired = offer.endDate && new Date(offer.endDate) < new Date();
            const claimPercent = Math.min(100, Math.round(((offer.claimedCount || 0) / (offer.maxClaims || 1)) * 100));

            return (
              <motion.div
                key={offer.id}
                variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                className={`bg-slate-900/60 backdrop-blur-2xl border rounded-2xl p-5 flex flex-col justify-between transition-all group ${
                  offer.isActive ? 'border-white/10 hover:border-primary/40' : 'border-red-900/30 opacity-70'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {offer.badge || 'Active Offer'}
                    </span>
                    <button
                      onClick={() => toggleStatus(offer)}
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                        offer.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {offer.isActive ? '● Live' : '○ Paused'}
                    </button>
                  </div>

                  {/* Banner Image if exists */}
                  {offer.bannerImage?.url && (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-white/5 bg-slate-800">
                      <img src={offer.bannerImage.url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Title & Discount */}
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2">
                    {offer.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                      {offer.discount}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">({offer.discountType})</span>
                  </div>

                  {/* Coupon Code Block */}
                  <div className="flex items-center justify-between bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-emerald-400 tracking-wider">
                        {offer.code}
                      </span>
                      {offer.showCouponCode === false && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">
                          Hidden on Web
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => copyCode(offer.code)}
                      className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                      title="Copy Code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  {/* Scarcity Progress or Permanent Status */}
                  {offer.isLimitedTime === false ? (
                    <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-center">
                      <span className="text-xs font-bold text-emerald-400">♾️ Permanent / Lifetime Offer</span>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Claimed Slots:</span>
                        <span className="text-slate-200 font-bold">{offer.claimedCount || 0} / {offer.maxClaims || 100}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full transition-all" style={{ width: `${claimPercent}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Expiry Date or Evergreen indicator */}
                  {offer.isLimitedTime === false ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                      <Clock size={13} className="text-emerald-400" />
                      <span>No expiry (Always available)</span>
                    </div>
                  ) : offer.endDate ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                      <Clock size={13} className={isExpired ? 'text-red-400' : 'text-amber-400'} />
                      <span>
                        {isExpired ? 'Expired' : `Expires: ${new Date(offer.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  ) : null}

                  {offer.isFeatured && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md mb-2">
                      <Sparkles size={11} /> Featured in Hero Banner Slider
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-2">
                  {/* Left: Quick Ticker status indicator */}
                  <div>
                    {offer.isLimitedTime === false ? (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                        ♾️ Lifetime (No Ticker)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleUrgencyTicker(offer)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1.5 ${
                          offer.showInUrgencyTicker
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                        title="Toggle appearance in Live Urgency Ticker on frontend"
                      >
                        <span>🔔 Ticker:</span>
                        <span className={offer.showInUrgencyTicker ? 'font-black text-amber-300' : 'text-slate-500'}>
                          {offer.showInUrgencyTicker ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditDrawer(offer)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Edit Offer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id, offer.title)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Offer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form Drawer */}
      <OfferFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        offerData={selectedOffer}
        onSave={loadOffers}
      />
    </motion.div>
  );
}
