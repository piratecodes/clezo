import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function SupportTrendChart({ data }) {
  if (!data || data.length === 0) return null;
  
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-8 bg-[#15233b] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white">Request Trends</h3>
        <p className="text-slate-400 text-sm mt-1">General Enquiries vs Complaints over time</p>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
              minTickGap={30}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dx={-10} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: '#ffffff10', 
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                color: '#fff'
              }} 
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              name="General Enquiries"
              dataKey="enquiries" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} 
              activeDot={{ r: 8, stroke: '#ffffff30', strokeWidth: 4 }} 
            />
            <Line 
              type="monotone" 
              name="Complaints"
              dataKey="complaints" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} 
              activeDot={{ r: 8, stroke: '#ffffff30', strokeWidth: 4 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
