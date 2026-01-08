import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.schemas import Internship, Student
from app.core.config import settings

async def main():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[Internship, Student])

    print("--- Internships with Applicants ---")
    internships = await Internship.find_all().to_list()
    found = False
    for i in internships:
        if i.applicants:
            found = True
            print(f"Internship '{i.title}' (ID: {i.id}) has applicants: {i.applicants}")
    
    if not found:
        print("No internships have applicants.")

if __name__ == "__main__":
    asyncio.run(main())
