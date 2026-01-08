import React from 'react';
import { Student } from '../types';
import { UserIcon, MapPinIcon, AcademicCapIcon, BriefcaseIcon, EnvelopeIcon } from './common/Icons';

interface CandidateProfileViewProps {
    student: Student;
}

const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({ student }) => {
    const imageSrc = student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;

    return (
        // Added max-h and flex-col to ensure the component fits within the modal limits
        <div className="flex flex-col h-full max-h-[70vh]"> 
            
            {/* 1. Header (Stays fixed at the top) */}
            <div className="flex-shrink-0 flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                <img 
                    src={imageSrc} 
                    alt={student.name} 
                    className="w-16 h-16 rounded-full border-2 border-gray-100 dark:border-gray-700 object-cover"
                />
                <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex child from overflowing */}
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-1 truncate">{student.name}</h1>
                    <p className="text-brand-600 font-medium text-xs mb-2">Aspiring Intern</p>
                    
                    <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md max-w-full truncate">
                            <EnvelopeIcon className="w-3 h-3 flex-shrink-0" /> 
                            <span className="truncate">{student.email}</span>
                        </span>
                        {student.locationPreference && (
                            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
                                <MapPinIcon className="w-3 h-3 flex-shrink-0" /> {student.locationPreference}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Scrollable Content Area (Prevents bottom cut-off) */}
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                
                {/* Bio */}
                <section className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-1">
                        <UserIcon className="w-3.5 h-3.5 text-brand-500" /> About
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
                        {student.careerGoals || "No bio provided."}
                    </p>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left: Skills & Industry */}
                    <div className="space-y-3">
                        <section>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Top Skills</h3>
                            <div className="flex flex-wrap gap-1">
                                {student.skills?.slice(0, 8).map(skill => (
                                    <span key={skill} className="px-1.5 py-0.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded text-[10px] font-semibold border border-brand-100 dark:border-brand-800">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                         <section>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Industry</h3>
                            <div className="flex flex-wrap gap-1">
                                {student.industryFocus?.slice(0, 4).map(ind => (
                                    <span key={ind} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-[10px] border border-gray-200 dark:border-gray-600">
                                        {ind}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Education & Prefs */}
                    <div className="space-y-3">
                         <section>
                            <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-1.5">
                                <AcademicCapIcon className="w-3.5 h-3.5 text-brand-500" /> Education
                            </h3>
                            <ul className="space-y-1">
                                {student.qualifications?.slice(0, 3).map((q, i) => (
                                    <li key={i} className="flex gap-1.5 text-[10px] text-gray-600 dark:text-gray-400">
                                        <span className="mt-1 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
                                        <span className="leading-tight">{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                         <section>
                             <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-1.5">
                                <BriefcaseIcon className="w-3.5 h-3.5 text-brand-500" /> Preferences
                            </h3>
                            <div className="space-y-1 bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-500">Duration</span>
                                    {/* Removed max-w-[60px] to fix text cutting */}
                                    <span className="font-medium text-gray-900 dark:text-white text-right">{student.preferredDuration || 'Any'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] pt-1 border-t border-gray-200 dark:border-gray-600">
                                    <span className="text-gray-500">Location</span>
                                    {/* Removed max-w-[60px] to fix text cutting */}
                                    <span className="font-medium text-gray-900 dark:text-white text-right">{student.locationPreference || 'Any'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] pt-1 border-t border-gray-200 dark:border-gray-600">
                                    <span className="text-gray-500">Size</span>
                                    <span className="font-medium text-gray-900 dark:text-white text-right">{student.preferredCompanySize || 'Any'}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfileView;