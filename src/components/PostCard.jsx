import React from 'react'
import SentimentBadge from './SentimentBadge.jsx'

export default function PostCard({ post }) {
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <a href={post.url} target="_blank" rel="noreferrer" style={{ color: '#e0e0e0', fontWeight: 600, textDecoration: 'none', flex: 1 }}>
          {post.title}
        </a>
        <SentimentBadge label={post.label} />
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
        u/{post.author} · {post.created} · ⬆ {post.upvotes} · 💬 {post.numComments}
        &nbsp;· score: <strong style={{ color: '#aaa' }}>{post.sentimentScore}</strong>
      </div>
      {post.text && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999', maxHeight: '60px', overflow: 'hidden' }}>
          {post.text}
        </p>
      )}
    </div>
  )
}