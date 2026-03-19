export async function fetchRedditPosts(subreddit, query, limit = 50) {
  const url =
    `https://www.reddit.com/r/${subreddit}/search.json` +
    `?q=${encodeURIComponent(query)}&restrict_sr=1&limit=${limit}&sort=new`

  const res = await fetch(url, { headers: { Accept: 'application/json' } })
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