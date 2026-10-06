import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Loader2, AlertCircle } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient'; 

// 🌟 CUSTOM PREMIUM TOOLTIP
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label} {new Date().getFullYear()}</p>
        <p className="text-white font-extrabold text-2xl flex items-center gap-2">
          {payload[0].value} <span className="text-sm font-medium text-slate-400">Leads</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function LeadsChartWidget() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetchClient('/admins/leads-history');
        if (response?.data?.history) {
          setData(response.data.history);
        }
      } catch (err) {
        console.error("Failed to load chart data:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  // 🌟 DYNAMIC GROWTH CALCULATION ENGINE
  const renderGrowthBadge = () => {
    if (data.length < 2) return null; // Need at least 2 months to compare

    const currentMonth = data[data.length - 1].leads;
    const previousMonth = data[data.length - 2].leads;
    
    let percentage = 0;

    // Handle math safely (prevent dividing by zero)
    if (previousMonth === 0) {
      percentage = currentMonth > 0 ? 100 : 0; 
    } else {
      percentage = Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
    }

    if (percentage > 0) {
      return (
        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-bold border border-emerald-500/20 flex items-center gap-1.5 shadow-sm">
          <TrendingUp size={16} /> +{percentage}% vs Last Month
        </div>
      );
    } else if (percentage < 0) {
      return (
        <div className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg text-sm font-bold border border-rose-500/20 flex items-center gap-1.5 shadow-sm">
          <TrendingDown size={16} /> {percentage}% vs Last Month
        </div>
      );
    } else {
      return (
        <div className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-sm font-bold border border-white/10 flex items-center gap-1.5 shadow-sm">
          <Minus size={16} /> 0% vs Last Month
        </div>
      );
    }
  };

  return (
    <div className="bg-on-primary-fixed/60 backdrop-blur-3xl p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col h-[400px]">
      
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-8 shrink-0 relative z-10">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2 drop-shadow-md">
            Lead Growth <TrendingUp size={20} className="text-emerald-400" />
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">6-Month historical performance</p>
        </div>
        
        {/* 🌟 RENDER THE DYNAMIC BADGE HERE */}
        {renderGrowthBadge()}
        
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-0 relative z-10">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : error || data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <AlertCircle size={32} className="mb-2 opacity-50" />
            <p className="font-medium text-sm">Not enough data to display chart.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00aee6" stopOpacity={0.6} /> 
                  <stop offset="95%" stopColor="#00aee6" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
              
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="#00aee6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorLeads)" 
                activeDot={{ r: 8, fill: '#00aee6', stroke: '#fff', strokeWidth: 3 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}