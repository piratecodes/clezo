import { useState, useEffect } from 'react';
import { Users, Sparkles, MapPin, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import { motion } from 'framer-motion';

export default function StatsRow() {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, activeCities: 0, totalStaff: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchClient('/admins/dashboard-stats');
        
        // Safely grab the stats, or default to 0 if the backend structure is different
        if (response?.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        // Silently log it instead of annoying the user with a toast
        console.warn("Dashboard Stats couldn't load (likely a backend route mismatch):", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { title: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-primary', bg: 'bg-primary/20', shadow: 'hover:shadow-[0_10px_30px_rgba(0,174,230,0.2)]' },
    { title: 'New Quotes', value: stats.newLeads, icon: Sparkles, color: 'text-secondary', bg: 'bg-secondary/20', shadow: 'hover:shadow-[0_10px_30px_rgba(255,100,100,0.15)]' },
    { title: 'Active Cities', value: stats.activeCities, icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/20', shadow: 'hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)]' },
    { title: 'Total Staff', value: stats.totalStaff, icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/20', shadow: 'hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)]' },
  ];

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className={`bg-on-primary-fixed/60 backdrop-blur-3xl p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 ${card.shadow} group`}
        >
          <div className={`p-4 rounded-xl ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
            <card.icon className={card.color} size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 drop-shadow-md">{card.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}