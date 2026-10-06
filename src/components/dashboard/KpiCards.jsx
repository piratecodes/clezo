import { 
  Users, 
  Activity, 
  FileText, 
  IndianRupee, 
  CheckCircle2, 
  LifeBuoy,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useEffect, useState } from 'react';

const CountUp = ({ end, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    if (end === 0) return;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {prefix}
      {count.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
};

const formatPercent = (current, previous) => {
  if (!previous || previous === 0) return { val: 0, text: 'No prior data', color: 'text-slate-500' };
  const diff = ((current - previous) / previous) * 100;
  if (diff === 0) return { val: 0, text: '0%', color: 'text-slate-500' };
  return {
    val: diff,
    text: `${Math.abs(diff).toFixed(1)}%`,
    color: diff > 0 ? 'text-emerald-400' : 'text-red-400',
    Icon: diff > 0 ? TrendingUp : TrendingDown
  };
};

const KpiCard = ({ title, value, previousValue, icon: Icon, color, subtext, badge, isMoney = false }) => {
  const trend = formatPercent(value, previousValue);
  
  return (
    <div className="p-6 bg-on-primary-fixed/40 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-white/20 transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-${color}/20 transition-all`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-black/20 text-${color}`}>
          <Icon size={24} />
        </div>
        
        {badge && (
          <div className="px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {badge} Action Required
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-3xl font-extrabold text-white flex items-end gap-3">
          <CountUp end={value} prefix={isMoney ? '₹' : ''} />
          
          {previousValue !== undefined && (
            <span className={`flex items-center text-sm font-bold ${trend.color} pb-1`}>
              {trend.Icon && <trend.Icon size={14} className="mr-1" />}
              {trend.text}
            </span>
          )}
        </div>
        
        {subtext && (
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed max-w-[250px]">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default function KpiCards({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <KpiCard 
        title="Leads Created"
        value={data.leads.current}
        previousValue={data.leads.previous}
        icon={Users}
        color="primary"
      />
      <KpiCard 
        title="Active Orders"
        value={data.activeOrders}
        icon={Activity}
        color="emerald-400"
        subtext="Currently in progress"
      />
      <KpiCard 
        title="Pending Quotes"
        value={data.pendingQuotes}
        icon={FileText}
        color="amber-400"
        subtext="Awaiting admin pricing"
      />
      <KpiCard 
        title="Completed Value"
        value={data.completedValue.current}
        previousValue={data.completedValue.previous}
        icon={IndianRupee}
        color="emerald-500"
        isMoney={true}
        subtext={`Avg order value: ₹${Math.round(data.avgOrderValue)}`}
      />
      <KpiCard 
        title="Completed Orders"
        value={data.completedOrders.current}
        previousValue={data.completedOrders.previous}
        icon={CheckCircle2}
        color="emerald-400"
        subtext={`${data.cancelledOrders} cancelled (${Math.round(data.cancellationRate)}%)`}
      />
      <KpiCard 
        title="Open Tickets"
        value={data.openTickets}
        icon={LifeBuoy}
        color="red-400"
        badge={data.openComplaints > 0 ? `${data.openComplaints} Complaints` : null}
      />
    </div>
  );
}
