import { useState, Fragment, useEffect } from 'react';
import { Tab, Popover, Transition } from '@headlessui/react';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '@/style/DateRangeSelector.css';

const RANGES = [
  { id: '7d', label: '7 Days' },
  { id: '4w', label: '4 Weeks' },
  { id: '3m', label: '3 Months' },
  { id: '6m', label: '6 Months' },
  { id: 'custom', label: 'Custom' }
];

export default function DateRangeSelector({ selectedRange, onRangeChange, customFrom, customTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (customFrom && customTo) {
      setStartDate(new Date(customFrom));
      setEndDate(new Date(customTo));
    }
  }, [customFrom, customTo]);

  const handleTabClick = (index) => {
    const range = RANGES[index];
    if (range.id !== 'custom') {
      setIsOpen(false);
      onRangeChange({ range: range.id, from: null, to: null });
    } else {
      setIsOpen(true);
    }
  };

  const selectedIndex = RANGES.findIndex(r => r.id === selectedRange);

  const handleApplyCustom = () => {
    if (startDate && endDate) {
      onRangeChange({ 
        range: 'custom', 
        from: startDate.toISOString(), 
        to: endDate.toISOString() 
      });
      setIsOpen(false);
    }
  };

  const getCustomLabel = () => {
    if (selectedRange === 'custom' && customFrom && customTo) {
      return `${format(new Date(customFrom), 'd MMM')} – ${format(new Date(customTo), 'd MMM yyyy')}`;
    }
    return 'Custom';
  };

  return (
    <div className="relative">
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabClick}>
        <Tab.List className="flex space-x-1 rounded-xl bg-black/20 p-1 border border-white/5">
          {RANGES.map((range) => (
            <Tab
              key={range.id}
              className={({ selected }) =>
                `w-full rounded-lg py-2 text-xs md:text-sm font-bold leading-5 transition-all outline-none md:px-4 px-2
                ${selected
                  ? 'bg-primary text-white shadow-[0_0_10px_rgba(0,174,230,0.3)]'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`
              }
            >
              {range.id === 'custom' ? getCustomLabel() : range.label}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>

      {/* Popover for Custom Date Picker */}
      <Popover className="relative z-50">
        <Popover.Button className="hidden" />
        
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-1 scale-95"
        >
          <Popover.Panel static className="absolute right-0 z-50 mt-2 w-72 bg-[#0B1121] border border-white/10 rounded-2xl shadow-2xl p-4 origin-top-right custom-datepicker-container">
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      // If start date is after end date, reset end date
                      if (endDate && date > endDate) {
                        setEndDate(null);
                      }
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()} // No future dates
                    minDate={subDays(new Date(), 366)} // max 366 days in the past
                    placeholderText="Select start date"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    dateFormat="dd MMM yyyy"
                    wrapperClassName="w-full"
                    popperPlacement="bottom-end"
                    popperClassName="custom-popper"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || subDays(new Date(), 366)} // Must be >= start date
                    maxDate={new Date()} // No future dates
                    disabled={!startDate} // Disabled until start date is chosen
                    placeholderText="Select end date"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    dateFormat="dd MMM yyyy"
                    wrapperClassName="w-full"
                    popperPlacement="bottom-end"
                    popperClassName="custom-popper"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors rounded-xl bg-black/20"
              >
                Cancel
              </button>
              <button 
                onClick={handleApplyCustom}
                disabled={!startDate || !endDate}
                className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-fixed-variant transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Apply
              </button>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
