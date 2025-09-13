import React from 'react';
import { GovIcon, BellIcon } from './Icons';
import Button from './Button';
import { Notification } from '../../types';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
  notifications: Notification[];
  onBellClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout, notifications, onBellClick }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <GovIcon className="h-8 w-8 text-brand-700" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">PM AI Internship</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">Welcome, {userName}</span>
            <div className="relative">
              <button 
                onClick={onBellClick} 
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="View notifications"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <Button onClick={onLogout} size="sm" variant="light">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;