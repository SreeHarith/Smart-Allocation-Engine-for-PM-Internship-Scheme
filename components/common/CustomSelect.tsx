import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './Icons';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  label?: string; // Optional label if we want to render it inside
  options: (string | number | Option)[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to a standard format
  const normalizedOptions: Option[] = options.map(opt => {
    if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
      return opt as Option;
    }
    return { label: String(opt), value: opt };
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // 250px is roughly the max-height (240px/60rem) + padding being used
        if (spaceBelow < 250) {
            setDropdownPosition('top');
        } else {
            setDropdownPosition('bottom');
        }
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full text-left cursor-default rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 py-3 pl-3 pr-10 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
        }`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-100 dark:border-gray-700 max-h-60 ${
            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'mt-1'
        }`}>
          {normalizedOptions.length === 0 ? (
             <div className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500 dark:text-gray-400 italic">No options</div>
          ) : (
              normalizedOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative cursor-default select-none py-2 pl-3 pr-9 transition-colors ${
                    option.value === value
                      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-900 dark:text-brand-100 font-medium'
                      : 'text-gray-900 dark:text-white hover:bg-brand-50 dark:hover:bg-brand-900/10 hover:text-brand-900 dark:hover:text-brand-100'
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className={`block truncate ${option.value === value ? 'font-medium' : 'font-normal'}`}>
                    {option.label}
                  </span>
                  {option.value === value ? (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : null}
                </div>
              ))
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomSelect;
