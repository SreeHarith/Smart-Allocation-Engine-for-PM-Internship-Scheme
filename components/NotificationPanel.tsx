import React from 'react';
import { Notification } from '../types';
import { InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from './common/Icons';
import Button from './common/Button';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onClearAll: () => void;
}

const ICONS = {
  success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
  info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
  warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
  error: <XCircleIcon className="h-5 w-5 text-red-500" />,
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onClearAll }) => {
  return (
    <div 
        className="absolute top-16 right-0 w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50 animate-fade-in-up"
        style={{ animationDuration: '0.2s' }}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
        {notifications.length > 0 && (
            <Button onClick={onClearAll} size="sm" variant="light">
                Clear All
            </Button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-gray-500 dark:text-gray-400">You have no notifications.</p>
          </div>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.id} className="p-3 border-b border-gray-100 dark:border-gray-700/50 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex-shrink-0 mt-0.5">{ICONS[n.type]}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
