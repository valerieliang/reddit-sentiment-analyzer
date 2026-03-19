import React, { useState } from 'react'

export default function SearchForm({ onSearch, loading }) {
  const [subreddit, setSubreddit] = useState('')
  const [keyword, setKeyword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (subreddit.trim() && keyword.trim()) {
      onSearch(subreddit.trim(), keyword.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
      <input
        placeholder="Subreddit (e.g. technology)"
        value={subreddit}
        onChange={(e) => setSubreddit(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Keyword (e.g. AI)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={btnStyle}>
        {loading ? 'Analyzing...' : 'Search'}
      </button>
    </form>
  )
}

const inputStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: '1px solid #333',
  background: '#1a1a1a',
  color: '#fff',
  fontSize: '1rem',
  width: '220px',
}

const btnStyle = {
  padding: '0.6rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  background: '#ff6314',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
}