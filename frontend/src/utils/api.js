const API_BASE = 'https://valerieliang-reddit-sentiment-backend.hf.space'

export async function analyzeReddit(posts) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `API error ${res.status}`)
  }
  return res.json()
}