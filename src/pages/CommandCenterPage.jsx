import { useState, useEffect } from 'react';
import { RefreshCcw, Loader2 } from 'lucide-react';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { motion } from 'framer-motion';
import { fetchClient } from '@/api/fetchClient';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';

import SupportKpiCards from '@/components/command-center/SupportKpiCards';
import SupportTrendChart from '@/components/command-center/SupportTrendChart';

export default function CommandCenterPage() {
  useDocumentMeta("Command Center | Clezo Express Laundry", "Support and enquiries overview.");

  const [dateRange, setDateRange] = useState({ range: '30d', from: null, to: null });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let days = 30;
      if (dateRange.range && dateRange.range.endsWith('d')) {
        days = parseInt(dateRange.range);
      }
      
      const res = await fetchClient(`/support-tickets/stats/command-center?days=${days}`);
      // FIX: fetchClient directly returns the JSON response, so we just pass res.
      setData(res);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch support metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="space-y-8 max-w-[1600px] mx-auto relative z-10"
    >
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-8 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 relative z-50">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-40 bg-secondary/10 rounded-full blur-[50px] -ml-20 -mb-20 pointer-events-none"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Command Center</h1>
          <p className="text-slate-400 mt-2 font-medium text-lg">Support requests and enquiries overview.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 mr-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Updated {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
            <button 
              onClick={fetchData} 
              disabled={isLoading}
              className="p-2 rounded-full bg-black/20 text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <DateRangeSelector 
            selectedRange={dateRange.range} 
            customFrom={dateRange.from} 
            customTo={dateRange.to}
            onRangeChange={setDateRange} 
          />
        </div>
      </div>

      {error ? (
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <p className="text-red-400 font-bold mb-4">{error}</p>
          <button onClick={fetchData} className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
            Retry
          </button>
        </div>
      ) : (
        <div className={`transition-opacity duration-300 ${isLoading && data ? 'opacity-50' : 'opacity-100'}`}>
          {!data && isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
              <p className="text-slate-400 font-bold">Compiling Support Metrics...</p>
            </div>
          ) : data ? (
            <>
              {/* Modular KPI Cards */}
              <SupportKpiCards data={data.kpis} />

              {/* Modular Trend Chart */}
              <SupportTrendChart data={data.trendChart} />
            </>
          ) : null}
        </div>
      )}
    </motion.div>
  );
}
