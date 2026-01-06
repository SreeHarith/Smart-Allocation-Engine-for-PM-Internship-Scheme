// FIX: Populated with mock data used across the application.
import { Student, Company, Admin, Internship, Course, InterviewQuestion } from './types';

export const STUDENT_DATA: Student = {
  id: 1,
  name: 'DHARSHAN P',
  email: 'dharshan@example.com',
  role: 'STUDENT',
  profileImage: `https://i.pravatar.cc/150?u=dharshan`,
  careerGoals: 'Become a Product Manager in a tech company',
  skills: ['React', 'Node.js', 'Market Research', 'Agile Methodologies', 'Figma'],
  qualifications: ['B.Tech in Computer Science', 'Certified Scrum Master'],
  locationPreference: 'Bangalore',
  preferredCompanySize: 'Mid-size',
  industryFocus: ['Artificial Intelligence', 'Web Development'],
  preferredDuration: '3 Months',
  gender: 'Female',
  background: 'Urban',
  collegeTier: 'Tier-1',
};

export const COMPANY_DATA: Company = {
  id: 101,
  name: 'InnovateAI Corp',
  email: 'hr@innovateai.com',
  role: 'COMPANY',
};

export const ADMIN_DATA: Admin = {
  id: 999,
  name: 'Platform Admin',
  email: 'admin@platform.gov.in',
  role: 'ADMIN',
};

export const INTERNSHIPS: Internship[] = [
  {
    id: 1,
    title: 'AI Product Management Intern',
    company: 'InnovateAI Corp',
    description: 'Work with our AI team to define and launch new product features. A great opportunity to learn about machine learning products.',
    requiredSkills: ['Market Research', 'Agile Methodologies', 'Data Analysis', 'Product Roadmapping'],
    location: 'Bangalore',
    sector: 'Artificial Intelligence',
    deadline: '2024-08-15',
    seats: 2,
    duration: '3 Months',
    companySize: 'Mid-size',
    stipend: '₹25,000 / month',
  },
  {
    id: 2,
    title: 'Frontend Developer Intern (React)',
    company: 'WebSolutions Ltd.',
    description: 'Join our frontend team to build responsive and user-friendly interfaces for our flagship products using React and TypeScript.',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'REST APIs'],
    location: 'Remote',
    sector: 'Web Development',
    deadline: '2024-08-20',
    seats: 3,
    duration: '6 Months',
    companySize: 'Startup',
    stipend: '₹20,000 / month',
  },
  {
    id: 3,
    title: 'Data Science Intern',
    company: 'Data Insights Inc.',
    description: 'Analyze large datasets to extract meaningful insights and contribute to our predictive modeling projects. Must know Python.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'],
    location: 'Hyderabad',
    sector: 'Data Science',
    deadline: '2024-08-10',
    seats: 1,
    duration: '4 Months',
    companySize: 'MNC',
    stipend: '₹30,000 / month',
  },
  {
    id: 4,
    title: 'Backend Developer Intern (Node.js)',
    company: 'ServerWorks',
    description: 'Help build and maintain our scalable backend services. Experience with Node.js and databases is a plus.',
    requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    location: 'Bangalore',
    sector: 'Backend Development',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    seats: 2,
    duration: '3 Months',
    companySize: 'Mid-size',
    stipend: '₹22,000 / month',
  },
  {
    id: 5,
    title: 'UI/UX Design Intern',
    company: 'Creative Minds Studio',
    description: 'Collaborate with product managers and engineers to design intuitive and engaging user interfaces for our mobile and web applications.',
    requiredSkills: ['Figma', 'UI/UX Principles', 'Prototyping'],
    location: 'Remote',
    sector: 'Design',
    deadline: '2024-09-01',
    seats: 1,
    duration: '3 Months',
    companySize: 'Startup',
    stipend: '₹18,000 / month',
  },
  {
    id: 6,
    title: 'Digital Marketing Intern',
    company: 'GrowthHackers Inc.',
    description: 'Assist in planning and executing digital marketing campaigns across various channels, including social media, SEO, and email marketing.',
    requiredSkills: ['SEO', 'Social Media Marketing', 'Google Analytics'],
    location: 'Mumbai',
    sector: 'Marketing',
    deadline: '2024-08-25',
    seats: 2,
    duration: '6 Months',
    companySize: 'Mid-size',
    stipend: '₹15,000 / month',
  },
  {
    id: 7,
    title: 'Cloud Engineering Intern (AWS)',
    company: 'InfraCloud Solutions',
    description: 'Learn to manage and scale cloud infrastructure on AWS. Work with services like EC2, S3, and Lambda.',
    requiredSkills: ['AWS', 'Linux', 'Docker'],
    location: 'Bangalore',
    sector: 'Cloud Computing',
    deadline: '2024-09-10',
    seats: 2,
    duration: '6 Months',
    companySize: 'MNC',
    stipend: '₹35,000 / month',
  },
  {
    id: 8,
    title: 'Business Analyst Intern',
    company: 'Strategy First',
    description: 'Support senior analysts in gathering requirements, creating process flows, and analyzing business needs for client projects.',
    requiredSkills: ['Market Research', 'Data Analysis', 'Microsoft Excel'],
    location: 'Delhi',
    sector: 'Consulting',
    deadline: '2024-08-30',
    seats: 1,
    duration: '3 Months',
    companySize: 'MNC',
    stipend: '₹28,000 / month',
  },
];

