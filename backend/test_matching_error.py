from app.core.matching import TFIDFMatchingEngine
from app.models.schemas import Student, Internship

# Mock Data
s = Student(
    id=1,
    name="Test Student",
    email="test@example.com",
    role="STUDENT",
    skills=["Python", "React"],
    collegeTier="Tier-1",
    qualifications=["B.Tech"],
    industryFocus=["Tech"],
    careerGoals="To be a dev",
    locationPreference="Remote",
    preferredCompanySize="Startup",
    preferredDuration="6 months"
)

i = Internship(
    id=100,
    title="Data Science Intern",
    company="Data Inc",
    sector="Tech",
    description="Analyze data",
    requiredSkills=["Python", "SQL"],
    location="Remote",
    stipend="10000",
    deadline="2024-12-31",
    companySize="Startup"
)

try:
    engine = TFIDFMatchingEngine()
    score = engine.calculate_score(s, i)
    print(f"Score: {score}")
except Exception as e:
    print(f"CRASH: {e}")
