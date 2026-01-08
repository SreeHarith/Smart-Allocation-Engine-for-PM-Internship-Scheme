from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import Student, StudentResponse

router = APIRouter()

@router.get("/", response_model=List[StudentResponse])
async def get_students():
    students = await Student.find_all().to_list()
    return students

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(student_id: int, updated_data: Student):
    student = await Student.find_one(Student.id == student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Exclude id from update to prevent changing it
    update_query = {
        "$set": {
            k: v for k, v in updated_data.dict(exclude={"id"}).items() 
            if v is not None
        }
    }
    
    await student.update(update_query)
    return student
