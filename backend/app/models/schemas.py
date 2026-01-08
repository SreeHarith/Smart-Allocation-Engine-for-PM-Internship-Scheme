from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, Field

class Student(Document):
    id: int # Keeping int to match frontend expectation
    name: str
    phoneNumber: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    role: str = "STUDENT"
    profileImage: Optional[str] = None
    careerGoals: Optional[str] = None
    skills: List[str] = []
    qualifications: List[str] = []
    locationPreference: Optional[str] = None
    preferredCompanySize: Optional[str] = None # 'Startup' | 'Mid-size' | 'MNC' | 'Any'
    industryFocus: List[str] = []
    preferredDuration: Optional[str] = None # '3 Months' | '6 Months' | 'Any'
    gender: Optional[str] = None
    background: Optional[str] = None
    collegeTier: Optional[str] = None

    class Settings:
        name = "students"

class Company(Document):
    id: int
    name: str
    email: str  # Email based login
    password: str
    role: str = "COMPANY"
    description: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    size: Optional[str] = None
    
    class Settings:
        name = "companies"

class Internship(Document):
    id: int
    title: str
    company: str
    description: str
    requiredSkills: List[str] = []
    location: str
    sector: str
    deadline: str
    seats: int
    duration: str
    companySize: str # 'Startup' | 'Mid-size' | 'MNC'
    stipend: Optional[str] = None
    applicants: List[int] = [] # List of student IDs

    class Settings:
        name = "internships"

class StudentResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    role: str
    profileImage: Optional[str] = None
    careerGoals: Optional[str] = None
    skills: List[str]
    qualifications: List[str]
    locationPreference: Optional[str] = None
    preferredCompanySize: Optional[str] = None
    industryFocus: List[str]
    preferredDuration: Optional[str] = None
    gender: Optional[str] = None
    background: Optional[str] = None
    collegeTier: Optional[str] = None
    
    class Config:
        populate_by_name = True
        from_attributes = True # Support Pydantic V2
        orm_mode = True # Support Pydantic V1 fallback

class CompanyResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    description: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    size: Optional[str] = None

    class Config:
        populate_by_name = True
        from_attributes = True
        orm_mode = True

class InternshipResponse(BaseModel):
    id: int
    title: str
    company: str
    description: str
    requiredSkills: List[str]
    location: str
    sector: str
    deadline: str
    seats: int
    duration: str
    companySize: str
    stipend: Optional[str] = None
    applicants: List[int] = []

    class Config:
        populate_by_name = True
        from_attributes = True
        orm_mode = True

class Admin(Document):
    id: int
    name: str
    email: str
    password: str
    role: str = "ADMIN"

    class Settings:
        name = "admins"

class AdminResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        populate_by_name = True
        from_attributes = True
        orm_mode = True
