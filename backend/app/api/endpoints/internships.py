from typing import List
from fastapi import APIRouter, HTTPException, Body
from app.models.schemas import Internship, InternshipResponse, Student

router = APIRouter()

@router.get("/", response_model=List[InternshipResponse])
async def get_internships():
    internships = await Internship.find_all().to_list()
    return internships

@router.post("/", response_model=InternshipResponse)
async def create_internship(internship: Internship):
    # Ensure ID is unique if manually provided, or generate one (simplified for now)
    # Ideally, we let MongoDB handle _id, but our schema uses 'id'.
    # For MVP, assuming the client or logic handles unique IDs, or we find the max ID.
    existing = await Internship.find_one(Internship.id == internship.id)
    if existing:
        # Generate a new ID if conflict (simple logic)
        latest = await Internship.find_all().sort("-id").first_or_none()
        internship.id = (latest.id + 1) if latest else 1
    
    await internship.insert()
    return internship

@router.post("/{id}/apply")
async def apply_internship(id: int, student_id: int = Body(..., embed=True)):
    internship = await Internship.find_one(Internship.id == id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    if student_id not in internship.applicants:
        internship.applicants.append(student_id)
        await internship.save()
        
    return {"message": "Application successful", "internship_id": id}
