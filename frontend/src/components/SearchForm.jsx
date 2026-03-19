import React, { useState } from 'react'

const MODES = ['subreddit + keyword', 'subreddit recent', 'user posts', 'user comments']

export default function SearchForm({ onSearch, loading, modelReady }) {
  const [mode, setMode] = useState(0)
  const [subreddit, setSubreddit] = useState('')
  const [keyword, setKeyword] = useState('')
  const [username, setUsername] = useState('')
  const [limit, setLimit] = useState(15)

  function handleSubmit(e) {
    e.preventDefault()
    onSearch({ mode, subreddit, keyword, username, limit })
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {MODES.map((m, i) => (
          <button key={m} onClick={() => setMode(i)} style={{
            padding: '0.4rem 0.9rem', borderRadius: '999px', border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            background: mode === i ? '#ff6314' : '#2a2a2a',
            color: mode === i ? '#fff' : '#888',
          }}>{m}</button>
        ))}
      </div>

      {/* Inputs */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {(mode === 0 || mode === 1) && (
          <input placeholder="Subreddit" value={subreddit} onChange={e => setSubreddit(e.target.value)} style={inputStyle} />
        )}
        {mode === 0 && (
          <input placeholder="Keyword" value={keyword} onChange={e => setKeyword(e.target.value)} style={inputStyle} />
        )}
        {(mode === 2 || mode === 3) && (
          <input placeholder="Reddit username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
        )}
        <select value={limit} onChange={e => setLimit(Number(e.target.value))} style={{ ...inputStyle, width: 'auto' }}>
          {[10, 15, 25, 50].map(n => <option key={n} value={n}>{n} posts</option>)}
        </select>
        <button type="submit" disabled={loading || !modelReady} style={{
          ...btnStyle,
          background: modelReady ? '#ff6314' : '#444',
          cursor: modelReady ? 'pointer' : 'not-allowed'
        }}>
          {loading ? 'Analyzing...' : !modelReady ? 'Loading model...' : 'Analyze'}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #333',
  background: '#1a1a1a', color: '#fff', fontSize: '1rem', width: '200px',
}
const btnStyle = {
  padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '1rem',
}