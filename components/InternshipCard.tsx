

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
    <div className={`flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${hasSkill
      ? 'bg-accent-50/50 text-accent-700 border-accent-100 dark:bg-accent-900/20 dark:text-accent-300 dark:border-accent-900/50'
      : 'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800/50 dark:text-gray-500 dark:border-gray-700'
      }`}>
      {skill}
    </div>
  );

  return (
    <div className="group relative bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      {/* Match Score Badge */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-50/50 dark:bg-brand-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex justify-between items-start mb-6">
        <div className="flex-1 pr-6">
          <div className="inline-block px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-2">
            {internship.sector}
          </div>
          <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-brand-600 transition-colors">
            {internship.title}
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{internship.company}</p>
        </div>

        <div className="relative flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600">
          <span className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">Match</span>
          <span className={`text-base font-display font-black leading-none ${matchScore >= 60 ? 'text-emerald-500' :
              matchScore >= 40 ? 'text-yellow-500' :
                matchScore >= 20 ? 'text-orange-500' :
                  'text-rose-500'
            }`}>
            {matchScore}%
          </span>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-6">
          {internship.description}
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {requiredSkills.slice(0, 4).map(skill => (
              <SkillPill key={skill} skill={skill} hasSkill={studentSkills.has(skill)} />
            ))}
            {requiredSkills.length > 4 && (
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400">+{requiredSkills.length - 4} more</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50 dark:border-gray-700/50">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-medium truncate">{internship.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <WalletIcon className="h-4 w-4 text-accent-400" />
            <span className="text-xs font-medium truncate">{internship.stipend || 'Competitive'}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 col-span-2">
            <CalendarDaysIcon className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-medium">Apply by {new Date(internship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-3">
        <div className="flex-1">
          {isApplied ? (
            <Button
              onClick={() => onWithdraw(internship)}
              className="w-full !rounded-2xl border-rose-100 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
              variant="light"
            >
              Withdraw
            </Button>
          ) : (
            <Button
              onClick={() => onApply(internship.id, internship.title)}
              className="w-full !rounded-2xl shadow-brand-100 group-hover:scale-[1.02]"
            >
              Apply Now
            </Button>
          )}
        </div>
        <button
          onClick={() => onDislike(internship.id)}
          className="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
          title="Not interested"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;