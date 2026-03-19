import React, { useState } from 'react'
import SearchForm from './components/SearchForm.jsx'
import SummaryPanel from './components/SummaryPanel.jsx'
import SentimentChart from './components/SentimentChart.jsx'
import PostCard from './components/PostCard.jsx'
import { analyzeReddit } from './utils/api.js'
import { getSummaryStats } from './utils/sentiment.js'

export default function App() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)

  async function handleSearch(params) {
    setLoading(true)
    setError(null)
    setPosts([])
    setStats(null)
    setSummary(null)
    setProgress('Fetching posts and running analysis...')

    try {
      const data = await analyzeReddit(params)
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Reddit Sentiment Analyzer</h1>
      <p className="subtitle">Powered by your fine-tuned go_emotions model</p>

      <SearchForm onSearch={handleSearch} loading={loading} modelReady={true} />

      {error && (
        <p style={{ color: '#f44336', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
      )}
      {progress && (
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '1rem' }}>{progress}</p>
      )}

      {stats && (
        <>
          <SummaryPanel stats={stats} summary={summary} postCount={posts.length} />
          <SentimentChart avgEmotions={stats.avgEmotions} />
          <h3 style={{ marginBottom: '1rem', color: '#aaa' }}>Posts ({posts.length})</h3>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </>
      )}
    </div>
  )
}