// A new internship that can be used to simulate a "new match" notification.
export const NEW_INTERNSHIP_FOR_SIMULATION: Internship = {
  id: 100, // Unique ID
  title: 'AI Ethics & Strategy Intern',
  company: 'GovTech Alliance',
  description: 'Research and develop strategies for ethical AI implementation in public sector projects. Strong analytical and communication skills required.',
  requiredSkills: ['Market Research', 'Agile Methodologies', 'Data Analysis'],
  location: 'Bangalore',
  sector: 'Artificial Intelligence',
  deadline: '2024-09-30',
  seats: 1,
  duration: '3 Months',
  companySize: 'Mid-size',
  stipend: '₹22,000 / month',
};

export const COURSES: Course[] = [
  {
    id: 1,
    title: 'Introduction to Data Analysis with Python',
    provider: 'Coursera',
    coversSkills: ['Data Analysis', 'Python'],
  },
  {
    id: 2,
    title: 'Advanced SQL for Data Scientists',
    provider: 'Udemy',
    coversSkills: ['SQL'],
  },
  {
    id: 3,
    title: 'Product Roadmapping Fundamentals',
    provider: 'LinkedIn Learning',
    coversSkills: ['Product Roadmapping'],
  },
  {
    id: 4,
    title: 'Machine Learning A-Z',
    provider: 'Udemy',
    coversSkills: ['Machine Learning'],
  },
  {
    id: 5,
    title: 'Advanced React and TypeScript',
    provider: 'Frontend Masters',
    coversSkills: ['React', 'TypeScript'],
  },
];

