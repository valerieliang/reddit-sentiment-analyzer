import React, { useState } from 'react'
import SentimentBadge from './SentimentBadge.jsx'

export default function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false)
  const top = post.emotions?.[0]

  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <a href={post.url} target="_blank" rel="noreferrer"
          style={{ color: '#e0e0e0', fontWeight: 600, textDecoration: 'none', flex: 1 }}>
          {post.title}
        </a>
        {top && <SentimentBadge label={top.label} score={top.score} />}
      </div>

      {/* secondary emotions */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        {post.emotions?.slice(1).map(e => (
          <SentimentBadge key={e.label} label={e.label} score={e.score} />
        ))}
      </div>

      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
        u/{post.author} · ⬆ {post.upvotes} · 💬 {post.numComments}
      </div>

      {post.text && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#999', maxHeight: expanded ? 'none' : '60px', overflow: 'hidden' }}>
            {post.text}
          </p>
          {post.text.length > 200 && (
            <button onClick={() => setExpanded(!expanded)}
              style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer', padding: 0, marginTop: '4px' }}>
              {expanded ? 'show less' : 'show more'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}