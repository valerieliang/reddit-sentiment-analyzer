import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from collections import Counter

SENTIMENT_MODEL = "valerieliang/reddit-sentiment-model"

EMOTION_LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval",
    "caring", "confusion", "curiosity", "desire", "disappointment",
    "disapproval", "disgust", "embarrassment", "excitement", "fear",
    "gratitude", "grief", "joy", "love", "nervousness", "optimism",
    "pride", "realization", "relief", "remorse", "sadness",
    "surprise", "neutral"
]

print("Loading sentiment model...")
tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL)
sentiment_model.eval()
print("Sentiment model ready.")


def analyze_sentiment(texts: list[str]) -> list[list[dict]]:
    results = []
    for text in texts:
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=128,
            padding=True,
        )
        with torch.no_grad():
            logits = sentiment_model(**inputs).logits[0]
        probs = torch.sigmoid(logits).numpy()
        emotions = sorted(
            [{"label": EMOTION_LABELS[i], "score": float(probs[i])} for i in range(len(EMOTION_LABELS))],
            key=lambda x: x["score"],
            reverse=True,
        )[:5]
        results.append(emotions)
    return results


def generate_summary(posts: list[dict]) -> str:
    # Try Groq first, fall back to programmatic if key not set
    api_key = os.environ.get("GROQ_API_KEY")

    if api_key:
        try:
            from groq import Groq
            client = Groq(api_key=api_key)

            lines = []
            for p in posts[:20]:
                top = p["emotions"][0]["label"] if p.get("emotions") else "neutral"
                lines.append(f"[{top}] {p['title']}")

            response = client.chat.completions.create(
                model="llama3-8b-8192",
                max_tokens=180,
                messages=[{
                    "role": "user",
                    "content": (
                        f"Here are {len(lines)} Reddit posts with detected emotions:\n\n"
                        + "\n".join(lines)
                        + "\n\nWrite 2-3 sentences summarizing the general opinions and "
                        "sentiment in this community. Be specific about what people feel "
                        "and why. Third person, present tense. No bullet points."
                    )
                }]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq failed, falling back to programmatic summary: {e}")

    # Programmatic fallback
    return _programmatic_summary(posts)


def _programmatic_summary(posts: list[dict]) -> str:
    positive_labels = {
        'joy', 'admiration', 'approval', 'gratitude', 'love',
        'optimism', 'excitement', 'amusement', 'relief', 'pride', 'caring'
    }
    negative_labels = {
        'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust',
        'fear', 'grief', 'remorse', 'sadness', 'nervousness', 'embarrassment'
    }

    dominant = Counter()
    pos_posts, neg_posts, neu_posts = [], [], []

    for p in posts:
        if not p.get("emotions"):
            continue
        top = p["emotions"][0]["label"]
        dominant[top] += 1
        if top in positive_labels:
            pos_posts.append((p["title"], top))
        elif top in negative_labels:
            neg_posts.append((p["title"], top))
        else:
            neu_posts.append((p["title"], top))

    total = len(posts)
    top_emotions = dominant.most_common(3)

    if len(pos_posts) > len(neg_posts) * 1.5:
        lean = "largely positive"
    elif len(neg_posts) > len(pos_posts) * 1.5:
        lean = "largely negative"
    else:
        lean = "mixed"

    emotion_str = ", ".join(f"{e} ({n} posts)" for e, n in top_emotions)
    s1 = f"Sentiment across {total} posts is {lean}, with dominant emotions being {emotion_str}."

    s2 = ""
    if pos_posts:
        title, emotion = pos_posts[0]
        s2 = f"Positive posts express {emotion}, such as \"{title[:80]}{'...' if len(title) > 80 else ''}\"."

    s3 = ""
    if neg_posts:
        title, emotion = neg_posts[0]
        s3 = f"Critical posts show {emotion}, such as \"{title[:80]}{'...' if len(title) > 80 else ''}\"."
    elif neu_posts:
        s3 = f"{len(neu_posts)} posts are neutral or observational in tone."

    return " ".join(filter(None, [s1, s2, s3]))