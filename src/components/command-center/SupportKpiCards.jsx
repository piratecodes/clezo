import React from 'react';
import { Users, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupportKpiCards({ data }) {
  if (!data) return null;
  
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#15233b] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-slate-400 font-medium tracking-wide text-sm">Total Active Requests</h3>
          <div className="p-3 bg-primary/10 rounded-xl">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="relative z-10">
          <span className="text-5xl font-black text-white tracking-tight">{data.totalActive}</span>
        </div>
      </div>

      <div className="bg-[#15233b] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-slate-400 font-medium tracking-wide text-sm">Pending Enquiries</h3>
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <AlertCircle className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="relative z-10">
          <span className="text-5xl font-black text-white tracking-tight">{data.pendingEnquiries}</span>
        </div>
      </div>

      <div className="bg-[#15233b] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-slate-400 font-medium tracking-wide text-sm">Pending Complaints</h3>
          <div className="p-3 bg-red-500/10 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>
        <div className="relative z-10">
          <span className="text-5xl font-black text-white tracking-tight">{data.pendingComplaints}</span>
        </div>
      </div>
    </motion.div>
  );
}
