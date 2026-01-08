import React from 'react';
import { Student } from '../types';
import { MapPinIcon, AcademicCapIcon, BriefcaseIcon, EnvelopeIcon, UserIcon } from './common/Icons';

interface CandidateProfileViewProps {
    student: Student;
}

const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({ student }) => {
    // Generate avatar helper
    const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
    const imageSrc = student.profileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${student.name}`;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl w-full">

            {/* 1. Profile Content */}
            <div className="flex-grow">

                {/* Header Banner */}
                <div className="h-24 bg-gradient-to-r from-brand-500 to-purple-600 w-full relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                <div className="px-6 pb-6 relative">
                    {/* Floating Avatar */}
                    <div className="flex justify-between items-end -mt-10 mb-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg bg-white">
                                <img
                                    src={imageSrc}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${student.name}`;
                                    }}
                                />
                            </div>
                        </div>
                        {/* Contact Actions could go here */}
                    </div>

                    {/* Basic Info */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{student.name}</h1>
                        <p className="text-brand-600 dark:text-brand-400 font-medium text-sm mb-3">Aspiring Intern</p>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span>{student.email}</span>
                            </div>
                            {student.locationPreference && (
                                <div className="flex items-center gap-1.5">
                                    <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{student.locationPreference}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <section className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-brand-500" /> About
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {student.careerGoals || "This candidate has not added a bio yet."}
                        </p>
                    </section>

                    <hr className="border-gray-100 dark:border-gray-700 my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Top Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {student.skills?.slice(0, 10).map(skill => (
                                        <span key={skill} className="px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium border border-brand-100 dark:border-brand-800">
                                            {skill}
                                        </span>
                                    ))}
                                    {!student.skills?.length && <span className="text-gray-400 text-sm">No skills listed.</span>}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Industry Focus</h3>
                                <div className="flex flex-wrap gap-2">
                                    {student.industryFocus?.slice(0, 5).map(ind => (
                                        <span key={ind} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
                                            {ind}
                                        </span>
                                    ))}
                                    {!student.industryFocus?.length && <span className="text-gray-400 text-sm">No industries listed.</span>}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <AcademicCapIcon className="w-4 h-4 text-brand-500" /> Education
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3">
                                    {student.qualifications?.length > 0 ? (
                                        student.qualifications.map((q, i) => (
                                            <div key={i} className="flex gap-3 text-sm">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0"></div>
                                                <span className="text-gray-700 dark:text-gray-300">{q}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm">No education listed.</span>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <BriefcaseIcon className="w-4 h-4 text-brand-500" /> Preferences
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                        <span className="text-xs text-gray-500 block mb-1">Duration</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{student.preferredDuration || "Any"}</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                        <span className="text-xs text-gray-500 block mb-1">Company Size</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{student.preferredCompanySize || "Any"}</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg col-span-2">
                                        <span className="text-xs text-gray-500 block mb-1">Location</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{student.locationPreference || "Any"}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer or Actions could go here */}
        </div>
    );
};

export default CandidateProfileView;
