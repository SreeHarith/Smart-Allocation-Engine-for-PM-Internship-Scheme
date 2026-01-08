from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.schemas import Student, Internship
from app.core.matching import TFIDFMatchingEngine


router = APIRouter()
engine = TFIDFMatchingEngine()

# We need a way to fetch all internships. 
# Since get_internships in internships.py is an endpoint, we might need to duplicate logic or import the model directly.
# For now, let's assume we can query the database directly here or pass the data in the request.
# To keep it simple and efficient, we will fetch internships from DB in this endpoint.

class RecommendationRequest(Student):
    pass

class ScoreRequest(Student):
    pass

@router.post("/recommendations")
async def get_recommendations(student: Student):
    try:
        internships = await Internship.find_all().to_list()
        recommendations = engine.get_recommendations(student, internships)
        return recommendations
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/score/{internship_id}")
async def get_score(internship_id: int, student: Student):
    try:
        internship = await Internship.find_one(Internship.id == internship_id)
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found")
        
        score = engine.calculate_score(student, internship)
        return {"score": score}
    except Exception as e:
        print(f"Error calculating score: {e}")
        raise HTTPException(status_code=500, detail=str(e))
