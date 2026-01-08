import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.schemas import Student, Internship
from app.core.config import settings

# Mock Data from constants.ts
STUDENTS_DATA = [{
    "id": 1,
    "name": 'DHARSHAN P',
    "email": 'dharshan@example.com',
    "phoneNumber": "9000000001",
    "password": "$argon2id$v=19$m=65536,t=3,p=4$Dn6A2+XgE/Wc/RzY4Tq4Yg$rF7k+g0yL/B/y/K/c/v/g/f/s/d", # hash for "password123" (example)
    "role": 'STUDENT',
    "profileImage": "https://i.pravatar.cc/150?u=dharshan",
    "careerGoals": 'Become a Product Manager in a tech company',
    "skills": ['React', 'Node.js', 'Market Research', 'Agile Methodologies', 'Figma'],
    "qualifications": ['B.Tech in Computer Science', 'Certified Scrum Master'],
    "locationPreference": 'Bangalore',
    "preferredCompanySize": 'Mid-size',
    "industryFocus": ['Artificial Intelligence', 'Web Development'],
    "preferredDuration": '3 Months',
    "gender": 'Female',
    "background": 'Urban',
    "collegeTier": 'Tier-1',
  },
  {
    "id": 2, "name": 'Rohan Verma', "email": 'rohan.v@example.com', "role": 'STUDENT', "profileImage": "https://i.pravatar.cc/150?u=rohan", "careerGoals": 'AI/ML Engineer',
    "skills": ['Python', 'Machine Learning', 'Data Analysis', 'SQL'], "qualifications": ['B.E. in IT'], "locationPreference": 'Bangalore',
    "preferredCompanySize": 'Any', "industryFocus": ['Artificial Intelligence'], "preferredDuration": '6 Months', "gender": 'Male', "background": 'Urban', "collegeTier": 'Tier-1',
  },
   {
    "id": 3, "name": 'Priya Singh', "email": 'priya.s@example.com', "role": 'STUDENT', "profileImage": "https://i.pravatar.cc/150?u=priya", "careerGoals": 'Data Scientist',
    "skills": ['Python', 'SQL', 'Data Analysis', 'Agile Methodologies'], "qualifications": ['B.Sc. in Statistics'], "locationPreference": 'Hyderabad',
    "preferredCompanySize": 'MNC', "industryFocus": ['Data Science'], "preferredDuration": 'Any', "gender": 'Female', "background": 'Rural', "collegeTier": 'Tier-2',
  },
  {
    "id": 4, "name": 'Amit Kumar', "email": 'amit.k@example.com', "role": 'STUDENT', "profileImage": "https://i.pravatar.cc/150?u=amit", "careerGoals": 'Full Stack Developer',
    "skills": ['React', 'Node.js', 'MongoDB', 'REST APIs'], "qualifications": ['B.Tech in CSE'], "locationPreference": 'Remote',
    "preferredCompanySize": 'Startup', "industryFocus": ['Web Development'], "preferredDuration": '6 Months', "gender": 'Male', "background": 'Rural', "collegeTier": 'Tier-3',
  },
  {
    "id": 5, "name": 'Sunita Devi', "email": 'sunita.d@example.com', "role": 'STUDENT', "profileImage": "https://i.pravatar.cc/150?u=sunita", "careerGoals": 'Product Manager',
    "skills": ['Market Research', 'Agile Methodologies', 'Figma'], "qualifications": ['MBA'], "locationPreference": 'Bangalore',
    "preferredCompanySize": 'Mid-size', "industryFocus": ['Artificial Intelligence'], "preferredDuration": '3 Months', "gender": 'Female', "background": 'Urban', "collegeTier": 'Tier-2',
  },
]

INTERNSHIPS_DATA = [
  {
    "id": 1,
    "title": 'AI Product Management Intern',
    "company": 'InnovateAI Corp',
    "description": 'Work with our AI team to define and launch new product features. A great opportunity to learn about machine learning products.',
    "requiredSkills": ['Market Research', 'Agile Methodologies', 'Data Analysis', 'Product Roadmapping'],
    "location": 'Bangalore',
    "sector": 'Artificial Intelligence',
    "deadline": '2024-08-15',
    "seats": 2,
    "duration": '3 Months',
    "companySize": 'Mid-size',
    "stipend": '₹25,000 / month',
  },
  {
    "id": 2,
    "title": 'Frontend Developer Intern (React)',
    "company": 'WebSolutions Ltd.',
    "description": 'Join our frontend team to build responsive and user-friendly interfaces for our flagship products using React and TypeScript.',
    "requiredSkills": ['React', 'TypeScript', 'CSS', 'REST APIs'],
    "location": 'Remote',
    "sector": 'Web Development',
    "deadline": '2024-08-20',
    "seats": 3,
    "duration": '6 Months',
    "companySize": 'Startup',
    "stipend": '₹20,000 / month',
  },
    {
    "id": 3,
    "title": 'Data Science Intern',
    "company": 'Data Insights Inc.',
    "description": 'Analyze large datasets to extract meaningful insights and contribute to our predictive modeling projects. Must know Python.',
    "requiredSkills": ['Python', 'SQL', 'Data Analysis', 'Machine Learning'],
    "location": 'Hyderabad',
    "sector": 'Data Science',
    "deadline": '2024-08-10',
    "seats": 1,
    "duration": '4 Months',
    "companySize": 'MNC',
    "stipend": '₹30,000 / month',
  },
  {
    "id": 4,
    "title": 'Backend Developer Intern (Node.js)',
    "company": 'ServerWorks',
    "description": 'Help build and maintain our scalable backend services. Experience with Node.js and databases is a plus.',
    "requiredSkills": ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    "location": 'Bangalore',
    "sector": 'Backend Development',
    "deadline": '2024-08-17', # approximated deadline
    "seats": 2,
    "duration": '3 Months',
    "companySize": 'Mid-size',
    "stipend": '₹22,000 / month',
  },
]

async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[Student, Internship])

    print("Clearing existing data...")
    await Student.delete_all()
    await Internship.delete_all()

    print("Seeding Students...")
    for student_data in STUDENTS_DATA:
        student = Student(**student_data)
        await student.insert()
    
    print("Seeding Internships...")
    for internship_data in INTERNSHIPS_DATA:
        internship = Internship(**internship_data)
        await internship.insert()

    print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
