from app.core.matching import TFIDFMatchingEngine
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class MockStudent:
    id: int = 1
    name: str = "Test"
    careerGoals: str = "Dev"
    skills: List[str] = field(default_factory=lambda: ["Python"])
    industryFocus: List[str] = field(default_factory=lambda: ["Tech"])
    role: str = "STUDENT"
    # Add other fields if accessed by matching logic
    qualifications: List[str] = field(default_factory=list)
    locationPreference: str = "Remote"
    preferredCompanySize: str = "Startup"
    preferredDuration: str = "6m"
    email: str = "test@student.com"

@dataclass
class MockInternship:
    id: int = 100
    title: str = "Job"
    company: str = "Corp"
    sector: str = "Tech"
    description: str = "Work"
    requiredSkills: List[str] = field(default_factory=lambda: ["Python"])
    location: str = "Remote"
    stipend: str = "100"
    deadline: str = "2024"
    companySize: str = "Startup"
    applicants: List[int] = field(default_factory=list)

try:
    print("Initializing Engine...")
    engine = TFIDFMatchingEngine()
    print("Engine Initialized.")
    
    s = MockStudent()
    i = MockInternship()
    
    print("Calculating Score...")
    score = engine.calculate_score(s, i) # type: ignore
    print(f"Score: {score}")

except Exception as e:
    print(f"CRASH: {e}")
    import traceback
    traceback.print_exc()
