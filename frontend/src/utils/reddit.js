const HEADERS = { Accept: 'application/json' }
const BASE = 'https://www.reddit.com'

export async function fetchByKeyword(subreddit, keyword, limit = 25) {
  return _parse(`${BASE}/r/${subreddit}/search.json?q=${encodeURIComponent(keyword)}&restrict_sr=1&limit=${limit}&sort=new`)
}

export async function fetchRecentPosts(subreddit, limit = 25) {
  return _parse(`${BASE}/r/${subreddit}/new.json?limit=${limit}`)
}

export async function fetchUserPosts(username, limit = 25) {
  return _parse(`${BASE}/user/${username}/submitted.json?limit=${limit}&sort=new`)
}

export async function fetchUserComments(username, limit = 25) {
  const res = await fetch(`${BASE}/user/${username}/comments.json?limit=${limit}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`Reddit error: ${res.status}`)
  const data = await res.json()
  return data.data.children.map(({ data: c }) => ({
    id: c.id,
    title: `Comment in r/${c.subreddit}`,
    text: c.body,
    upvotes: c.score,
    author: c.author,
    created: c.created_utc,
    numComments: 0,
    url: `https://reddit.com${c.permalink}`,
  }))
}

async function _parse(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Reddit error: ${res.status}`)
  const data = await res.json()
  return data.data.children.map(({ data: p }) => ({
    id: p.id,
    title: p.title,
    text: p.selftext,
    upvotes: p.score,
    author: p.author,
    created: p.created_utc,
    numComments: p.num_comments,
    url: `https://reddit.com${p.permalink}`,
  }))
}