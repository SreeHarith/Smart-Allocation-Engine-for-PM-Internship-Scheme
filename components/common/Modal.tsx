import React, { Fragment, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      'full': 'max-w-full'
  }[size] || 'max-w-md';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
                className="fixed inset-0 bg-black/40 transition-opacity backdrop-blur-sm" 
                aria-hidden="true"
                onClick={onClose}
            ></div>

            {/* Centering trick */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
                className={`relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${maxWidthClass} flex flex-col max-h-[85vh]`} 
                role="document"
            >
                {/* Close Button (Fixed at top-right) */}
                <div className="absolute top-4 right-4 z-10">
                    <button type="button" onClick={onClose} className="bg-white dark:bg-gray-700 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none transition-colors border border-gray-200 dark:border-gray-600">
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5 text-gray-500 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Area - Now Scrollable */}
                <div className="px-6 pt-6 pb-6 flex flex-col h-full overflow-hidden">
                    {title && (
                        <div className="flex-shrink-0 mb-4 pr-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white" id="modal-title">{title}</h3>
                        </div>
                    )}
                    
                    {/* Only this part scrolls now */}
                    <div className="flex-grow overflow-y-auto pr-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Modal;