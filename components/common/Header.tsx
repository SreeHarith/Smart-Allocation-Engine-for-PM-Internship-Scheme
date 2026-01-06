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
    <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-full mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dashboard</span>
              <span className="text-sm font-display font-bold text-gray-900 dark:text-white">Overview & Analytics</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={onBellClick}
                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-brand-600 shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all duration-200"
                aria-label="View notifications"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold ring-2 ring-white dark:ring-gray-800">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="h-8 w-px bg-gray-100 dark:bg-gray-700" />

            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{userName}</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wide capitalize">Verified Member</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                {userName.charAt(0)}
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;