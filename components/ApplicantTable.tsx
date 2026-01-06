import React, { useMemo } from 'react';
import Card from './common/Card';
import { Internship, Student } from '../types';
import { getTopApplicants } from '../services/matchingService';

interface ApplicantTableProps {
    internship: Internship;
}

const ApplicantTable: React.FC<ApplicantTableProps> = ({ internship }) => {
    const topApplicants = useMemo(() => getTopApplicants(internship, 10), [internship]);

    return (
        <Card>
            <h2 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">AI-Powered Shortlist</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Top 10 recommended candidates for "{internship.title}"</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AI Match %</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">College Tier</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Key Skills</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {topApplicants.map(({ student, score }) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444' }}>{score}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.collegeTier === 'Tier-1' ? 'bg-blue-100 text-blue-800' :
                                            student.collegeTier === 'Tier-2' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                        {student.collegeTier}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {student.skills.slice(0, 3).join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-200">View Full Profile</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ApplicantTable;