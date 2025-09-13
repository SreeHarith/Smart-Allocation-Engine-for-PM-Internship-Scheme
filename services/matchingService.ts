import { Student, Internship } from '../types';
import { INTERNSHIPS, ALL_STUDENTS } from '../constants';

/**
 * Calculates a match score between a student and an internship.
 * @param student - The student's profile.
 * @param internship - The internship details.
 * @returns A match score from 0 to 100.
 */
export const calculateMatchScore = (student: Student, internship: Internship): number => {
  // Skill match (60% weight)
  const studentSkills = new Set(student.skills);
  const requiredSkills = new Set(internship.requiredSkills);
  let matchedSkills = 0;
  requiredSkills.forEach(skill => {
    if (studentSkills.has(skill)) {
      matchedSkills++;
    }
  });
  const skillMatchScore = requiredSkills.size > 0 ? (matchedSkills / requiredSkills.size) * 60 : 60;

  // Location preference (10 points)
  let locationBonus = 0;
  if (internship.location === 'Remote' || student.locationPreference.includes(internship.location)) {
    locationBonus = 10;
  }

  // Company size preference (10 points)
  let companySizeBonus = 0;
  if (student.preferredCompanySize === 'Any' || student.preferredCompanySize === internship.companySize) {
    companySizeBonus = 10;
  }

  // Industry focus preference (10 points)
  let industryFocusBonus = 0;
  if (student.industryFocus.length === 0 || student.industryFocus.includes(internship.sector)) {
      industryFocusBonus = 10;
  }

  // Duration preference (10 points)
  let durationBonus = 0;
  if (student.preferredDuration === 'Any' || student.preferredDuration === internship.duration) {
      durationBonus = 10;
  }

  let score = Math.round(skillMatchScore + locationBonus + companySizeBonus + industryFocusBonus + durationBonus);
  
  // Ensure score is within 0-100 range
  return Math.min(100, Math.max(0, score));
};

/**
 * Gets the top N internship matches for a student.
 * @param student - The student's profile.
 * @param count - The number of top matches to return.
 * @param dislikedIds - An array of internship IDs to exclude.
 * @returns An array of top matched internships.
 */
export const getTopMatches = (student: Student, count: number, dislikedIds: number[] = []): Internship[] => {
  return INTERNSHIPS
    .filter(internship => !dislikedIds.includes(internship.id)) // Filter out disliked internships
    .map(internship => ({
      internship,
      score: calculateMatchScore(student, internship),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.internship);
};

/**
 * Gets the top N applicants for an internship.
 * @param internship - The internship to find applicants for.
 * @param count - The number of top applicants to return.
 * @returns An array of top matched students with their scores.
 */
export const getTopApplicants = (internship: Internship, count: number): { student: Student, score: number }[] => {
    return ALL_STUDENTS
        .map(student => ({
            student,
            score: calculateMatchScore(student, internship),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
};