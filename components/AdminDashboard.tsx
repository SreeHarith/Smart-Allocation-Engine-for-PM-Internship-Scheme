import React from 'react';
import Card from './common/Card';
import { Admin } from '../types';
import DiversityDashboard from './DiversityDashboard';

interface AdminDashboardProps {
    admin: Admin;
    activeView: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, activeView }) => {
    
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Card>
            <h2 className="text-xl font-bold mb-2">Platform Overview</h2>
            <p>Welcome, {admin.name}. Here you can find a summary of platform activity.</p>
          </Card>
        );
      case 'users':
        return (
          <Card>
            <h2 className="text-xl font-bold mb-2">Manage Users</h2>
            <p>A table for managing students and companies would be displayed here.</p>
          </Card>
        );
      case 'analytics':
        return <DiversityDashboard />;
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };
    
  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Portal</h1>
        {renderContent()}
    </div>
  );
};

export default AdminDashboard;