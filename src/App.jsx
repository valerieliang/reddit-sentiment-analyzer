import React, { useState, useEffect, useRef } from 'react'
import SearchForm from './components/SearchForm.jsx'
import SummaryPanel from './components/SummaryPanel.jsx'
import SentimentChart from './components/SentimentChart.jsx'
import PostCard from './components/PostCard.jsx'
import ModelLoader from './components/ModelLoader.jsx'
import { fetchByKeyword, fetchRecentPosts, fetchUserPosts, fetchUserComments } from './utils/reddit.js'
import { getSummaryStats } from './utils/sentiment.js'
import SentimentWorker from './workers/sentiment.worker.js?worker'

export default function App() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modelReady, setModelReady] = useState(false)
  const [modelProgress, setModelProgress] = useState(0)
  const [analyzeProgress, setAnalyzeProgress] = useState(null)
  const workerRef = useRef(null)

  useEffect(() => {
    const worker = new SentimentWorker()
    workerRef.current = worker

    worker.onmessage = (e) => {
      const { type } = e.data
      if (type === 'MODEL_LOADING') setModelProgress(e.data.progress)
      if (type === 'MODEL_READY') setModelReady(true)
      if (type === 'MODEL_ERROR') setError(e.data.error)
      if (type === 'PROGRESS') setAnalyzeProgress(`Analyzing post ${e.data.current} / ${e.data.total}`)
      if (type === 'DONE') {
        const analyzed = e.data.results
        setStats(getSummaryStats(analyzed))
        setPosts(analyzed)
        setLoading(false)
        setAnalyzeProgress(null)
      }
    }

    worker.postMessage({ type: 'LOAD_MODEL' })
    return () => worker.terminate()
  }, [])

  async function handleSearch({ mode, subreddit, keyword, username, limit }) {
    setLoading(true)
    setError(null)
    setPosts([])
    setStats(null)

    try {
      let raw = []
      if (mode === 0) raw = await fetchByKeyword(subreddit, keyword, limit)
      if (mode === 1) raw = await fetchRecentPosts(subreddit, limit)
      if (mode === 2) raw = await fetchUserPosts(username, limit)
      if (mode === 3) raw = await fetchUserComments(username, limit)

      if (raw.length === 0) throw new Error('No posts found.')
      workerRef.current.postMessage({ type: 'ANALYZE', payload: { posts: raw } })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Reddit Sentiment Analyzer</h1>
      <p className="subtitle">Powered by distilroberta emotion detection</p>

      <ModelLoader progress={modelProgress} ready={modelReady} />

      {modelReady && <SearchForm onSearch={handleSearch} loading={loading} modelReady={modelReady} />}

      {error && <p style={{ color: '#f44336', textAlign: 'center' }}>{error}</p>}
      {analyzeProgress && <p style={{ color: '#888', textAlign: 'center' }}>{analyzeProgress}</p>}

      {stats && (
        <>
          <SummaryPanel stats={stats} />
          <SentimentChart avgEmotions={stats.avgEmotions} />
          <h3 style={{ marginBottom: '1rem', color: '#aaa' }}>Posts ({posts.length})</h3>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </>
      )}
    </div>
  )
}