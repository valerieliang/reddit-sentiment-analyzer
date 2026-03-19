import React, { useState } from 'react'
import SearchForm from './components/SearchForm.jsx'
import SummaryPanel from './components/SummaryPanel.jsx'
import SentimentChart from './components/SentimentChart.jsx'
import PostCard from './components/PostCard.jsx'
import { fetchRedditPosts } from './utils/reddit.js'
import { analyzePosts, getSummaryStats } from './utils/sentiment.js'

export default function App() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSearch, setLastSearch] = useState({ subreddit: '', keyword: '' })

  async function handleSearch(subreddit, keyword) {
    setLoading(true)
    setError(null)
    setPosts([])
    setStats(null)
    setLastSearch({ subreddit, keyword })

    try {
      const raw = await fetchRedditPosts(subreddit, keyword)
      if (raw.length === 0) throw new Error('No posts found. Try a different keyword or subreddit.')
      const analyzed = analyzePosts(raw)
      setStats(getSummaryStats(analyzed))
      setPosts(analyzed)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Reddit Sentiment Analyzer</h1>
      <p className="subtitle">Search any subreddit for a keyword and see how Reddit feels about it</p>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {error && <p style={{ color: '#f44336', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

      {stats && (
        <>
          <SummaryPanel stats={stats} subreddit={lastSearch.subreddit} keyword={lastSearch.keyword} />
          <SentimentChart counts={stats.counts} />
          <h3 style={{ marginBottom: '1rem', color: '#aaa' }}>Posts ({posts.length})</h3>
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </>
      )}
    </div>
  )
}