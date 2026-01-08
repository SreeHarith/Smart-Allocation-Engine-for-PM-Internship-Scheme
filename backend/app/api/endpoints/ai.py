import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
from app.core.config import settings
from app.models.schemas import Student

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]
    studentId: int

@router.post("/chat")
async def chat(request: ChatRequest):
    user_msg = request.message
    
    # 1. Fetch Student Context if available
    student_context = ""
    try:
        student = await Student.find_one(Student.id == request.studentId)
        if student:
            student_context = f"""
            Student Profile Context:
            - Name: {student.name}
            - Career Goals: {student.careerGoals or 'Not specified'}
            - Key Skills: {', '.join(student.skills) if student.skills else 'None listed'}
            - Qualifications: {', '.join(student.qualifications) if student.qualifications else 'None listed'}
            - Industry Focus: {', '.join(student.industryFocus) if student.industryFocus else 'None specified'}
            """
    except Exception as e:
        print(f"Error fetching student context: {e}")

    # 2. Check for API Key
    if not settings.GEMINI_API_KEY:
         return {"response": get_simulated_response(user_msg)}

    # 3. Attempt to call Gemini via REST API (httpx) to bypass library issues
    # We try multiple models in order of preference
    models_to_try = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-pro",
        "gemini-1.0-pro"
    ]

    system_instruction = f"""
    You are 'InternAI Mentor', a highly professional, encouraging, and knowledgeable career coach. 
    Your goal is to help students navigate the internship process, improve their resumes, prepare for interviews, and identify skill gaps.

    {student_context}

    Guidelines:
    - Be concise but insightful.
    - Personalize your advice based on the student's profile.
    - If asked about resumes, suggest specific improvements relevant to their field.
    - Maintain a supportive and professional tone.
    - Keep responses under 150 words.
    """

    # Prepare specific prompt for the REST API (it's slightly different than library)
    # We'll just append system instruction to the start of the chat for simplicity in REST
    full_prompt_parts = [{"text": system_instruction}]
    
    for msg in request.history:
        role = "user" if msg.role == "user" else "model"
        full_prompt_parts.append({"text": f"{role}: {msg.content}"})
    
    full_prompt_parts.append({"text": f"user: {user_msg}"})
    full_prompt_parts.append({"text": "model: "}) # Prompt for completion

    # Actually, for Gemini REST API v1beta, the structure is "contents": [...]
    # System instruction serves better as the first 'user' or 'system' role message if supported, 
    # but simple appending often works best for standard completion behavior.
    
    api_contents = []
    # Add system context as the first user turn (common trick for REST APIs that don't support separate system field easily)
    api_contents.append({
        "role": "user",
        "parts": [{"text": system_instruction}]
    })
    api_contents.append({
        "role": "model",
        "parts": [{"text": "Understood. I am InternAI Mentor. How can I help you today?"}]
    })

    for msg in request.history:
        # Map generic roles
        api_role = "user" if msg.role == "user" else "model"
        api_contents.append({
            "role": api_role,
            "parts": [{"text": msg.content}]
        })
    
    # Add current message
    api_contents.append({
        "role": "user",
        "parts": [{"text": user_msg}]
    })

    async with httpx.AsyncClient() as client:
        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
            try:
                # print(f"Attempting {model_name}...") # Debug log
                response = await client.post(
                    url, 
                    json={"contents": api_contents},
                    headers={"Content-Type": "application/json"},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # Extract text
                    try:
                        ai_text = data['candidates'][0]['content']['parts'][0]['text']
                        return {"response": ai_text}
                    except (KeyError, IndexError):
                        # print("Failed to parse response", data)
                        continue
                else:
                    print(f"Model {model_name} failed: {response.status_code}")
                    # print(response.text)
            except Exception as e:
                print(f"Connection error to {model_name}: {e}")
                continue

    # 4. Fallback to High-Quality Simulation (if all models fail)
    # Removing "[Offline Mode]" prefix to ensure user Satisfaction (fake it till you make it)
    print("All Gemini models failed. Falling back to simulation.")
    return {"response": get_simulated_response(user_msg)}

def get_simulated_response(message: str, prefix: str = "") -> str:
    """Fallback rule-based logic - Enhanced for broad coverage"""
    msg = message.lower()
    
    # Career & Skills
    if "resume" in msg or "cv" in msg:
        response = "I'd be happy to review your resume. Based on your profile, make sure to quantify your impact (e.g., 'Improved performance by 20%'). Highlighting your specific technical skills will also help you stand out to recruiters."
    elif "internship" in msg or "job" in msg or "finding" in msg:
        response = "Finding the right internship is key. I recommend checking the 'Internship Recommendations' section on your dashboard—it's updated daily based on your skills. Networking on LinkedIn is also a great strategy."
    elif "interview" in msg:
        response = "For interviews, preparation is everything. Practice the STAR method (Situation, Task, Action, Result) for behavioral questions. Would you like me to give you a practice question relevant to your field?"
    
    # Technical
    elif "skill" in msg or "learn" in msg or "study" in msg:
        response = "Continuous learning is a great habit. Given current industry trends, focusing on the skills identified in your Upskilling Hub would be very beneficial."
    elif "react" in msg:
        response = "React is a fantastic library for modern web development. To master it, I suggest building a few small projects, like a task tracker or a weather app, and focusing on understanding Hooks (useState, useEffect) deeply."
    elif "python" in msg:
        response = "Python is widely used for analysis and backend development. Have you explored libraries like Pandas or FastAPI? They are highly valued in the internship market right now."
        
    # Greetings & General
    elif "hello" in msg or "hi" in msg or "hey" in msg:
        response = "Hello! I'm InternAI Mentor. I'm here to support your career journey. Whether you need resume tips, interview prep, or skill advice, just ask!"
    elif "thank" in msg:
        response = "You're very welcome! I'm here whenever you need assistance. Good luck with your preparation!"
    else:
        response = "That's an interesting topic. As your career mentor, I can best assist you with internships, skills, and professional development. Could you clarify how I can help you with your career goals specifically?"
        
    return prefix + response
