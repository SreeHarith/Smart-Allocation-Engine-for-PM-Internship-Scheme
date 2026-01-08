import { Student, Internship } from '../types';
import { api } from './api';

// IMPORTANT: With the move to Vector Space Matching, this service now delegates to the backend API.
// The frontend no longer calculates scores locally.

/**
 * Calculates a match score between a student and an internship.
 * Now fetches the score from the backend TF-IDF engine.
 */
export const calculateMatchScore = async (student: Student, internship: Internship): Promise<number> => {
  try {
    return await api.getMatchScore(student, internship.id);
  } catch (error) {
    console.error("Error fetching match score:", error);
    return 0;
  }
};

/**
 * Gets the top N internship matches for a student.
 * Now fetches prioritized recommendations from the backend.
 */
export const getTopMatches = async (student: Student, count: number, dislikedIds: number[] = []): Promise<Internship[]> => {
  try {
    const recommendations = await api.getRecommendations(student);

    // Recommendations come back as { internship: Internship, score: number }
    // We filter, take top N, and return just the internship objects to maintain compatibility
    // In a future refactor, we should pass the score through to the UI.

    // Map first to ensure we have the ID, then filter
    return recommendations
      .map((item: any) => {
        const internship = item.internship;
        // HACK: Handle MongoDB _id vs id serialization issues
        const validId = internship.id !== undefined ? internship.id : internship._id;
        return { ...internship, id: validId, score: item.score };
      })
      .filter((internship: Internship) => !dislikedIds.includes(internship.id))
      .slice(0, count);

  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return [];
  }
};

/**
 * Gets the top N applicants for an internship.
 * (This logic might still be client-side filtered for now or need a new endpoint)
 * For now, we leave this as a basic implementation or move to backend if needed.
 * Given the user request focused on "matching", we'll keep this simple or todo.
 */
export const getTopApplicants = async (internship: Internship, count: number): Promise<{ student: Student, score: number }[]> => {
  // This functionality should ideally also move to backend.
  // For now, we will perform a quick implementation that iterates all students and calls the score API?
  // NO, that would be N+1 API calls. 
  // Let's rely on the simulation/demo data or existing logic but routed via backend?
  // Actually, for this specific demo, let's just fetch all students and sort by a simplified local check OR 
  // simply return empty/mock if not critical. 
  // BUT the best approach is to query the backend. Let's create a client-side loop for now as a fallback
  // since we didn't add a /applicants endpoint.

  try {
    const allStudents = await api.getStudents();
    const applicantIds = new Set((internship.applicants || []).map(String));

    // This is slow (N calls), but accurate to the new model
    const scoredStudents = await Promise.all(
      allStudents
        .filter(student => applicantIds.has(String(student.id)))
        .map(async student => ({
          student,
          score: await calculateMatchScore(student, internship)
        }))
    );

    return scoredStudents
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  } catch (error) {
    console.error("Failed to fetch applicants:", error);
    return [];
  }
};