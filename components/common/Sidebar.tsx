

import React from 'react';
import {
    ChartPieIcon, BriefcaseIcon, GraduationCapIcon, UserGroupIcon,
    AcademicCapIcon, BeakerIcon, LightBulbIcon, DocumentPlusIcon, UsersIcon, VideoCameraIcon
} from './Icons';

interface SidebarProps {
    userRole: 'STUDENT' | 'COMPANY' | 'ADMIN';
    activeView: string;
    setActiveView: (view: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
    onClick: () => void;
    isCollapsed: boolean;
}> = ({ label, icon: Icon, isActive, onClick, isCollapsed }) => (
    <li className="relative z-10">
        <button
            onClick={(e) => { e.preventDefault(); onClick(); }}
            title={isCollapsed ? label : ''}
            className={`w-full group flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium rounded-2xl transition-all duration-300 ${isActive
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-white'
                }`}
        >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-600 dark:group-hover:text-white'}`} />
            </div>
            {!isCollapsed && <span className="ml-3 capitalize whitespace-nowrap">{label}</span>}
            {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            )}
        </button>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView, isCollapsed, onToggle }) => {

    const studentNav = [
        { name: 'Dashboard', view: 'dashboard', icon: ChartPieIcon },
        { name: 'My Profile', view: 'profile', icon: UserGroupIcon },
        { name: 'Upskilling Hub', view: 'upskilling', icon: AcademicCapIcon },
        { name: 'AI Mentor', view: 'mentor', icon: LightBulbIcon },
        { name: 'Simulator', view: 'simulator', icon: BeakerIcon },
        { name: 'Mock Interview', view: 'interview', icon: VideoCameraIcon },
        { name: 'Certificates', view: 'certificates', icon: GraduationCapIcon },
    ];

    const companyNav = [
        { name: 'Dashboard', view: 'dashboard', icon: ChartPieIcon },
        { name: 'Post Internship', view: 'post', icon: DocumentPlusIcon },
    ];

    const adminNav = [
        { name: 'Dashboard', view: 'dashboard', icon: ChartPieIcon },
        { name: 'Manage Users', view: 'users', icon: UsersIcon },
        { name: 'Analytics', view: 'analytics', icon: ChartPieIcon },
    ];

    let navItems = [];
    switch (userRole) {
        case 'STUDENT':
            navItems = studentNav;
            break;
        case 'COMPANY':
            navItems = companyNav;
            break;
        case 'ADMIN':
            navItems = adminNav;
            break;
    }

    const activeIndex = navItems.findIndex(item => item.view === activeView);

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gray-50 dark:bg-gray-900 overflow-y-auto border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out`} aria-label="Sidebar">
            <div className={`flex flex-col h-full ${isCollapsed ? 'px-2' : 'px-4'} py-8`}>
                <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col space-y-4' : 'px-4'} mb-10`}>
                    <div className="flex items-center space-x-3">
                        <div className="bg-brand-600 p-2 rounded-xl shadow-lg shadow-brand-100 flex-shrink-0">
                            <GraduationCapIcon className="h-6 w-6 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-lg font-display font-extrabold text-gray-900 dark:text-white tracking-tight italic">Intern <span className="text-brand-600">AI</span></span>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Smart Gateway</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onToggle}
                        className={`p-2 rounded-xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isCollapsed ? '' : ''}`}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        )}
                    </button>
                </div>

                <div className="flex-1 relative">
                    {!isCollapsed && (
                        <div className="px-4 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Main Menu</span>
                        </div>
                    )}

                    <div className="relative">
                        {/* Sliding Background Indicator */}
                        {activeIndex !== -1 && (
                            <div
                                className="absolute left-0 w-full bg-brand-600 rounded-2xl shadow-lg shadow-brand-100 dark:shadow-none transition-all duration-300 ease-out z-0"
                                style={{
                                    height: '44px',
                                    top: `${activeIndex * (44 + 8)}px`,
                                }}
                            />
                        )}

                        <ul className="space-y-2 relative z-10">
                            {navItems.map((item) => (
                                <NavItem
                                    key={item.view}
                                    label={item.name}
                                    icon={item.icon}
                                    isActive={activeView === item.view}
                                    onClick={() => setActiveView(item.view)}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={`mt-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
                    <div className={`bg-white dark:bg-gray-800 ${isCollapsed ? 'p-2' : 'p-4'} rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700`}>
                        {isCollapsed ? (
                            <div className="h-2 w-2 mx-auto rounded-full bg-green-500 animate-pulse" />
                        ) : (
                            <>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">System Online</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed">
                                    PM Internship Scheme AI Allocator v2.0
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;