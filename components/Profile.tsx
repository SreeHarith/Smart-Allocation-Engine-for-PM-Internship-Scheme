import React, { useState } from 'react';
import { Student } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { PencilIcon } from './common/Icons';

interface ProfileProps {
    student: Student;
    onUpdateStudent: (student: Student) => void;
}

const Profile: React.FC<ProfileProps> = ({ student, onUpdateStudent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(student);

    const handleEditToggle = () => {
        if (!isEditing) {
            setFormData(student);
        }
        setIsEditing(!isEditing);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateStudent(formData);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'skills' | 'industryFocus') => {
        const valueArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [field]: valueArray }));
    };

    const ProfileDetail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
            <div className="mt-1 text-md text-gray-800 dark:text-white">{value}</div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-premium p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/50 dark:bg-brand-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-brand-400 to-accent-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300" />
                        <img
                            className="relative h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl"
                            src={student.profileImage}
                            alt={student.name}
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active Candidate</span>
                        </div>
                        <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white mb-2">{student.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{student.email}</p>
                    </div>

                    <div className="flex-shrink-0">
                        <Button onClick={handleEditToggle} variant={isEditing ? 'light' : 'primary'} className="!rounded-2xl px-8 shadow-brand-100">
                            {isEditing ? 'Discard Changes' : <><PencilIcon className="h-4 w-4 mr-2" /><span>Edit Profile</span></>}
                        </Button>
                    </div>
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-premium p-10 border border-gray-100 dark:border-gray-700 space-y-8">
                    <div>
                        <label htmlFor="careerGoals" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Professional Bio & Career Goals</label>
                        <textarea
                            id="careerGoals"
                            name="careerGoals"
                            value={formData.careerGoals}
                            onChange={handleChange}
                            rows={4}
                            className="block w-full rounded-2xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 transition-all p-4 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <label htmlFor="locationPreference" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Preferred Location</label>
                            <input type="text" id="locationPreference" name="locationPreference" value={formData.locationPreference} onChange={handleChange} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm" />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="preferredCompanySize" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Target Organization Type</label>
                            <select id="preferredCompanySize" name="preferredCompanySize" value={formData.preferredCompanySize} onChange={handleChange} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm">
                                <option>Any</option>
                                <option>Startup</option>
                                <option>Mid-size</option>
                                <option>MNC</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="preferredDuration" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Internship Duration</label>
                            <select id="preferredDuration" name="preferredDuration" value={formData.preferredDuration} onChange={handleChange} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm">
                                <option>Any</option>
                                <option>3 Months</option>
                                <option>6 Months</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label htmlFor="skills" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Skills (separate with commas)</label>
                            <input type="text" id="skills" name="skills" value={formData.skills.join(', ')} onChange={(e) => handleArrayChange(e, 'skills')} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm" />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="industryFocus" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Industry Focus Areas</label>
                            <input type="text" id="industryFocus" name="industryFocus" value={formData.industryFocus.join(', ')} onChange={(e) => handleArrayChange(e, 'industryFocus')} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm" />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 dark:border-gray-700/50 flex justify-end space-x-4">
                        <Button type="button" onClick={() => setIsEditing(false)} variant="light" className="!rounded-2xl px-8">Cancel</Button>
                        <Button type="submit" className="!rounded-2xl px-8 shadow-brand-200">Save Profile</Button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-premium p-10 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg font-light italic">"{student.careerGoals}"</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-premium p-10 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">Expertise & Skills</h2>
                            <div className="flex flex-wrap gap-3">
                                {student.skills.map(skill => (
                                    <span key={skill} className="px-5 py-2 text-xs font-bold bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-100/50 dark:border-brand-900/50">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-premium p-8 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
                            <div className="space-y-6">
                                {[
                                    { label: 'Location', value: student.locationPreference, icon: '📍' },
                                    { label: 'Org Size', value: student.preferredCompanySize, icon: '🏢' },
                                    { label: 'Duration', value: student.preferredDuration, icon: '⏱️' }
                                ].map(pref => (
                                    <div key={pref.label} className="flex items-center space-x-4">
                                        <div className="h-10 w-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-xl shadow-sm border border-gray-100 dark:border-gray-700"> {pref.icon} </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pref.label}</div>
                                            <div className="text-sm font-bold text-gray-700 dark:text-white">{pref.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-brand-600 rounded-[2.5rem] shadow-premium p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <h2 className="text-xl font-display font-bold mb-4 relative z-10">Qualifications</h2>
                            <ul className="space-y-3 relative z-10">
                                {student.qualifications.map(q => (
                                    <li key={q} className="flex items-start space-x-2 text-sm text-brand-100">
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;