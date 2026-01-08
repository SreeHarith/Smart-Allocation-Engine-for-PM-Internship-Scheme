import React from 'react';
import Card from './common/Card';
import { Admin } from '../types';
import DiversityDashboard from './DiversityDashboard';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';

interface AdminDashboardProps {
  admin: Admin;
  activeView: string;
}

const SkillsDemandChart: React.FC = () => {
  const [skills, setSkills] = React.useState<{ name: string, demand: number, supply: number }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { adminService } = await import('../services/adminService');
        const data = await adminService.getAnalytics();
        setSkills(data.skillsChart);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Card className="mt-6"><div className="p-4 text-center text-gray-500">Loading analytics...</div></Card>;
  }

  if (skills.length === 0) {
    return (
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Skills Demand vs Supply Gap</h3>
        <p className="text-sm text-gray-500">Not enough data to generate insights yet.</p>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Skills Demand vs Supply Gap</h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              {/* Demand Bar */}
              <div
                className="absolute top-0 left-0 h-4 bg-brand-500 rounded-l-full z-20 text-[10px] text-white flex items-center justify-center transition-all duration-500"
                style={{ width: `${Math.min(skill.demand, 100)}%` }}
              >
                Demand
              </div>
              {/* Supply Bar */}
              <div
                className="absolute top-0 left-0 h-4 bg-purple-400/50 rounded-l-full z-10 transition-all duration-500"
                style={{ width: `${Math.min(skill.supply, 100)}%` }}
              >
              </div>
              <span className="absolute right-2 top-0 text-[10px] text-gray-500 leading-4">Supply: {Math.round(skill.supply / 5)}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-4 text-xs">
        <div className="flex items-center"><span className="w-3 h-3 bg-brand-500 rounded-full mr-2"></span> Industry Demand</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-purple-400/50 rounded-full mr-2"></span> Student Supply</div>
      </div>
    </Card>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, activeView }) => {

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Platform Overview</h2>
              <p className="text-gray-500">Welcome back, {admin.name}. Here's what's happening today.</p>
            </div>
            <AdminOverview />
          </>
        );
      case 'users':
        return (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage Users</h2>
              <p className="text-gray-500">View and manage student and company accounts.</p>
            </div>
            <UserManagement />
          </>
        );
      case 'analytics':
        return (
          <div className="animate-fadeIn space-y-6">
            <DiversityDashboard />
            <SkillsDemandChart />
          </div>
        );
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;