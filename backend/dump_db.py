import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.schemas import Internship, Student
from app.core.config import settings
import json

async def main():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[Internship, Student])

    print("--- Internships ---")
    internships = await Internship.find_all().to_list()
    for i in internships:
        print(f"ID: {i.id} (Type: {type(i.id)}) - Title: {i.title}")

    print("\n--- Students ---")
    students = await Student.find_all().to_list()
    for s in students:
        print(f"ID: {s.id} (Type: {type(s.id)}) - Name: {s.name}")

if __name__ == "__main__":
    asyncio.run(main())
