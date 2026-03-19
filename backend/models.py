from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import numpy as np

SENTIMENT_MODEL = "valerieliang/reddit-sentiment-model"
SUMMARIZER_MODEL = "sshleifer/distilbart-cnn-6-6"

EMOTION_LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval",
    "caring", "confusion", "curiosity", "desire", "disappointment",
    "disapproval", "disgust", "embarrassment", "excitement", "fear",
    "gratitude", "grief", "joy", "love", "nervousness", "optimism",
    "pride", "realization", "relief", "remorse", "sadness",
    "surprise", "neutral"
]

device = 0 if torch.cuda.is_available() else -1

print("Loading sentiment model...")
tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL)
sentiment_model.eval()

print("Loading summarizer...")
summarizer = pipeline(
    "summarization",
    model=SUMMARIZER_MODEL,
    device=device,
)
print("Models ready.")


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


def summarize_posts(posts: list[dict]) -> str:
    combined = " ".join(
        f"{p['title']}. {p['text']}"
        for p in posts[:20]
    ).strip()[:3000]

    if not combined:
        return "Not enough text content to summarize."

    try:
        output = summarizer(
            combined,
            max_length=180,
            min_length=60,
            do_sample=False,
        )
        return output[0]["summary_text"]
    except Exception as e:
        return f"Summary unavailable: {str(e)}"