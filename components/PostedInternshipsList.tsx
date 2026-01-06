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
        <div className="space-y-6">
            {internships.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {internships.map((internship) => (
                        <div key={internship.id} className="group bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-premium hover:shadow-premium-hover border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col lg:flex-row justify-between lg:items-center gap-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex-grow max-w-2xl">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="px-2.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">Active</span>
                                    <span className="text-xs text-gray-400 font-medium">Posted {new Date().toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">{internship.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{internship.description.substring(0, 120)}...</p>

                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                        <span className="text-gray-400">📍</span>
                                        <span>{internship.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                        <span className="text-gray-400">⏱️</span>
                                        <span>{internship.duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                        <span className="text-gray-400">💰</span>
                                        <span>{internship.stipend || 'Competitive'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500">
                                        <span className="text-emerald-400">👥</span>
                                        <span>{internship.seats} Positions</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 flex items-center space-x-3">
                                <Button
                                    onClick={() => onViewApplicants(internship)}
                                    className="!rounded-2xl px-6 py-3 shadow-brand-100 group-hover:scale-[1.02]"
                                >
                                    View Applicants
                                </Button>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(internship)}
                                        className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-brand-600 hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-500"
                                        title="Edit Posting"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onWithdraw(internship)}
                                        className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                        title="Withdraw"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 bg-white dark:bg-gray-800 rounded-[3rem] shadow-premium border border-gray-100 dark:border-gray-700 text-center">
                    <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-500 mb-6 font-display text-4xl">
                        📄
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">No Active Postings</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                        You haven't posted any internships yet. Start by creating your first opportunity.
                    </p>
                    <Button onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: 'post' }))} className="!rounded-2xl px-8">Post New Internship</Button>
                </div>
            )}
        </div>
    );
};

export default PostedInternshipsList;
