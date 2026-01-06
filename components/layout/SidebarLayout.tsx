import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import { User, Notification, Student } from '../../types';
import StudentDashboard from '../StudentDashboard';
import CompanyDashboard from '../CompanyDashboard';
import AdminDashboard from '../AdminDashboard';
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
    addNotification,
    notifications,
    markAllAsRead,
    clearNotifications,
    onUpdateUser
}) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    const handleBellClick = () => {
        setIsNotificationPanelOpen(prev => !prev);
        if (!isNotificationPanelOpen) {
            markAllAsRead();
        }
    };

    const renderDashboard = () => {
        switch (user.role) {
            case 'STUDENT':
                return (
                    <StudentDashboard
                        student={user as Student}
                        addNotification={addNotification}
                        activeView={activeView}
                        onUpdateStudent={(updatedStudent) => onUpdateUser(updatedStudent)}
                    />
                );
            case 'COMPANY':
                return <CompanyDashboard company={user} activeView={activeView} />;
            case 'ADMIN':
                return <AdminDashboard admin={user} activeView={activeView} />;
            default:
                return <div>Invalid user role</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <Sidebar
                userRole={user.role}
                activeView={activeView}
                setActiveView={setActiveView}
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
                    {renderDashboard()}
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