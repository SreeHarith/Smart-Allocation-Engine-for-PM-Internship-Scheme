
import React, { useMemo } from 'react';
import { Student } from '../types';
import { COURSES, INTERNSHIPS } from '../constants';
import { getTopMatches } from '../services/matchingService';
import Button from './common/Button';
import { ArrowTopRightOnSquareIcon } from './common/Icons';

interface UpskillingProps {
  student: Student;
}

const Upskilling: React.FC<UpskillingProps> = ({ student }) => {
  const { missingSkills, recommendedCourses } = useMemo(() => {
    // Student ke top 5 matches ke liye skill gap analyze karte hain.
    // Analyzing skill gaps for the student's top 5 matches.
    const topInternships = getTopMatches(student, 5);
    const requiredSkills = new Set(topInternships.flatMap(i => i.requiredSkills));
    const studentSkills = new Set(student.skills);
    
    const missing = Array.from(requiredSkills).filter(skill => !studentSkills.has(skill));
    
    // Missing skills ke liye courses recommend karte hain.
    // Recommending courses for the missing skills.
    const recommended = COURSES.filter(course => 
      course.coversSkills.some(skill => missing.includes(skill))
    );

    return { missingSkills: missing, recommendedCourses: recommended };
  }, [student]);

  if (missingSkills.length === 0) {
    return <p className="text-green-600 dark:text-green-400">Great! You have all the required skills for your top internship matches.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-white">Skill Gaps Detected</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">For your top matched internships, you could benefit from learning:</p>
        <div className="flex flex-wrap gap-2 mt-2">
            {missingSkills.map(skill => (
                <span key={skill} className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded">{skill}</span>
            ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-white">Recommended Courses</h4>
        <div className="space-y-3 mt-2">
            {recommendedCourses.map(course => (
                <div key={course.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">{course.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">By {course.provider}</p>
                    </div>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <Button size="sm">
                            Enroll
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                        </Button>
                    </a>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Upskilling;
