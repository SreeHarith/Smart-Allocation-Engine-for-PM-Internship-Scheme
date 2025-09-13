

import React from 'react';
import { Internship, Student } from '../types';
import { calculateMatchScore } from '../services/matchingService';
import { MapPinIcon, BriefcaseIcon, CheckCircleIcon, XCircleIcon, CalendarDaysIcon, XMarkIcon, WalletIcon } from './common/Icons';
import Button from './common/Button';

interface InternshipCardProps {
  internship: Internship;
  student: Student;
  onDislike: (internshipId: number) => void;
  onApply: (internshipId: number, internshipTitle: string) => void;
  onWithdraw: (internship: Internship) => void;
  isApplied: boolean;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, student, onDislike, onApply, onWithdraw, isApplied }) => {
  const matchScore = calculateMatchScore(student, internship);
  const studentSkills = new Set(student.skills);
  const requiredSkills = internship.requiredSkills;

  const SkillPill: React.FC<{ skill: string, hasSkill: boolean }> = ({ skill, hasSkill }) => (
    <div className={`flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${hasSkill ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
      {hasSkill ? <CheckCircleIcon className="h-3 w-3 mr-1" /> : <XCircleIcon className="h-3 w-3 mr-1" />}
      {skill}
    </div>
  );
  
  return (
    <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <button 
        onClick={() => onDislike(internship.id)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Not interested in this internship"
      >
          <XMarkIcon className="h-5 w-5" />
      </button>

      <div>
        <div className="flex items-start justify-between">
          <div className="pr-8">
            <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400">{internship.title}</h3>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{internship.company}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Match Score</p>
            <p className="font-bold text-xl" style={{color: matchScore > 75 ? '#10b981' : matchScore > 50 ? '#f59e0b' : '#ef4444' }}>
              {matchScore}%
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{internship.description}</p>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map(skill => (
              <SkillPill key={skill} skill={skill} hasSkill={studentSkills.has(skill)} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0"/>
                <span className="truncate">{internship.location}</span>
            </div>
            <div className="flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-1.5 flex-shrink-0"/>
                <span className="truncate">{internship.sector}</span>
            </div>
            {internship.stipend && (
              <div className="flex items-center">
                  <WalletIcon className="h-4 w-4 mr-1.5 flex-shrink-0"/>
                  <span className="truncate">{internship.stipend}</span>
              </div>
            )}
            <div className="flex items-center col-span-2 sm:col-span-1">
                <CalendarDaysIcon className="h-4 w-4 mr-1.5 flex-shrink-0"/>
                <span className="truncate">Apply by: {new Date(internship.deadline).toLocaleDateString()}</span>
            </div>
        </div>
        <div className="mt-4">
            {isApplied ? (
                <Button 
                    onClick={() => onWithdraw(internship)}
                    className="w-full hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-400"
                    variant="light"
                >
                    Withdraw Application
                </Button>
            ) : (
                <Button onClick={() => onApply(internship.id, internship.title)} className="w-full">
                    Apply Now
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;