from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import httpx
from app.core.config import settings

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
    
    # default to simulation if key is missing
    if not settings.OPENROUTER_API_KEY:
         return {"response": get_simulated_response(user_msg)}

    # Construct messages for the AI
    messages = [
        {
            "role": "system", 
            "content": "You are a helpful and encouraging AI Mentor for students looking for internships. You provide advice on resumes, interviews, and career paths."
        }
    ]
    
    for msg in request.history:
        messages.append({"role": msg.role, "content": msg.content})
    
    messages.append({"role": "user", "content": user_msg})

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Smart Allocation Engine",
                },
                json={
                    "model": "qwen/qwen-2.5-vl-7b-instruct:free",
                    "messages": messages,
                },
                timeout=10.0 # Short timeout for better UX on fallback
            )
            
            if response.status_code != 200:
                print(f"OpenRouter Error ({response.status_code}): {response.text}")
                # Fallback to simulation on error
                return {"response": get_simulated_response(user_msg, prefix="[Offline Mode] ")}
                
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            
            return {"response": ai_response}
            
    except Exception as e:
        print(f"AI Connection Error: {str(e)}")
        # Fallback to simulation on exception
        return {"response": get_simulated_response(user_msg, prefix="[Offline Mode] ")}

def get_simulated_response(message: str, prefix: str = "") -> str:
    """Fallback rule-based logic"""
    msg = message.lower()
    response = ""
    
    if "resume" in msg or "cv" in msg:
        response = "I can definitely help with your resume. Make sure to highlight your key projects and quantify your achievements (e.g., 'Increased efficiency by 20%'). Would you like me to review a specific section?"
    elif "internship" in msg or "job" in msg:
        response = "Based on your profile, I recommend looking for internships that value your specific skills. Have you checked the 'AI-Powered Shortlist' on your dashboard? It updates daily."
    elif "interview" in msg:
        response = "Mock interviews are a great way to prepare. Remember to use the STAR method (Situation, Task, Action, Result) when answering behavioral questions. Shall we try a practice question?"
    elif "skill" in msg or "learn" in msg:
        response = "Continuous learning is key! Given current trends, I'd suggest focusing on data analysis tools or cloud platforms like AWS/Azure to complement your PM skills."
    elif "hello" in msg or "hi" in msg:
        response = "Hello there! I'm ready to help you navigate your career path. What's on your mind today?"
    else:
        response = "That's an interesting point. As your AI Mentor, I'm here to support your career growth. Could you tell me more about your specific goals regarding this?"
        
    return prefix + response
