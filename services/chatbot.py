import json
from rapidfuzz import fuzz
from services.gemini_service import ask_gemini

with open(
    "knowledge/scholarships.json",
    "r",
    encoding="utf-8"
) as file:

    knowledge = json.load(file)


def search_json(question):

    question = question.lower()

    best_score = 0
    best_answer = None

    for item in knowledge:

        for keyword in item["keywords"]:

            score = fuzz.partial_ratio(
                question,
                keyword.lower()
            )

            if score > best_score:

                best_score = score
                best_answer = item

    if best_score >= 70:

        return f"""
🎓 {best_answer["title"]}

{best_answer["answer"]}

🌐 Official Website:
{best_answer["website"]}
"""

    return None


def get_answer(question):

    # أولًا: Gemini
    try:

        return ask_gemini(question)

    except Exception as e:

        print("Gemini Error:", e)

    # ثانيًا: JSON
    answer = search_json(question)

    if answer:

        return answer

    return """
❌ Sorry!

I couldn't find an answer.

Please try asking your question in another way.
"""