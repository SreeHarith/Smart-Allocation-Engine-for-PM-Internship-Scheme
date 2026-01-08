from fastapi import APIRouter, HTTPException, Body
from app.models.schemas import Student, StudentResponse
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class LoginRequest(BaseModel):
    phoneNumber: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    phoneNumber: str
    password: str
    # Optional Profile Details
    careerGoals: Optional[str] = None
    skills: List[str] = []
    locationPreference: Optional[str] = None
    preferredCompanySize: Optional[str] = None
    preferredDuration: Optional[str] = None
    industryFocus: List[str] = []

class CompanyLoginRequest(BaseModel):
    email: str
    password: str

class CompanyRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    description: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    size: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=StudentResponse)
async def register(data: RegisterRequest):
    # Check if phone number already exists
    existing_student = await Student.find_one(Student.phoneNumber == data.phoneNumber)
    if existing_student:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    # Hash password
    hashed_password = get_password_hash(data.password)

    # Create new student
    # Note: Using a simple incremental ID for now as per schema requirements.
    # We sort by -Student.id (descending) to find the max ID.
    last_student = await Student.find_all().sort(-Student.id).first_or_none()
    new_id = (last_student.id + 1) if last_student else 1

    new_student = Student(
        id=new_id,
        name=data.name,
        phoneNumber=data.phoneNumber,
        password=hashed_password,
        role="STUDENT",
        careerGoals=data.careerGoals,
        skills=data.skills,
        locationPreference=data.locationPreference,
        preferredCompanySize=data.preferredCompanySize,
        preferredDuration=data.preferredDuration,
        industryFocus=data.industryFocus,
        qualifications=[]
    )
    
    await new_student.insert()
    return new_student

@router.post("/login", response_model=StudentResponse)
async def login(data: LoginRequest):
    student = await Student.find_one(Student.phoneNumber == data.phoneNumber)
    if not student:
        raise HTTPException(status_code=400, detail="Invalid phone number or password")
    
    if not verify_password(data.password, student.password):
        raise HTTPException(status_code=400, detail="Invalid phone number or password")
    
    return student

from app.models.schemas import Company, CompanyResponse

@router.post("/company/register", response_model=CompanyResponse)
async def register_company(data: CompanyRegisterRequest):
    # Check if company email already exists
    existing_company = await Company.find_one(Company.email == data.email)
    if existing_company:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = get_password_hash(data.password)

    # Create new company
    last_company = await Company.find_all().sort(-Company.id).first_or_none()
    new_id = (last_company.id + 1) if last_company else 1

    new_company = Company(
        id=new_id,
        name=data.name,
        email=data.email,
        password=hashed_password,
        role="COMPANY",
        description=data.description,
        website=data.website,
        location=data.location,
        size=data.size
    )
    
    await new_company.insert()
    return new_company


@router.post("/company/login", response_model=CompanyResponse)
async def login_company(data: CompanyLoginRequest):
    company = await Company.find_one(Company.email == data.email)
    if not company:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(data.password, company.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return company

from app.models.schemas import Admin, AdminResponse

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class AdminRegisterRequest(BaseModel):
    name: str
    email: str
    password: str

@router.post("/admin/register", response_model=AdminResponse)
async def register_admin(data: AdminRegisterRequest):
    # Check if admin already exists
    existing_admin = await Admin.find_one(Admin.email == data.email)
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(data.password)

    last_admin = await Admin.find_all().sort(-Admin.id).first_or_none()
    new_id = (last_admin.id + 1) if last_admin else 1

    new_admin = Admin(
        id=new_id,
        name=data.name,
        email=data.email,
        password=hashed_password,
        role="ADMIN"
    )
    
    await new_admin.insert()
    return new_admin

@router.post("/admin/login", response_model=AdminResponse)
async def login_admin(data: AdminLoginRequest):
    admin = await Admin.find_one(Admin.email == data.email)
    if not admin:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(data.password, admin.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return admin
