
import React from 'react';
import { Student } from '../types';
import { COURSES } from '../constants';
import { getTopMatches } from '../services/matchingService';
import Button from './common/Button';
import {
  ArrowTopRightOnSquareIcon,
  AcademicCapIcon,
  LightBulbIcon,
  CheckBadgeIcon,
  BriefcaseIcon
} from './common/Icons';

interface UpskillingProps {
  student: Student;
}

const Upskilling: React.FC<UpskillingProps> = ({ student }) => {
  const [missingSkills, setMissingSkills] = React.useState<string[]>([]);
  const [recommendedCourses, setRecommendedCourses] = React.useState<typeof COURSES>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        // Analyzing skill gaps for the student's top 5 matches.
        const topInternships = await getTopMatches(student, 5);
        const requiredSkills = new Set(topInternships.flatMap(i => i.requiredSkills));
        const studentSkills = new Set(student.skills);

        const missing = Array.from(requiredSkills).filter(skill => !studentSkills.has(skill));

        // Recommending courses for the missing skills.
        const recommended = COURSES.filter(course =>
          course.coversSkills.some(skill => missing.includes(skill))
        );

        setMissingSkills(missing);
        setRecommendedCourses(recommended);
      } catch (e) {
        console.error("Failed to analyze skills", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [student]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Analyzing your professional profile...</p>
      </div>
    );
  }

  if (missingSkills.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-8 rounded-2xl text-center">
        <div className="inline-flex p-3 bg-green-100 dark:bg-green-800/50 rounded-full mb-4">
          <CheckBadgeIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-green-800 dark:text-green-100 mb-2">You're All Set!</h3>
        <p className="text-green-600 dark:text-green-400">Great job! You already possess all the core skills required for your top-matched internships.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-100 font-medium uppercase tracking-wider text-xs">
              <AcademicCapIcon className="h-4 w-4" />
              <span>Career Growth</span>
            </div>
            <h1 className="text-3xl font-bold">Upskilling Hub</h1>
            <p className="text-indigo-100 max-w-lg">
              We've analyzed your profile against top internship requirements to identify key growth areas and recommended learning paths.
            </p>
          </div>
          <div className="flex -space-x-4">
            {/* Decorative element or secondary info */}
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <div className="text-white/60 text-xs font-medium uppercase mb-1">Skill Match Score</div>
              <div className="text-2xl font-bold text-white">
                {Math.round(((student.skills.length) / (student.skills.length + missingSkills.length)) * 100)}%
              </div>
            </div>
          </div>
        </div>
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      {/* Skill Gaps Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <LightBulbIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Identified Skill Gaps</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Essential skills you could develop to increase your match probability.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {missingSkills.map((skill, index) => (
            <div
              key={skill}
              className="group relative flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-default"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:animate-ping"></span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Courses Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <BriefcaseIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Curated Learning Paths</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">High-quality courses from top platforms tailored for you.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course, index) => (
            <div
              key={course.id}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-5"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-800">
                  {course.provider}
                </span>
                <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                  <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex-grow space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {course.coversSkills.map(skill => (
                    <span key={skill} className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md italic">
                      #{skill.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                    Free Access
                  </span>
                </div>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="sm" variant="primary" className="rounded-xl px-5 hover:gap-2 transition-all">
                    Enroll
                    <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <div className="mt-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
            <CheckBadgeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Professional Certification</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Completing these courses will automatically update your profile and award you specialized "Skill Badges" visible to recruiters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upskilling;
