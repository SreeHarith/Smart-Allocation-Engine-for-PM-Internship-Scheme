import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Internship, Student } from '../types';
import Card from './common/Card';
import Button from './common/Button';

import { MapPinIcon as CustomMapPin, WalletIcon, BriefcaseIcon } from './common/Icons';

interface AppliedInternshipsProps {
    student: Student;
    addNotification: (notification: any) => void;
}

const AppliedInternships: React.FC<AppliedInternshipsProps> = ({ student, addNotification }) => {
    const [applications, setApplications] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawLoading, setWithdrawLoading] = useState<number | null>(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await api.getAppliedInternships(student.id);
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
            addNotification({ message: "Failed to load applications", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [student.id]);

    const handleWithdraw = async (internshipId: number, title: string) => {
        if (!window.confirm(`Are you sure you want to withdraw your application for ${title}?`)) return;

        try {
            setWithdrawLoading(internshipId);
            await api.withdrawFromInternship(internshipId, student.id);
            addNotification({ message: `Successfully withdrawn from ${title}`, type: "success" });
            // Remove from local state immediately
            setApplications(prev => prev.filter(app => app.id !== internshipId));
        } catch (error) {
            console.error("Failed to withdraw:", error);
            addNotification({ message: "Failed to withdraw application", type: "error" });
        } finally {
            setWithdrawLoading(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading your applications...</div>;
    }

    if (applications.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Applications</h1>
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 dark:bg-gray-700 mb-4">
                        <BriefcaseIcon className="w-8 h-8 text-brand-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't applied to any internships yet. Check your dashboard for AI-recommended opportunities.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Applications</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((internship) => (
                    <Card key={internship.id} className="flex flex-col h-full border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="mb-4">
                            <span className="inline-block px-2 py-1 text-[10px] font-semibold tracking-wide text-brand-600 uppercase bg-brand-50 dark:bg-brand-900/20 rounded-md mb-2">
                                {internship.sector}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={internship.title}>
                                {internship.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{internship.company}</p>
                        </div>

                        <div className="space-y-2 mb-6 flex-grow">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <CustomMapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                <span className="truncate">{internship.location}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <WalletIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                <span>{internship.stipend || 'Unpaid'}</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    Applied
                                </span>
                                <span className="text-xs text-gray-400">
                                    {/* Ideally we'd have application date, but not stored currently */}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
                                onClick={() => handleWithdraw(internship.id, internship.title)}
                                disabled={withdrawLoading === internship.id}
                            >
                                {withdrawLoading === internship.id ? 'Withdrawing...' : 'Withdraw Application'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AppliedInternships;
