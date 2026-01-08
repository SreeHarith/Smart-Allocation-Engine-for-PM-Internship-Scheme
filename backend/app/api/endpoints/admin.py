from fastapi import APIRouter
from typing import List, Dict, Any
from app.models.schemas import Student, Company, Internship, StudentResponse, CompanyResponse

router = APIRouter()

@router.get("/stats")
async def get_admin_stats():
    total_students = await Student.count()
    total_companies = await Company.count()
    total_internships = await Internship.count()
    
    # Calculate active internships (future deadline)
    # simple count for now
    active_internships = total_internships 
    
    # Mock placement data for now as we don't track 'placed' status explicitly yet
    # In a real app, we'd check `Application` models or a `placed` flag
    placements = int(total_students * 0.15) 

    return {
        "totalStudents": total_students,
        "totalCompanies": total_companies,
        "activeInternships": active_internships,
        "placements": placements
    }

@router.get("/users")
async def get_all_users():
    students = await Student.find_all().to_list()
    companies = await Company.find_all().to_list()
    
    # return simple list for the table
    return {
        "students": [StudentResponse(**s.dict()) for s in students],
        "companies": [CompanyResponse(**c.dict()) for c in companies]
    }

@router.get("/analytics")
async def get_analytics():
    # 1. Diversity Stats (Mock for now or aggregate real data)
    # We can aggregate from fetched students if needed, but keeping it simple
    
    # 2. Skills Demand vs Supply
    # Demand: Count occurrence of skills in Internship.requiredSkills
    # Supply: Count occurrence of skills in Student.skills
    
    internships = await Internship.find_all().to_list()
    students = await Student.find_all().to_list()
    
    demand_counts = {}
    for i in internships:
        for skill in i.requiredSkills:
            s_lower = skill.lower()
            demand_counts[s_lower] = demand_counts.get(s_lower, 0) + 1
            
    supply_counts = {}
    for s in students:
        for skill in s.skills:
            s_lower = skill.lower()
            supply_counts[s_lower] = supply_counts.get(s_lower, 0) + 1
            
    # Normalize to top 5 requested skills
    sorted_demand = sorted(demand_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    chart_data = []
    total_demand = sum(demand_counts.values()) or 1
    total_supply = sum(supply_counts.values()) or 1
    
    for skill, count in sorted_demand:
        supply_val = supply_counts.get(skill, 0)
        chart_data.append({
            "name": skill.title(),
            "demand": int((count / total_demand) * 100 * 5), # Scale factor for visual
            "supply": int((supply_val / total_supply) * 100 * 5)
        })
        
    return {
        "skillsChart": chart_data
    }
