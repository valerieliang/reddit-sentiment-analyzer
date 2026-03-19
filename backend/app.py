from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from models import analyze_sentiment, summarize_posts
from reddit import fetch_by_keyword, fetch_recent, fetch_user_posts, fetch_user_comments

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/analyze")
def analyze(
    mode: str = Query(...),
    subreddit: str = Query(""),
    keyword: str = Query(""),
    username: str = Query(""),
    limit: int = Query(25, ge=5, le=50),
):
    try:
        if mode == "keyword":         posts = fetch_by_keyword(subreddit, keyword, limit)
        elif mode == "recent":        posts = fetch_recent(subreddit, limit)
        elif mode == "user_posts":    posts = fetch_user_posts(username, limit)
        elif mode == "user_comments": posts = fetch_user_comments(username, limit)
        else: raise HTTPException(status_code=400, detail="Invalid mode")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Reddit fetch failed: {e}")

    if not posts:
        raise HTTPException(status_code=404, detail="No posts found")

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