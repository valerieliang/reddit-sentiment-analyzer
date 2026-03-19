import React, { useState } from 'react'
import SearchForm from './components/SearchForm.jsx'
import SummaryPanel from './components/SummaryPanel.jsx'
import SentimentChart from './components/SentimentChart.jsx'
import PostCard from './components/PostCard.jsx'
import { fetchByKeyword, fetchRecentPosts, fetchUserPosts, fetchUserComments } from './utils/reddit.js'
import { analyzeReddit } from './utils/api.js'
import { getSummaryStats } from './utils/sentiment.js'

export default function App() {
  const [posts, setPosts]       = useState([])
  const [stats, setStats]       = useState(null)
  const [summary, setSummary]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError]       = useState(null)

  async function handleSearch({ mode, subreddit, keyword, username, limit }) {
    setLoading(true)
    setError(null)
    setPosts([])
    setStats(null)
    setSummary(null)

    try {
      setProgress('fetching posts from reddit...')
      let raw = []
      if (mode === 0) raw = await fetchByKeyword(subreddit, keyword, limit)
      if (mode === 1) raw = await fetchRecentPosts(subreddit, limit)
      if (mode === 2) raw = await fetchUserPosts(username, limit)
      if (mode === 3) raw = await fetchUserComments(username, limit)

      if (raw.length === 0) throw new Error('No posts found.')

      setProgress(`analyzing ${raw.length} posts...`)
      const data = await analyzeReddit(raw)

      setStats(getSummaryStats(data.posts))
      setSummary(data.summary)
      setPosts(data.posts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }

  return (
    <div>
      <header className="app-header">
        <h1>Reddit<span>.</span>Sentiment</h1>
        <p className="subtitle">fine-tuned go_emotions · distilbert · 28 labels</p>
      </header>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {error    && <div className="status-msg error">{error}</div>}
      {progress && <div className="status-msg loading">⬡ {progress}</div>}

      {stats && (
        <>
          <SummaryPanel stats={stats} summary={summary} postCount={posts.length} />
          <SentimentChart avgEmotions={stats.avgEmotions} />
          <p className="posts-header">— {posts.length} posts analyzed</p>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </>
      )}
    </div>
  )
}