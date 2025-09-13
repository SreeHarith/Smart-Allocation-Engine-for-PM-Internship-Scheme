import React, { useMemo } from 'react';
import { PLACED_STUDENTS } from '../constants';
import Card from './common/Card';
import { UserIcon, GlobeAmericasIcon, BuildingLibraryIcon } from './common/Icons';

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
}> = ({ icon, title, value, description }) => (
    <Card className="flex items-start space-x-4 p-4">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-brand-100 dark:bg-brand-900/50 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>
        </div>
    </Card>
);

const TierBar: React.FC<{ tier: string, count: number, total: number, color: string }> = ({ tier, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tier}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{count} Students ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const DiversityDashboard: React.FC = () => {
    const stats = useMemo(() => {
        const total = PLACED_STUDENTS.length;
        if (total === 0) {
            return {
                femalePercentage: 0,
                ruralPercentage: 0,
                tierCounts: { 'Tier-1': 0, 'Tier-2': 0, 'Tier-3': 0 },
                total,
            };
        }

        const femaleCount = PLACED_STUDENTS.filter(s => s.gender === 'Female').length;
        const ruralCount = PLACED_STUDENTS.filter(s => s.background === 'Rural').length;
        
        const tierCounts = PLACED_STUDENTS.reduce((acc, student) => {
            acc[student.collegeTier] = (acc[student.collegeTier] || 0) + 1;
            return acc;
        }, {} as Record<'Tier-1' | 'Tier-2' | 'Tier-3', number>);

        return {
            femalePercentage: (femaleCount / total) * 100,
            ruralPercentage: (ruralCount / total) * 100,
            tierCounts: {
                'Tier-1': tierCounts['Tier-1'] || 0,
                'Tier-2': tierCounts['Tier-2'] || 0,
                'Tier-3': tierCounts['Tier-3'] || 0,
            },
            total,
        };
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Diversity & Inclusion Dashboard</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    An overview of placed students to ensure fair allocation.
                </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    icon={<UserIcon className="h-6 w-6 text-brand-700 dark:text-brand-300" />}
                    title="Women Placed"
                    value={`${stats.femalePercentage.toFixed(1)}%`}
                    description={`Out of ${stats.total} total placements`}
                />
                <StatCard 
                    icon={<GlobeAmericasIcon className="h-6 w-6 text-brand-700 dark:text-brand-300" />}
                    title="Rural Students Placed"
                    value={`${stats.ruralPercentage.toFixed(1)}%`}
                    description="Promoting opportunities beyond urban centers"
                />
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Placement by College Tier</h3>
                <div className="space-y-4">
                    <TierBar tier="Tier-1" count={stats.tierCounts['Tier-1']} total={stats.total} color="bg-blue-500" />
                    <TierBar tier="Tier-2" count={stats.tierCounts['Tier-2']} total={stats.total} color="bg-indigo-500" />
                    <TierBar tier="Tier-3" count={stats.tierCounts['Tier-3']} total={stats.total} color="bg-purple-500" />
                </div>
            </Card>
        </div>
    );
};

export default DiversityDashboard;
