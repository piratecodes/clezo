import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, MapPinned } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function RecentLeadsWidget() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecentLeads = async () => {
      try {
        // Fetch all leads, but we'll just slice the top 5 for the dashboard
        const response = await fetchClient('/leads');
        setLeads(response.data.leads.slice(0, 5));
      } catch (error) {
        toast.error("Failed to load recent leads.");
      } finally {
        setIsLoading(false);
      }
    };
    loadRecentLeads();
  }, []);

  // Utility to color-code statuses
  const getStatusBadge = (status) => {
    const styles = {
      'New': 'bg-primary/20 text-primary border-primary/30',
      'Contacted': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Quoted': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Converted': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Lost': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return `px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles['New']}`;
  };

  return (
    <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden h-full flex flex-col relative z-10">
      
      {/* Ambient inner glare left */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
        <h2 className="text-lg font-extrabold text-white drop-shadow-md">Recent Quote Requests</h2>
        <button 
          onClick={() => navigate('/crm')}
          className="text-sm font-bold text-primary hover:text-white flex items-center gap-1 transition-colors"
        >
          View CRM <ArrowRight size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 relative z-10 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-medium">No leads in the pipeline yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="p-4 pl-6 font-bold">Customer</th>
                <th className="p-4 font-bold">Service</th>
                <th className="p-4 font-bold">Route</th>
                <th className="p-4 pr-6 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-white group-hover:text-primary transition-colors">{lead.customerName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{lead.customerPhone}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-slate-300 bg-black/20 border border-white/10 px-2 py-1 rounded-md tracking-wide">
                      {lead.serviceRequested.replace(/-/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                      <MapPinned size={16} className="text-primary/70" />
                      <span>{lead.originCity} {lead.destinationCity ? `→ ${lead.destinationCity}` : ''}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6">
                    <span className={getStatusBadge(lead.status)}>{lead.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}