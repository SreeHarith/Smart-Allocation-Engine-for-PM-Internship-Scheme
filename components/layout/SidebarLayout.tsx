import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import { User, Notification } from '../../types';
import NotificationPanel from '../NotificationPanel';

interface SidebarLayoutProps {
    user: User;
    onLogout: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'userType' | 'read'>) => void;
    notifications: Notification[];
    markAllAsRead: () => void;
    clearNotifications: () => void;
    onUpdateUser: (user: User) => void;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
    user,
    onLogout,
    notifications,
    markAllAsRead,
    clearNotifications,
}) => {
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    const handleBellClick = () => {
        setIsNotificationPanelOpen(prev => !prev);
        if (!isNotificationPanelOpen) {
            markAllAsRead();
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <Sidebar
                userRole={user.role}
                isCollapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out`}>
                <Header
                    userName={user.name}
                    onLogout={onLogout}
                    notifications={notifications}
                    onBellClick={handleBellClick}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 relative">
                    <Outlet />
                    {isNotificationPanelOpen && (
                        <NotificationPanel
                            notifications={notifications}
                            onClose={() => setIsNotificationPanelOpen(false)}
                            onClearAll={clearNotifications}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default SidebarLayout;