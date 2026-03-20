import React, { useState } from 'react'

const MODES = ['keyword', 'recent', 'user posts', 'comments']

export default function SearchForm({ onSearch, loading }) {
  const [mode, setMode]           = useState(0)
  const [subreddit, setSubreddit] = useState('')
  const [keyword, setKeyword]     = useState('')
  const [username, setUsername]   = useState('')
  const [limit, setLimit]         = useState(15)

  function submit(e) {
    e.preventDefault()
    onSearch({ mode, subreddit, keyword, username, limit })
  }

  return (
    <div className="search-box">
      <div className="mode-row">
        {MODES.map((m, i) => (
          <button key={m} className={`mode-chip ${mode === i ? 'active' : ''}`}
            onClick={() => setMode(i)}>{m}</button>
        ))}
      </div>
      <form className="input-row" onSubmit={submit}>
        {(mode === 0 || mode === 1) && (
          <input className="field" placeholder="subreddit" value={subreddit}
            onChange={e => setSubreddit(e.target.value)} />
        )}
        {mode === 0 && (
          <input className="field" placeholder="keyword" value={keyword}
            onChange={e => setKeyword(e.target.value)} />
        )}
        {(mode === 2 || mode === 3) && (
          <input className="field" placeholder="username" value={username}
            onChange={e => setUsername(e.target.value)} />
        )}
        <select className="field field-sm" value={limit}
          onChange={e => setLimit(Number(e.target.value))}>
          {[10, 15, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button className="analyze-btn" type="submit" disabled={loading}>
          {loading ? '...' : 'Analyze'}
        </button>
      </form>
    </div>
  )
}