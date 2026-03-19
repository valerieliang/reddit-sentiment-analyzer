import requests

HEADERS = {"User-Agent": "reddit-sentiment-app/1.0"}
BASE = "https://www.reddit.com"


def fetch_by_keyword(subreddit: str, keyword: str, limit: int = 25):
    url = f"{BASE}/r/{subreddit}/search.json?q={keyword}&restrict_sr=1&limit={limit}&sort=new"
    return _parse(url)


def fetch_recent(subreddit: str, limit: int = 25):
    return _parse(f"{BASE}/r/{subreddit}/new.json?limit={limit}")


def fetch_user_posts(username: str, limit: int = 25):
    return _parse(f"{BASE}/user/{username}/submitted.json?limit={limit}&sort=new")


def fetch_user_comments(username: str, limit: int = 25):
    r = requests.get(
        f"{BASE}/user/{username}/comments.json?limit={limit}",
        headers=HEADERS,
    )
    r.raise_for_status()
    return [
        {
            "id": c["data"]["id"],
            "title": f"Comment in r/{c['data']['subreddit']}",
            "text": c["data"]["body"],
            "upvotes": c["data"]["score"],
            "author": c["data"]["author"],
            "created": c["data"]["created_utc"],
            "numComments": 0,
            "url": f"https://reddit.com{c['data']['permalink']}",
        }
        for c in r.json()["data"]["children"]
    ]


def _parse(url: str):
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    return [
        {
            "id": p["data"]["id"],
            "title": p["data"]["title"],
            "text": p["data"]["selftext"],
            "upvotes": p["data"]["score"],
            "author": p["data"]["author"],
            "created": p["data"]["created_utc"],
            "numComments": p["data"]["num_comments"],
            "url": f"https://reddit.com{p['data']['permalink']}",
        }
        for p in r.json()["data"]["children"]
    ]