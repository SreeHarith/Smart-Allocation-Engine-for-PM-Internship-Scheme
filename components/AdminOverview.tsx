import React from 'react';
import Card from './common/Card';
import {
    UsersIcon,
    BuildingLibraryIcon,
    BriefcaseIcon,
    GraduationCapIcon,
    CheckCircleIcon,
    BellIcon
} from './common/Icons';

const StatsCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    trend: string;
    trendColor: string;
}> = ({ icon, title, value, trend, trendColor }) => (
    <Card className="flex items-center p-4 transition-transform hover:scale-105 duration-200">
        <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center bg-brand-50 dark:bg-brand-900/40 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
            <p className={`text-xs font-semibold ${trendColor}`}>{trend}</p>
        </div>
    </Card>
);

const ActivityItem: React.FC<{
    text: string;
    time: string;
    type: 'company' | 'student' | 'system';
}> = ({ text, time, type }) => {
    let dotColor = 'bg-blue-500';
    if (type === 'company') dotColor = 'bg-purple-500';
    if (type === 'system') dotColor = 'bg-gray-500';

    return (
        <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
            <span className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${dotColor} mt-2 mr-3`} />
            <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
                <span className="text-xs text-gray-400">{time}</span>
            </div>
        </div>
    );
}

const AdminOverview: React.FC = () => {
    const [stats, setStats] = React.useState({
        totalStudents: 0,
        totalCompanies: 0,
        activeInternships: 0,
        placements: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                // Determine if we need to authenticate (mock for now or assume header injected)
                // In real app, standard axios interceptor handles token. 
                // For now, assume public or cookie-based, or just fetch.
                const { adminService } = await import('../services/adminService');
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={<UsersIcon className="h-8 w-8 text-brand-600" />}
                    title="Total Students"
                    value={stats.totalStudents.toLocaleString()}
                    trend="+12% this month"
                    trendColor="text-green-600"
                />
                <StatsCard
                    icon={<BuildingLibraryIcon className="h-8 w-8 text-purple-600" />}
                    title="Partner Companies"
                    value={stats.totalCompanies.toLocaleString()}
                    trend="+3 new this week"
                    trendColor="text-green-600"
                />
                <StatsCard
                    icon={<BriefcaseIcon className="h-8 w-8 text-blue-600" />}
                    title="Active Internships"
                    value={stats.activeInternships.toLocaleString()}
                    trend="85 positions open"
                    trendColor="text-blue-600"
                />
                <StatsCard
                    icon={<GraduationCapIcon className="h-8 w-8 text-emerald-600" />}
                    title="Placements"
                    value={stats.placements.toLocaleString()}
                    trend="Est. success rate"
                    trendColor="text-emerald-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Feed */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                            <BellIcon className="h-5 w-5 mr-2 text-brand-500" />
                            Recent Platform Activity
                        </h2>
                        <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</button>
                    </div>
                    <div className="space-y-4">
                        <ActivityItem
                            text="TechCorp Solutions posted a new internship: 'Junior React Developer'"
                            time="2 minutes ago"
                            type="company"
                        />
                        <ActivityItem
                            text="Student Priya Sharma verified her documents"
                            time="15 minutes ago"
                            type="student"
                        />
                        <ActivityItem
                            text="InnovateAI Labs registered as a new company partner"
                            time="1 hour ago"
                            type="company"
                        />
                        <ActivityItem
                            text="Rahul Verma applied to 'Product Management Intern' at FintechFlow"
                            time="2 hours ago"
                            type="student"
                        />
                        <ActivityItem
                            text="System Health Check: All services operational"
                            time="4 hours ago"
                            type="system"
                        />
                    </div>
                </Card>

                {/* Quick Quick Actions or Mini Chart (Placeholder for now) */}
                <Card className="bg-gradient-to-br from-brand-600 to-purple-700 text-white">
                    <h2 className="text-xl font-bold mb-2">Admin Actions</h2>
                    <p className="text-brand-100 mb-6 text-sm">Quickly manage platform settings and approvals.</p>

                    <div className="space-y-3">
                        <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-left text-sm font-medium transition-colors flex items-center">
                            <CheckCircleIcon className="h-5 w-5 mr-3" />
                            Review Pending Approvals (3)
                        </button>
                        <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-left text-sm font-medium transition-colors flex items-center">
                            <BuildingLibraryIcon className="h-5 w-5 mr-3" />
                            Verify Values & Stipends
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;
