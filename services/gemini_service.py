import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

SYSTEM_PROMPT = """
You are ScholarAI.

You are an expert scholarship advisor.

Help students with:

- Scholarships
- Universities
- IELTS
- TOEFL
- Duolingo
- CV
- Resume
- SOP
- Motivation Letter
- Recommendation Letter
- Study Abroad

Always answer professionally.

If you don't know something,
say you don't know.

Always recommend official websites whenever possible.
"""

def ask_gemini(message):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"{SYSTEM_PROMPT}\n\nUser: {message}"
    )

    return response.text