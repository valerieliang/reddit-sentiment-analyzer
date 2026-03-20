import os
from groq import Groq

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_summary(posts: list[dict]) -> str:
    lines = []
    for p in posts[:20]:
        top = p["emotions"][0]["label"] if p.get("emotions") else "neutral"
        lines.append(f"[{top}] {p['title']}")

    digest = "\n".join(lines)

    response = groq_client.chat.completions.create(
        model="llama3-8b-8192",
        max_tokens=180,
        messages=[{
            "role": "user",
            "content": (
                f"Here are {len(lines)} Reddit posts with detected emotions:\n\n"
                f"{digest}\n\n"
                "Write 2-3 sentences summarizing the general opinions and sentiment. "
                "Be specific about what people feel and why. Third person, present tense. No bullet points."
            )
        }]
    )
    return response.choices[0].message.content