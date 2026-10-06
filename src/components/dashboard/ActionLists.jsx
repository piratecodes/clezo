import { Tab } from '@headlessui/react';
import { formatDistanceToNow } from 'date-fns';
import { Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Badge = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black rounded-full bg-red-500 text-white animate-pulse">
      {count}
    </span>
  );
};

const ActionTable = ({ columns, data, renderRow, emptyMessage, viewAllLink }) => {
  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-bold">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {columns.map((col, i) => <th key={i} className="pb-3 px-4 whitespace-nowrap">{col}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((row, i) => renderRow(row, i))}
            </tbody>
          </table>
        )}
      </div>
      
      {data.length > 0 && (
        <div className="pt-4 mt-auto border-t border-white/5 flex justify-end">
          <Link 
            to={viewAllLink}
            className="text-sm font-bold text-primary hover:text-white flex items-center gap-1 transition-colors group"
          >
            View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default function ActionLists({ todayData }) {
  if (!todayData) return null;

  const { pickups, ready, overdue, pendingQuotes } = todayData;

  const tabs = [
    { name: "Today's Pickups", count: pickups.count },
    { name: "Ready for Handover", count: ready.count },
    { name: "Overdue", count: overdue.count },
    { name: "Pending Quotes", count: pendingQuotes.count },
  ];

  const getStatusBadge = (status) => {
    return <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-bold text-slate-300">{status}</span>;
  };

  return (
    <div className="bg-on-primary-fixed/40 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-white">Action Lists</h3>
          <p className="text-sm text-slate-400 font-medium">Critical items needing attention today</p>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-2 border-b border-white/10 pb-4 mb-4 overflow-x-auto custom-scrollbar">
          {tabs.map((tab, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                `whitespace-nowrap rounded-xl py-2 px-4 text-sm font-bold transition-all outline-none
                ${selected
                  ? 'bg-primary text-white shadow-[0_0_10px_rgba(0,174,230,0.3)]'
                  : 'bg-black/20 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                }`
              }
            >
              {tab.name}
              <Badge count={tab.count} />
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Pickups */}
          <Tab.Panel>
            <ActionTable 
              columns={['Lead #', 'Customer', 'Locality', 'Status']}
              data={pickups.rows}
              emptyMessage="No pickups scheduled for today."
              viewAllLink="/admin/crm" // Needs query param handling or relying on Quick Tabs in CRM
              renderRow={(row) => (
                <tr key={row.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="py-3 px-4 text-sm font-bold text-white">{row.leadNumber}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-300">{row.customerName}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-400">{row.locality || '-'}</td>
                  <td className="py-3 px-4">{getStatusBadge(row.status)}</td>
                </tr>
              )}
            />
          </Tab.Panel>

          {/* Ready */}
          <Tab.Panel>
            <ActionTable 
              columns={['Lead #', 'Customer', 'Phone', 'Mode']}
              data={ready.rows}
              emptyMessage="No orders ready for handover."
              viewAllLink="/admin/crm"
              renderRow={(row) => (
                <tr key={row.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="py-3 px-4 text-sm font-bold text-white">{row.leadNumber}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-300">{row.customerName}</td>
                  <td className="py-3 px-4 text-sm font-medium">
                    <a href={`tel:${row.customerPhone}`} className="text-primary hover:text-white flex items-center gap-1 w-fit">
                      <Phone size={12} /> {row.customerPhone}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-xs font-bold text-slate-400">{row.serviceMode.replace('_', ' ')}</td>
                </tr>
              )}
            />
          </Tab.Panel>

          {/* Overdue */}
          <Tab.Panel>
            <ActionTable 
              columns={['Lead #', 'Customer', 'Days Overdue']}
              data={overdue.rows}
              emptyMessage="No overdue orders. Great job!"
              viewAllLink="/admin/crm"
              renderRow={(row) => {
                const targetDate = row.serviceMode === 'PICKUP_DROP' ? row.pickupDate : row.expectedVisitAt;
                const days = targetDate ? Math.floor((new Date() - new Date(targetDate)) / (1000 * 60 * 60 * 24)) : 0;
                return (
                  <tr key={row.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="py-3 px-4 text-sm font-bold text-white">{row.leadNumber}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-300">{row.customerName}</td>
                    <td className="py-3 px-4 text-sm font-black text-red-400">{days} days</td>
                  </tr>
                );
              }}
            />
          </Tab.Panel>

          {/* Pending Quotes */}
          <Tab.Panel>
            <ActionTable 
              columns={['Lead #', 'Customer', 'Waiting Time']}
              data={pendingQuotes.rows}
              emptyMessage="No pending quotes."
              viewAllLink="/admin/crm"
              renderRow={(row) => (
                <tr key={row.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="py-3 px-4 text-sm font-bold text-white">{row.leadNumber}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-300">{row.customerName}</td>
                  <td className="py-3 px-4 text-sm font-medium text-amber-400">
                    {formatDistanceToNow(new Date(row.createdAt))}
                  </td>
                </tr>
              )}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
