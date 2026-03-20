import React, { useState } from 'react'
import { EMOTION_COLORS, EMOTION_EMOJI } from '../utils/sentiment.js'

export default function PostCard({ post }) {
  const [open, setOpen] = useState(false)
  const top = post.emotions?.[0]

  return (
    <div className="post-card">
      <div className="post-top">
        <a href={post.url} target="_blank" rel="noreferrer" className="post-title">
          {post.title}
        </a>
        {top && (
          <span className="e-badge" style={{
            background: (EMOTION_COLORS[top.label] || '#888') + '18',
            color: EMOTION_COLORS[top.label] || '#888',
            border: `1px solid ${(EMOTION_COLORS[top.label] || '#888')}30`,
          }}>
            {EMOTION_EMOJI[top.label]} {top.label} {Math.round(top.score * 100)}%
          </span>
        )}
      </div>

      <div className="post-emotions">
        {post.emotions?.slice(1, 3).map(e => (
          <span key={e.label} className="e-badge" style={{
            background: (EMOTION_COLORS[e.label] || '#888') + '10',
            color: (EMOTION_COLORS[e.label] || '#888') + 'aa',
            border: `1px solid ${(EMOTION_COLORS[e.label] || '#888')}20`,
          }}>
            {EMOTION_EMOJI[e.label]} {e.label}
          </span>
        ))}
      </div>

      <div className="post-footer">
        <span>u/{post.author}</span>
        <span>↑ {post.upvotes}</span>
        <span>{post.numComments} comments</span>
      </div>

      {post.text && (
        <>
          <p className={`post-body ${open ? 'open' : ''}`}>{post.text}</p>
          {post.text.length > 180 && (
            <button className="toggle-btn" onClick={() => setOpen(!open)}>
              {open ? '↑ less' : '↓ more'}
            </button>
          )}
        </>
      )}
    </div>
  )
}