export const ALL_STUDENTS: Student[] = [
  STUDENT_DATA, // DHARSHAN P
  {
    id: 2, name: 'Rohan Verma', email: 'rohan.v@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=rohan`, careerGoals: 'AI/ML Engineer',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'], qualifications: ['B.E. in IT'], locationPreference: 'Bangalore',
    preferredCompanySize: 'Any', industryFocus: ['Artificial Intelligence'], preferredDuration: '6 Months', gender: 'Male', background: 'Urban', collegeTier: 'Tier-1',
  },
  {
    id: 3, name: 'Priya Singh', email: 'priya.s@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=priya`, careerGoals: 'Data Scientist',
    skills: ['Python', 'SQL', 'Data Analysis', 'Agile Methodologies'], qualifications: ['B.Sc. in Statistics'], locationPreference: 'Hyderabad',
    preferredCompanySize: 'MNC', industryFocus: ['Data Science'], preferredDuration: 'Any', gender: 'Female', background: 'Rural', collegeTier: 'Tier-2',
  },
  {
    id: 4, name: 'Amit Kumar', email: 'amit.k@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=amit`, careerGoals: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'], qualifications: ['B.Tech in CSE'], locationPreference: 'Remote',
    preferredCompanySize: 'Startup', industryFocus: ['Web Development'], preferredDuration: '6 Months', gender: 'Male', background: 'Rural', collegeTier: 'Tier-3',
  },
  {
    id: 5, name: 'Sunita Devi', email: 'sunita.d@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=sunita`, careerGoals: 'Product Manager',
    skills: ['Market Research', 'Agile Methodologies', 'Figma'], qualifications: ['MBA'], locationPreference: 'Bangalore',
    preferredCompanySize: 'Mid-size', industryFocus: ['Artificial Intelligence'], preferredDuration: '3 Months', gender: 'Female', background: 'Urban', collegeTier: 'Tier-2',
  },
  // Add 15 more diverse students
  { id: 6, name: 'Karan Malhotra', email: 'karan.m@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=karan`, careerGoals: 'Backend Developer', skills: ['Node.js', 'Express.js', 'MongoDB'], qualifications: ['B.E.'], locationPreference: 'Bangalore', preferredCompanySize: 'Startup', industryFocus: ['Backend Development'], preferredDuration: '3 Months', gender: 'Male', background: 'Urban', collegeTier: 'Tier-1' },
  { id: 7, name: 'Anjali Rao', email: 'anjali.r@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=anjali`, careerGoals: 'UI/UX Designer', skills: ['Figma', 'React'], qualifications: ['Design Diploma'], locationPreference: 'Remote', preferredCompanySize: 'Any', industryFocus: ['Web Development'], preferredDuration: '6 Months', gender: 'Female', background: 'Urban', collegeTier: 'Tier-2' },
  // FIX: Changed preferredDuration from '4 Months' to 'Any' to match the allowed types in types.ts.
  { id: 8, name: 'Vikram Singh', email: 'vikram.s@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=vikram`, careerGoals: 'Data Analyst', skills: ['SQL', 'Data Analysis', 'Python'], qualifications: ['B.Com'], locationPreference: 'Hyderabad', preferredCompanySize: 'MNC', industryFocus: ['Data Science'], preferredDuration: 'Any', gender: 'Male', background: 'Rural', collegeTier: 'Tier-3' },
  { id: 9, name: 'Sneha Patel', email: 'sneha.p@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=sneha`, careerGoals: 'Frontend Developer', skills: ['React', 'CSS', 'TypeScript'], qualifications: ['B.Tech'], locationPreference: 'Remote', preferredCompanySize: 'Startup', industryFocus: ['Web Development'], preferredDuration: '6 Months', gender: 'Female', background: 'Urban', collegeTier: 'Tier-2' },
  { id: 10, name: 'Rajesh Gupta', email: 'rajesh.g@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=rajesh`, careerGoals: 'AI Engineer', skills: ['Machine Learning', 'Python'], qualifications: ['M.Tech'], locationPreference: 'Bangalore', preferredCompanySize: 'Mid-size', industryFocus: ['Artificial Intelligence'], preferredDuration: '3 Months', gender: 'Male', background: 'Urban', collegeTier: 'Tier-1' },
  { id: 11, name: 'Deepika Nair', email: 'deepika.n@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=deepika`, careerGoals: 'Product Manager', skills: ['Market Research', 'Product Roadmapping'], qualifications: ['MBA'], locationPreference: 'Bangalore', preferredCompanySize: 'Mid-size', industryFocus: ['Artificial Intelligence'], preferredDuration: '3 Months', gender: 'Female', background: 'Rural', collegeTier: 'Tier-3' },
  // FIX: Changed preferredDuration from '4 Months' to 'Any' to match the allowed types in types.ts.
  { id: 12, name: 'Arjun Reddy', email: 'arjun.r@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=arjun`, careerGoals: 'Data Scientist', skills: ['Python', 'Machine Learning', 'SQL'], qualifications: ['B.E.'], locationPreference: 'Hyderabad', preferredCompanySize: 'MNC', industryFocus: ['Data Science'], preferredDuration: 'Any', gender: 'Male', background: 'Urban', collegeTier: 'Tier-1' },
  { id: 13, name: 'Meera Desai', email: 'meera.d@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=meera`, careerGoals: 'Frontend Developer', skills: ['React', 'TypeScript'], qualifications: ['BCA'], locationPreference: 'Remote', preferredCompanySize: 'Startup', industryFocus: ['Web Development'], preferredDuration: '6 Months', gender: 'Female', background: 'Rural', collegeTier: 'Tier-3' },
  { id: 14, name: 'Sanjay Joshi', email: 'sanjay.j@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=sanjay`, careerGoals: 'Backend Developer', skills: ['Node.js', 'MongoDB'], qualifications: ['MCA'], locationPreference: 'Bangalore', preferredCompanySize: 'Mid-size', industryFocus: ['Backend Development'], preferredDuration: '3 Months', gender: 'Male', background: 'Urban', collegeTier: 'Tier-2' },
  { id: 15, name: 'Fatima Khan', email: 'fatima.k@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=fatima`, careerGoals: 'AI PM', skills: ['Market Research', 'Agile Methodologies', 'Data Analysis'], qualifications: ['B.Tech'], locationPreference: 'Bangalore', preferredCompanySize: 'Mid-size', industryFocus: ['Artificial Intelligence'], preferredDuration: '3 Months', gender: 'Female', background: 'Urban', collegeTier: 'Tier-1' },
  // FIX: Changed preferredDuration from '4 Months' to 'Any' to match the allowed types in types.ts.
  { id: 16, name: 'Naveen Kumar', email: 'naveen.k@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=naveen`, careerGoals: 'Data Scientist', skills: ['Data Analysis', 'SQL'], qualifications: ['B.Sc.'], locationPreference: 'Hyderabad', preferredCompanySize: 'MNC', industryFocus: ['Data Science'], preferredDuration: 'Any', gender: 'Male', background: 'Rural', collegeTier: 'Tier-3' },
  { id: 17, name: 'Pooja Reddy', email: 'pooja.r@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=pooja`, careerGoals: 'React Developer', skills: ['React', 'REST APIs'], qualifications: ['B.E.'], locationPreference: 'Remote', preferredCompanySize: 'Startup', industryFocus: ['Web Development'], preferredDuration: '6 Months', gender: 'Female', background: 'Urban', collegeTier: 'Tier-2' },
  { id: 18, name: 'Alok Nath', email: 'alok.n@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=alok`, careerGoals: 'Backend Engineer', skills: ['Node.js', 'REST APIs'], qualifications: ['B.Tech'], locationPreference: 'Bangalore', preferredCompanySize: 'Mid-size', industryFocus: ['Backend Development'], preferredDuration: '3 Months', gender: 'Male', background: 'Rural', collegeTier: 'Tier-2' },
  { id: 19, name: 'Lakshmi Iyer', email: 'lakshmi.i@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=lakshmi`, careerGoals: 'Product Manager', skills: ['Market Research', 'Product Roadmapping', 'Data Analysis'], qualifications: ['MBA'], locationPreference: 'Bangalore', preferredCompanySize: 'Mid-size', industryFocus: ['Artificial Intelligence'], preferredDuration: '3 Months', gender: 'Female', background: 'Urban', collegeTier: 'Tier-1' },
  // FIX: Changed preferredDuration from '4 Months' to 'Any' to match the allowed types in types.ts.
  { id: 20, name: 'Harish Mehta', email: 'harish.m@example.com', role: 'STUDENT', profileImage: `https://i.pravatar.cc/150?u=harish`, careerGoals: 'Data Analyst', skills: ['SQL', 'Python'], qualifications: ['B.Sc.'], locationPreference: 'Hyderabad', preferredCompanySize: 'MNC', industryFocus: ['Data Science'], preferredDuration: 'Any', gender: 'Male', background: 'Rural', collegeTier: 'Tier-3' },
];

// Mock data for placed students for the diversity dashboard
export const PLACED_STUDENTS: Student[] = ALL_STUDENTS.slice(0, 15); // Taking first 15 students as "placed"

export const MOCK_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 1, text: "Tell me about yourself and why you're interested in product management." },
  { id: 2, text: "Describe a product you love and what you would do to improve it." },
  { id: 3, text: "How do you handle disagreements with team members, for example, an engineer who thinks a feature is too difficult to build?" },
  { id: 4, text: "Walk me through how you would prioritize features for a new product." },
  { id: 5, text: "What are your biggest strengths and weaknesses as a potential product manager?" }
];

// --- Demo Credentials ---
export const DEMO_CREDENTIALS = {
  STUDENT: { email: 'dharshan@example.com', password: 'password123' },
  COMPANY: { email: 'hr@innovateai.com', password: 'password123' },
  ADMIN: { email: 'admin@platform.gov.in', password: 'password123' }
};