import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import {
    UserIcon,
    BuildingLibraryIcon,
    TrashIcon,
    PencilIcon
} from './common/Icons';

interface TableUser {
    id: number;
    name: string;
    email: string;
    role: 'Student' | 'Company';
    status: string;
    joined: string;
    description: string;
}

const UserManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'students' | 'companies'>('students');
    const [students, setStudents] = useState<TableUser[]>([]);
    const [companies, setCompanies] = useState<TableUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { adminService } = await import('../services/adminService');
                const data = await adminService.getUsers();

                const mappedStudents: TableUser[] = data.students.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    email: s.email || 'N/A',
                    role: 'Student',
                    status: 'Active', // Default for now
                    joined: '2025-01-01', // Placeholder as DB doesn't track creation time yet
                    description: `${s.collegeTier || 'Tier-?'} • ${s.skills?.[0] || 'Student'}`
                }));

                const mappedCompanies: TableUser[] = data.companies.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    email: c.email || 'N/A',
                    role: 'Company',
                    status: 'Active',
                    joined: '2025-01-01',
                    description: c.description || c.sector || 'Partner Company'
                }));

                setStudents(mappedStudents);
                setCompanies(mappedCompanies);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const data = activeTab === 'students' ? students : companies;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'students'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-300'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Students ({students.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('companies')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'companies'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-300'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Companies ({companies.length})
                    </button>
                </div>

                <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                    + Add New {activeTab === 'students' ? 'Student' : 'Company'}
                </button>
            </div>

            {/* Table Card */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Identity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No {activeTab} found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
                                                    {activeTab === 'students' ? <UserIcon className="h-5 w-5" /> : <BuildingLibraryIcon className="h-5 w-5" />}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{user.description}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {user.joined}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
