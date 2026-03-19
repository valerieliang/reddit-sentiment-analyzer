const BASE = 'https://www.reddit.com'
const HEADERS = { Accept: 'application/json' }

// Mode 1: keyword search within a subreddit (original)
export async function fetchByKeyword(subreddit, keyword, limit = 25) {
  const url = `${BASE}/r/${subreddit}/search.json?q=${encodeURIComponent(keyword)}&restrict_sr=1&limit=${limit}&sort=new`
  return fetchAndParse(url)
}

// Mode 2: just the newest posts from a subreddit, no keyword
export async function fetchRecentPosts(subreddit, limit = 25) {
  const url = `${BASE}/r/${subreddit}/new.json?limit=${limit}`
  return fetchAndParse(url)
}

// Mode 3: a specific user's post history
export async function fetchUserPosts(username, limit = 25) {
  const url = `${BASE}/user/${username}/submitted.json?limit=${limit}&sort=new`
  return fetchAndParse(url)
}

// Mode 4: a specific user's comment history
export async function fetchUserComments(username, limit = 25) {
  const url = `${BASE}/user/${username}/comments.json?limit=${limit}&sort=new`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Reddit returned ${res.status}`)
  const data = await res.json()
  return data.data.children.map(({ data: c }) => ({
    id: c.id,
    title: `Comment in r/${c.subreddit}`,
    text: c.body,
    upvotes: c.score,
    url: `https://reddit.com${c.permalink}`,
    author: c.author,
    created: new Date(c.created_utc * 1000).toLocaleDateString(),
    numComments: 0,
  }))
}

async function fetchAndParse(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Reddit returned ${res.status}`)
  const data = await res.json()
  return data.data.children.map(({ data: p }) => ({
    id: p.id,
    title: p.title,
    text: p.selftext,
    upvotes: p.score,
    url: `https://reddit.com${p.permalink}`,
    author: p.author,
    created: new Date(p.created_utc * 1000).toLocaleDateString(),
    numComments: p.num_comments,
  }))
}