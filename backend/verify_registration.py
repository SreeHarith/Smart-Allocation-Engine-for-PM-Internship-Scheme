import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.schemas import Student, Company
from app.core.config import settings
import requests
import random

API_URL = "http://127.0.0.1:8000/api"

async def main():
    # 1. Setup DB Connection
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[Student, Company])

    # 2. Check Initial Counts
    initial_student_count = await Student.count()
    initial_company_count = await Company.count()
    print(f"Initial Students: {initial_student_count}")
    print(f"Initial Companies: {initial_company_count}")

    # 3. Simulate Student Registration
    test_phone = f"999{random.randint(1000000,9999999)}"
    student_payload = {
        "name": "Test Student Auto",
        "phoneNumber": test_phone,
        "password": "password123",
        "careerGoals": "Testing",
        "skills": ["Python"],
        "industryFocus": ["Tech"]
    }
    
    print(f"\nRegistering Student with phone {test_phone}...")
    try:
        r = requests.post(f"{API_URL}/auth/register", json=student_payload)
        if r.status_code == 200:
            print("Student Registration: SUCCESS")
            print(f"Response: {r.json()['name']} (ID: {r.json()['id']})")
        else:
            print(f"Student Registration: FAILED ({r.status_code})")
            print(r.text)
    except Exception as e:
        print(f"Request Error: {e}")

    # 4. Simulate Company Registration
    test_email = f"company{random.randint(1000,9999)}@test.com"
    company_payload = {
        "name": "Test Company Auto",
        "email": test_email,
        "password": "password123",
        "description": "We verify things.",
        "location": "Cloud",
        "size": "Startup"
    }

    print(f"\nRegistering Company with email {test_email}...")
    try:
        r = requests.post(f"{API_URL}/auth/company/register", json=company_payload)
        if r.status_code == 200:
            print("Company Registration: SUCCESS")
            print(f"Response: {r.json()['name']} (ID: {r.json()['id']})")
        else:
            print(f"Company Registration: FAILED ({r.status_code})")
            print(r.text)
    except Exception as e:
        print(f"Request Error: {e}")

    # 5. Verify Database Update
    final_student_count = await Student.count()
    final_company_count = await Company.count()
    print(f"\nFinal Students: {final_student_count}")
    print(f"Final Companies: {final_company_count}")

    if final_student_count > initial_student_count and final_company_count > initial_company_count:
        print("\nVERIFICATION PASSED: New accounts are successfully stored in the database.")
    else:
        print("\nVERIFICATION FAILED: Database counts did not increase.")

if __name__ == "__main__":
    asyncio.run(main())
