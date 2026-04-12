from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import json

router = APIRouter()

# Set your API key here or via environment variable
# e.g. OPENAI_API_KEY or GEMINI_API_KEY
AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_PROVIDER = os.getenv("AI_PROVIDER", "")  # "openai" or "gemini"


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = (
    "You are an AI assistant for a Smart Timetable Generator application. "
    "You help users with scheduling, timetable generation, conflict resolution, "
    "teacher workload balancing, and general questions about how to use the app. "
    "Keep answers concise and helpful. If asked about something unrelated to "
    "timetables or education scheduling, politely redirect the conversation."
)

# Built-in responses for when no API key is configured
FALLBACK_RESPONSES = {
    "help": "I can help you with:\n• Creating divisions, teachers, and subjects\n• Configuring timetable settings\n• Generating AI-powered timetables\n• Understanding conflicts and workload\n\nJust ask me anything!",
    "generate": "To generate a timetable:\n1. Go to Input Data and add divisions, teachers, and subjects\n2. Set up the configuration (working days, times, breaks)\n3. Go to Generate Timetable and click 'Generate AI Timetable'",
    "conflict": "Conflicts occur when:\n• A teacher is assigned to two divisions at the same time\n• A room is double-booked\n• Weekly hours exceed the limit\n\nThe AI algorithm tries to minimize these automatically.",
    "division": "Divisions represent different class sections (e.g., A, B, C). Each division gets its own timetable with all subjects assigned.",
    "teacher": "Teachers can be assigned to subjects. The system ensures no teacher is double-booked across divisions at the same time slot.",
    "subject": "Subjects can be Lecture, Lab, or Both. You can set weekly hours, category (Major/Minor/etc.), and assign teachers when adding a subject.",
    "config": "In Configuration, set:\n• Working days (1-7)\n• Start and end time\n• Break count and duration\n\nThis defines your timetable grid.",
}


def _get_fallback_reply(message: str) -> str:
    """Simple keyword-based fallback when no AI API key is set."""
    msg = message.lower()

    for keyword, response in FALLBACK_RESPONSES.items():
        if keyword in msg:
            return response

    if any(w in msg for w in ["hi", "hello", "hey"]):
        return "Hello! I'm your timetable assistant. How can I help you today? Try asking about generating timetables, managing subjects, or resolving conflicts."

    if any(w in msg for w in ["thank", "thanks"]):
        return "You're welcome! Let me know if you need anything else."

    if "how" in msg and "work" in msg:
        return "The Smart Timetable Generator uses a genetic algorithm to create optimal timetables. It considers teacher availability, room constraints, and workload balancing to minimize conflicts."

    return (
        "I can help with timetable-related questions! Try asking about:\n"
        "• How to generate a timetable\n"
        "• Managing divisions, teachers, or subjects\n"
        "• Configuration settings\n"
        "• Resolving conflicts\n\n"
        "💡 Tip: Connect an AI API key for smarter responses!"
    )


async def _call_openai(message: str) -> str:
    """Call OpenAI API."""
    try:
        import httpx

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {AI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": message},
                    ],
                    "max_tokens": 300,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"AI service error: {str(e)}"


async def _call_gemini(message: str) -> str:
    """Call Google Gemini API."""
    try:
        import httpx

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={AI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [
                        {
                            "parts": [
                                {"text": f"{SYSTEM_PROMPT}\n\nUser: {message}"}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "maxOutputTokens": 300,
                        "temperature": 0.7,
                    },
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"AI service error: {str(e)}"


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with AI assistant."""
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Use AI provider if API key is configured
    if AI_API_KEY and AI_PROVIDER:
        if AI_PROVIDER == "openai":
            reply = await _call_openai(message)
        elif AI_PROVIDER == "gemini":
            reply = await _call_gemini(message)
        else:
            reply = _get_fallback_reply(message)
    else:
        reply = _get_fallback_reply(message)

    return ChatResponse(reply=reply)


@router.get("/chat/status")
def chat_status():
    """Check if AI chat is configured."""
    return {
        "configured": bool(AI_API_KEY and AI_PROVIDER),
        "provider": AI_PROVIDER if AI_API_KEY else None,
    }
