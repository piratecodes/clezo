import { Fragment } from 'react';
import { Listbox, Transition, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomListbox({ value, onChange, options, placeholder = "Select Option", disabled = false, className = "", buttonClassName = "", useAnchor = true }) {
  // options should be an array of { label, value } or { label, value, group }
  const selectedOption = options.find(o => o.value === value) || null;

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative ${className}`}>
        <ListboxButton 
          className={`relative w-full cursor-pointer rounded-full bg-black/20 border border-white/10 py-2.5 pl-4 pr-10 text-left text-sm text-white shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 transition-all ${!selectedOption ? 'text-slate-400' : ''} ${buttonClassName}`}
        >
          <span className="block truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown size={16} className="text-slate-400" aria-hidden="true" />
          </span>
        </ListboxButton>
        
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions 
            anchor={useAnchor ? "bottom start" : undefined} 
            className={`z-[999] rounded-2xl bg-[#0f172a] border border-white/10 py-1 text-base shadow-2xl focus:outline-none sm:text-sm custom-scrollbar max-h-60 overflow-auto ${useAnchor ? '[--anchor-gap:4px] w-[var(--button-width)]' : 'absolute w-full mt-1'}`}
          >
            {options.map((option, optionIdx) => {
              if (option.isGroup) {
                return (
                  <div key={`group-${optionIdx}`} className="px-4 py-2 mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-black/20">
                    {option.label}
                  </div>
                );
              }
              return (
                <ListboxOption
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2.5 pl-4 pr-4 transition-colors ${
                      active ? 'bg-primary/20 text-white' : 'text-slate-300'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-bold text-white' : 'font-normal'} ${option.isGroupItem ? 'pl-2' : ''}`}>
                      {option.label}
                    </span>
                  )}
                </ListboxOption>
              );
            })}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
