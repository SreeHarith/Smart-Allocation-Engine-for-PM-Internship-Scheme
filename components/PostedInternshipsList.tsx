// FIX: Created this component to display a list of posted internships.
import React from 'react';
import Card from './common/Card';
import { Internship } from '../types';
import Button from './common/Button';
import { PencilIcon, TrashIcon } from './common/Icons';

interface PostedInternshipsListProps {
    internships: Internship[];
    onViewApplicants: (internship: Internship) => void;
    onEdit: (internship: Internship) => void;
    onWithdraw: (internship: Internship) => void;
}

const PostedInternshipsList: React.FC<PostedInternshipsListProps> = ({ internships, onViewApplicants, onEdit, onWithdraw }) => {
  return (
    <Card>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Posted Internships</h2>
        {internships.length > 0 ? (
            <div className="space-y-4">
            {internships.map((internship) => (
                <div key={internship.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-grow">
                        <h3 className="font-semibold text-brand-700 dark:text-brand-400">{internship.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{internship.description.substring(0, 100)}...</p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                            <span><strong>Location:</strong> {internship.location}</span>
                            <span><strong>Duration:</strong> {internship.duration}</span>
                            {internship.stipend && <span><strong>Stipend:</strong> {internship.stipend}</span>}
                            <span><strong>Seats:</strong> {internship.seats}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <Button onClick={() => onViewApplicants(internship)} size="sm" className="w-full sm:w-auto">View Top Applicants</Button>
                        <div className="flex gap-2">
                             <Button onClick={() => onEdit(internship)} size="sm" variant="light" className="flex-1 !px-3">
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                             <Button onClick={() => onWithdraw(internship)} size="sm" variant="light" className="flex-1 !px-3 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400">
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">You have not posted any internships yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Click on "Post Internship" in the sidebar to get started.</p>
            </div>
        )}
    </Card>
  );
};

export default PostedInternshipsList;
