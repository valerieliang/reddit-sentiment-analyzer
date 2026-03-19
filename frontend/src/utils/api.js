const API_BASE = 'https://valerieliang-reddit-sentiment-backend.hf.space'

export async function analyzeReddit({ mode, subreddit, keyword, username, limit }) {
  const params = new URLSearchParams({
    mode,
    subreddit,
    keyword,
    username,
    limit: String(limit),
  })

  const res = await fetch(`${API_BASE}/analyze?${params}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `API error ${res.status}`)
  }
  return res.json()  // { posts, summary, postCount }
}