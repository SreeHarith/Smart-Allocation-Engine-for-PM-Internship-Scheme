// FIX: Populated with type definitions used across the application.
export interface UserBase {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
}

export interface Student extends UserBase {
  role: 'STUDENT';
  profileImage: string;
  careerGoals: string;
  skills: string[];
  qualifications: string[];
  locationPreference: string;
  // New preference fields
  preferredCompanySize: 'Startup' | 'Mid-size' | 'MNC' | 'Any';
  industryFocus: string[];
  preferredDuration: '3 Months' | '6 Months' | 'Any';
  // New diversity fields
  gender: 'Male' | 'Female' | 'Other';
  background: 'Urban' | 'Rural';
  collegeTier: 'Tier-1' | 'Tier-2' | 'Tier-3';
}

export interface Company extends UserBase {
  role: 'COMPANY';
}

export interface Admin extends UserBase {
  role: 'ADMIN';
}

export type User = Student | Company | Admin;

export interface Notification {
  id: number;
  userType: 'student' | 'company' | 'admin';
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
}

export interface Internship {
  id: number;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  location: string;
  sector: string;
  deadline: string;
  seats: number;
  duration: string;
  // New field for matching
  companySize: 'Startup' | 'Mid-size' | 'MNC';
  stipend?: string;
}

export interface Course {
    id: number;
    title: string;
    provider: string;
    coversSkills: string[];
}

export type NotificationTriggerEvent =
  | { type: 'welcome' }
  | { type: 'course_completion'; courseName: string; improvedInternship: string }
  | { type: 'project_completion'; projectName: string; score: number; nextProject: string }
  // New notification types
  | { type: 'new_match'; internshipName: string; matchScore: number }
  | { type: 'deadline_reminder'; internshipName: string; daysLeft: number }
  | { type: 'score_improvement'; internshipName: string; improvement: number; reason: string };

// Types for AI Mock Interview Feature
export interface InterviewQuestion {
    id: number;
    text: string;
}

export interface InterviewFeedback {
    type: 'tone' | 'pace' | 'bodyLanguage' | 'keywords';
    value: string;
    timestamp: number;
}

export interface InterviewReport {
    overallScore: number;
    strengths: string[];
    areasForImprovement: string[];
    detailedFeedback: {
        clarity: string;
        confidence: string;
        bodyLanguage: string;
        keywordUsage: string;
    };
}