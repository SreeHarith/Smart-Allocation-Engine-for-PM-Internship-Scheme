

import React from 'react';
import { 
    ChartPieIcon, BriefcaseIcon, GraduationCapIcon, UserGroupIcon, 
    AcademicCapIcon, BeakerIcon, LightBulbIcon, DocumentPlusIcon, UsersIcon, VideoCameraIcon 
} from './Icons';

interface SidebarProps {
    userRole: 'STUDENT' | 'COMPANY' | 'ADMIN';
    activeView: string;
    setActiveView: (view: string) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
    <li>
        <a 
            href="#"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`flex items-center p-3 text-base font-normal rounded-lg transition-colors duration-200 ${
                isActive 
                ? 'bg-brand-700 text-white' 
                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            <Icon className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
            <span className="ml-3">{label}</span>
        </a>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView }) => {
    
    const studentNav = [
        { name: 'Dashboard', view: 'dashboard', icon: ChartPieIcon },
        { name: 'My Profile', view: 'profile', icon: UserGroupIcon },
        { name: 'Upskilling Hub', view: 'upskilling', icon: AcademicCapIcon },
        { name: 'AI Mentor', view: 'mentor', icon: LightBulbIcon },
        { name: 'Simulator', view: 'simulator', icon: BeakerIcon },
        { name: 'AI Mock Interview', view: 'interview', icon: VideoCameraIcon },
        { name: 'My Certificates', view: 'certificates', icon: GraduationCapIcon },
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

    return (
        <aside className="w-64" aria-label="Sidebar">
            <div className="overflow-y-auto py-4 px-3 bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700">
                <div className="flex items-center pl-2.5 mb-5">
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{userRole.charAt(0) + userRole.slice(1).toLowerCase()} Portal</span>
                </div>
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <NavItem 
                            key={item.view}
                            label={item.name}
                            icon={item.icon}
                            isActive={activeView === item.view}
                            onClick={() => setActiveView(item.view)}
                        />
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;