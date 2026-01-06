
import React, { useEffect } from 'react';
import { Notification } from '../types';
import { CheckCircleIcon, InformationCircleIcon, ExclamationTriangleIcon, XCircleIcon } from './common/Icons';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const ICONS = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
  warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" />,
};

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000); // Auto-dismiss after 8 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = ICONS[notification.type];

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl pointer-events-auto border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">AI Assistant</p>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-medium">{notification.message}</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
