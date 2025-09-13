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
    <Card className="max-w-7xl mx-auto p-0">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img className="h-24 w-24 rounded-full object-cover ring-4 ring-offset-2 ring-brand-200 dark:ring-offset-gray-800 dark:ring-brand-700" src={student.profileImage} alt={student.name} />
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{student.name}</h1>
                    <p className="text-md text-gray-500 dark:text-gray-400">{student.email}</p>
                </div>
            </div>
             <Button onClick={handleEditToggle} variant={isEditing ? 'light' : 'primary'} size="sm" className="w-32 flex-shrink-0">
                {isEditing ? 'Cancel' : <><PencilIcon className="h-4 w-4 mr-2" /><span>Edit Profile</span></>}
            </Button>
        </div>

        {isEditing ? (
            <form onSubmit={handleSave} className="p-6 space-y-6">
                 <div>
                    <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Career Goals</label>
                    <textarea id="careerGoals" name="careerGoals" value={formData.careerGoals} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="locationPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location Preference</label>
                        <input type="text" id="locationPreference" name="locationPreference" value={formData.locationPreference} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label htmlFor="preferredCompanySize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Size</label>
                        <select id="preferredCompanySize" name="preferredCompanySize" value={formData.preferredCompanySize} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500">
                            <option>Any</option>
                            <option>Startup</option>
                            <option>Mid-size</option>
                            <option>MNC</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="preferredDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                         <select id="preferredDuration" name="preferredDuration" value={formData.preferredDuration} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500">
                            <option>Any</option>
                            <option>3 Months</option>
                            <option>6 Months</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills (comma-separated)</label>
                        <input type="text" id="skills" name="skills" value={formData.skills.join(', ')} onChange={(e) => handleArrayChange(e, 'skills')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label htmlFor="industryFocus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Industry Focus (comma-separated)</label>
                        <input type="text" id="industryFocus" name="industryFocus" value={formData.industryFocus.join(', ')} onChange={(e) => handleArrayChange(e, 'industryFocus')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
                    </div>
                </div>
                <div className="pt-5">
                    <div className="flex justify-end">
                        <Button type="button" onClick={() => setIsEditing(false)} variant="light">Cancel</Button>
                        <Button type="submit" className="ml-3">Save Changes</Button>
                    </div>
                </div>
            </form>
        ) : (
            <div className="p-6 space-y-6">
                <ProfileDetail label="Career Goals" value={<p className="text-gray-600 dark:text-gray-300">{student.careerGoals}</p>} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ProfileDetail label="Skills" value={
                        <div className="flex flex-wrap gap-2">
                            {student.skills.map(skill => <span key={skill} className="px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 rounded-full">{skill}</span>)}
                        </div>
                    }/>
                    <ProfileDetail label="Qualifications" value={
                         <ul className="list-disc list-inside">
                           {student.qualifications.map(q => <li key={q}>{q}</li>)}
                        </ul>
                    }/>
                     <ProfileDetail label="Industry Focus" value={
                        <div className="flex flex-wrap gap-2">
                            {student.industryFocus.map(skill => <span key={skill} className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">{skill}</span>)}
                        </div>
                    }/>
                    <ProfileDetail label="Preferences" value={
                        <ul className="space-y-1 text-sm">
                            <li><span className="font-semibold">Location:</span> {student.locationPreference}</li>
                            <li><span className="font-semibold">Company Size:</span> {student.preferredCompanySize}</li>
                            <li><span className="font-semibold">Duration:</span> {student.preferredDuration}</li>
                        </ul>
                    }/>
                </div>
            </div>
        )}
    </Card>
  );
};

export default Profile;