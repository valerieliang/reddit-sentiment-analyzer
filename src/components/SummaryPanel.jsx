import React from 'react'

export default function SummaryPanel({ stats, subreddit, keyword }) {
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: '#ff6314', marginBottom: '0.5rem' }}>{stats.overall}</h2>
      <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>
        r/{subreddit} · "{keyword}" · avg score: {stats.avgScore}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {[['positive','#4caf50'], ['neutral','#9e9e9e'], ['negative','#f44336']].map(([label, color]) => (
          <div key={label}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{stats.counts[label]}</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}