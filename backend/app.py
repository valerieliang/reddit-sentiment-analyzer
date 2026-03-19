from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import analyze_sentiment, summarize_posts
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class Post(BaseModel):
    id: str
    title: str
    text: str
    upvotes: int
    author: str
    created: float
    numComments: int
    url: str

class AnalyzeRequest(BaseModel):
    posts: list[Post]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    if not req.posts:
        raise HTTPException(status_code=400, detail="No posts provided")

    posts = [p.dict() for p in req.posts]
    texts = [f"{p['title']} {p['text']}" for p in posts]

    emotions = analyze_sentiment(texts)
    summary = summarize_posts(posts)

    for post, emotion_list in zip(posts, emotions):
        post["emotions"] = emotion_list

    return {
        "posts": posts,
        "summary": summary,
        "postCount": len(posts),
    }