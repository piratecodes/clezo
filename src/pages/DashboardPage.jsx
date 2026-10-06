import { useState, useEffect } from 'react';
import { RefreshCcw, Loader2 } from 'lucide-react';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchClient } from '@/api/fetchClient';
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameDay, isSameWeek, isSameMonth } from 'date-fns';

import DateRangeSelector from '@/components/dashboard/DateRangeSelector';
import KpiCards from '@/components/dashboard/KpiCards';
import { LeadGrowthChart, ModeSplitDonut } from '@/components/dashboard/Charts';
import ActionLists from '@/components/dashboard/ActionLists';

export default function DashboardPage() {
  useDocumentMeta("Command Center | Clezo Express Laundry", "Overview of your business performance and critical actions.");

  const [dateRange, setDateRange] = useState({ range: '7d', from: null, to: null });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/dashboard/summary?range=${dateRange.range}`;
      if (dateRange.range === 'custom') {
        url += `&from=${dateRange.from}&to=${dateRange.to}`;
      }
      
      const res = await fetchClient(url);
      const serverData = res.data;
      
      // Post-process bucketing for charts
      const processedData = processBuckets(serverData.raw);
      
      setData({ ...serverData, bucketedGrowth: processedData });
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  // Bucketing logic
  const processBuckets = (raw) => {
    const start = new Date(raw.startDate);
    const end = new Date(raw.now);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    let intervals = [];
    let isSameFn, formatStr;
    
    if (diffDays <= 31) {
      intervals = eachDayOfInterval({ start, end });
      isSameFn = isSameDay;
      formatStr = 'd MMM';
    } else if (diffDays <= 120) {
      intervals = eachWeekOfInterval({ start, end });
      isSameFn = isSameWeek;
      formatStr = "'Week of' d MMM";
    } else {
      intervals = eachMonthOfInterval({ start, end });
      isSameFn = isSameMonth;
      formatStr = 'MMM yyyy';
    }

    return intervals.map(interval => {
      const currentLeads = raw.leadsRaw.filter(l => isSameFn(new Date(l.createdAt), interval));
      const prevLeads = raw.prevLeadsRaw.filter(l => isSameFn(new Date(l.createdAt), interval)); // This is an approximation for previous period alignment
      
      return {
        bucket: format(interval, formatStr),
        current: currentLeads.length,
        storeVisit: currentLeads.filter(l => l.serviceMode === 'STORE_VISIT').length,
        pickupDrop: currentLeads.filter(l => l.serviceMode === 'PICKUP_DROP').length,
        previous: prevLeads.length 
      };
    });
  };

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
          <p className="text-slate-400 mt-2 font-medium text-lg">Business overview and active pipeline.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 mr-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Updated {format(lastUpdated, 'HH:mm')}
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
              <p className="text-slate-400 font-bold">Compiling Business Metrics...</p>
            </div>
          ) : data ? (
            <>
              {/* KPI Cards */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <KpiCards data={data.kpis} />
              </motion.div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="xl:col-span-2">
                  <LeadGrowthChart data={data.bucketedGrowth} />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="xl:col-span-1">
                  <ModeSplitDonut storeVisit={data.modeSplit.storeVisit} pickupDrop={data.modeSplit.pickupDrop} />
                </motion.div>
              </div>

              {/* Action Lists Row */}
              <div className="mt-6">
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <ActionLists todayData={data.today} />
                </motion.div>
              </div>
            </>
          ) : null}
        </div>
      )}
    </motion.div>
  );
}