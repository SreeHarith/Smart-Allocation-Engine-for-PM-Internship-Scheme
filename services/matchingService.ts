import { Student, Internship } from '../types';
import { api } from './api';
import { ALL_STUDENTS } from '../constants';

/**
 * Calculates a match score between a student and an internship.
 * @param student - The student's profile.
 * @param internship - The internship details.
 * @returns A match score from 0 to 100.
 */
export const calculateMatchScore = (student: Student, internship: Internship): number => {
  // 1. Role/Goal Match (30% weight) - CRITICAL FACTOR
  // Check if career goals or industry focus align with the internship title
  const careerGoals = student.careerGoals || "";
  const industryFocus = student.industryFocus || [];
  const goalWords = (careerGoals + " " + industryFocus.join(" ")).toLowerCase().split(/\W+/);
  const titleWords = internship.title.toLowerCase().split(/\W+/);
  const sectorWords = internship.sector.toLowerCase().split(/\W+/);
  
  const importantKeywords = new Set([...titleWords, ...sectorWords]);
  // Filter out common stop words if needed, but for now simple matching
  const stopWords = new Set(['a', 'an', 'the', 'in', 'of', 'for', 'intern', 'internship', 'become', 'company']);
  
  let roleMatchCount = 0;
  let meaningfulKeywords = 0;
  
  importantKeywords.forEach(word => {
     if (!stopWords.has(word) && word.length > 2) {
         meaningfulKeywords++;
         if (goalWords.includes(word)) {
             roleMatchCount++;
         }
     }
  });
  
  // If there are meaningful keywords, calculate score. If not (unlikely), give a baseline.
  // We cap the match at 100% of the 30 points.
  const roleMatchScore = meaningfulKeywords > 0 
      ? Math.min(30, (roleMatchCount / Math.max(1, meaningfulKeywords * 0.5)) * 30) // slightly lenient denominator
      : 15;


  // 2. Skill match (50% weight)
  const skills = student.skills || [];
  const studentSkills = new Set(skills.map(s => s.toLowerCase()));
  const requiredSkills = new Set(internship.requiredSkills.map(s => s.toLowerCase()));
  let matchedSkills = 0;
  requiredSkills.forEach(skill => {
    if (studentSkills.has(skill)) {
      matchedSkills++;
    }
  });
  const skillMatchScore = requiredSkills.size > 0 ? (matchedSkills / requiredSkills.size) * 50 : 50;

  // 3. Logistics Balance (20% weight total)
  let logisticsScore = 0;

  // Location preference (5 points)
  const locPref = student.locationPreference || "";
  if (internship.location === 'Remote' || (locPref && locPref.includes(internship.location))) {
    logisticsScore += 5;
  }

  // Company size preference (5 points)
  if (!student.preferredCompanySize || student.preferredCompanySize === 'Any' || student.preferredCompanySize === internship.companySize) {
    logisticsScore += 5;
  }

  // Industry focus preference (5 points)
  // (Redundant with Role Match but explicitly checks the metadata field)
  if (industryFocus.length === 0 || industryFocus.includes(internship.sector)) {
      logisticsScore += 5;
  }

  // Duration preference (5 points)
  if (!student.preferredDuration || student.preferredDuration === 'Any' || student.preferredDuration === internship.duration) {
      logisticsScore += 5;
  }

  let finalScore = Math.round(roleMatchScore + skillMatchScore + logisticsScore);
  
  // Penalize drastically if Role Match is 0 to avoid "accidental" high scores just from logistics
  if (roleMatchScore === 0) {
      finalScore = Math.round(finalScore * 0.6); // 40% penalty
  }

  // Ensure score is within 0-100 range
  return Math.min(100, Math.max(0, finalScore));
};

/**
 * Gets the top N internship matches for a student.
 * @param student - The student's profile.
 * @param count - The number of top matches to return.
 * @param dislikedIds - An array of internship IDs to exclude.
 * @returns An array of top matched internships.
 */
export const getTopMatches = async (student: Student, count: number, dislikedIds: number[] = []): Promise<Internship[]> => {
  try {
    const internships = await api.getInternships();
    return internships
      .filter(internship => !dislikedIds.includes(internship.id)) // Filter out disliked internships
      .map(internship => ({
        internship,
        score: calculateMatchScore(student, internship),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.internship);
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return [];
  }
};

/**
 * Gets the top N applicants for an internship.
 * @param internship - The internship to find applicants for.
 * @param count - The number of top applicants to return.
 * @returns An array of top matched students with their scores.
 */
export const getTopApplicants = async (internship: Internship, count: number): Promise<{ student: Student, score: number }[]> => {
    try {
        const allStudents = await api.getStudents();
        const applicantIds = new Set(internship.applicants || []);
        
        return allStudents
            .filter(student => applicantIds.has(student.id))
            .map(student => ({
                student,
                score: calculateMatchScore(student, internship),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, count);
    } catch (error) {
        console.error("Failed to fetch applicants:", error);
        return [];
    }
};