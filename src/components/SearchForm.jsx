import React, { useState } from 'react'

const MODES = ['subreddit + keyword', 'subreddit recent', 'user posts', 'user comments']

export default function SearchForm({ onSearch, loading }) {
  const [mode, setMode]         = useState(0)
  const [subreddit, setSubreddit] = useState('')
  const [keyword, setKeyword]   = useState('')
  const [username, setUsername] = useState('')
  const [limit, setLimit]       = useState(15)

  function handleSubmit(e) {
    e.preventDefault()
    onSearch({ mode, subreddit, keyword, username, limit })
  }

  return (
    <div className="search-wrap">
      <div className="mode-tabs">
        {MODES.map((m, i) => (
          <button key={m} className={`mode-tab ${mode === i ? 'active' : ''}`} onClick={() => setMode(i)}>
            {m}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="search-row">
        {(mode === 0 || mode === 1) && (
          <input className="search-input" placeholder="subreddit" value={subreddit}
            onChange={e => setSubreddit(e.target.value)} />
        )}
        {mode === 0 && (
          <input className="search-input" placeholder="keyword" value={keyword}
            onChange={e => setKeyword(e.target.value)} />
        )}
        {(mode === 2 || mode === 3) && (
          <input className="search-input" placeholder="username" value={username}
            onChange={e => setUsername(e.target.value)} />
        )}
        <select className="search-select" value={limit} onChange={e => setLimit(Number(e.target.value))}>
          {[10, 15, 25, 50].map(n => <option key={n} value={n}>{n} posts</option>)}
        </select>
        <button className="search-btn" type="submit" disabled={loading}>
          {loading ? '...' : 'analyze →'}
        </button>
      </form>
    </div>
  )
}