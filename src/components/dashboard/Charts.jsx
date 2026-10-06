import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useState } from 'react';
import CustomListbox from '../common/CustomListbox';

const ChartCard = ({ title, subtitle, children, extra }) => (
  <div className="p-6 bg-on-primary-fixed/40 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col h-[400px]">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 font-medium">{subtitle}</p>}
      </div>
      {extra}
    </div>
    <div className="flex-1 w-full relative">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B1121] border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-sm font-bold text-slate-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-slate-300 font-medium">{entry.name}:</span>
            <span className="text-sm font-extrabold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const LeadGrowthChart = ({ data }) => {
  const [filter, setFilter] = useState('ALL');

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Lead Growth" subtitle="Leads created over time">
        <div className="flex items-center justify-center h-full text-slate-500 font-bold">No data for this period</div>
      </ChartCard>
    );
  }

  // Filter data based on mode selection if we grouped it before rendering, 
  // but since we get raw data or buckets, we just render what we get.
  // Actually, the bucketing logic is in CrmPage/DashboardPage, let's assume `data` is already bucketed.

  return (
    <ChartCard 
      title="Lead Growth" 
      subtitle="Leads created over time"
      extra={
        <div className="w-40">
          <CustomListbox 
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'ALL', label: 'All Leads' },
              { value: 'STORE_VISIT', label: 'Store Visit Only' },
              { value: 'PICKUP_DROP', label: 'Pickup & Drop Only' }
            ]}
          />
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00aee6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00aee6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="bucket" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={filter === 'ALL' ? 'current' : filter === 'STORE_VISIT' ? 'storeVisit' : 'pickupDrop'} 
            name="Current Period"
            stroke="#00aee6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCurrent)" 
            animationDuration={600}
          />
          <Area 
            type="monotone" 
            dataKey="previous" 
            name="Previous Period"
            stroke="#64748b" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="transparent" 
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const ModeSplitDonut = ({ storeVisit, pickupDrop }) => {
  const data = [
    { name: 'Store Visit', value: storeVisit, color: '#3b82f6' },
    { name: 'Pickup & Drop', value: pickupDrop, color: '#00aee6' }
  ];

  const total = storeVisit + pickupDrop;

  if (total === 0) {
    return (
      <ChartCard title="Mode Split" subtitle="Walk-ins vs Pickups">
        <div className="flex items-center justify-center h-full text-slate-500 font-bold">No data for this period</div>
      </ChartCard>
    );
  }

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center gap-6 mt-4">
        {payload.map((entry, index) => {
          const val = entry.payload.value;
          const pct = Math.round((val / total) * 100);
          return (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-slate-300 font-medium">{entry.value}</span>
              <span className="text-sm font-extrabold text-white">{val} ({pct}%)</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <ChartCard title="Mode Split" subtitle="Walk-ins vs Pickups">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
            animationDuration={600}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
