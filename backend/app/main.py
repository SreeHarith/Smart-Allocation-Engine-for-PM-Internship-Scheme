from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings
from app.models.schemas import Student, Internship, Company, Admin

app = FastAPI(title="Smart Allocation Engine API")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*" # Allow all for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def start_db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[Student, Internship, Company, Admin])

from app.api.endpoints import students, internships, auth, ai, matching, admin

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(internships.router, prefix="/api/internships", tags=["Internships"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Mentor"])
app.include_router(matching.router, prefix="/api/matching", tags=["Matching"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/")
async def root():
    return {"message": "Smart Allocation Engine API is running"}

# Trigger reload
