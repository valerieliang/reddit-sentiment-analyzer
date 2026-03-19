import React, { useState } from 'react'
import SentimentBadge from './SentimentBadge.jsx'

export default function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false)
  const top = post.emotions?.[0]

  return (
    <div className="post-card">
      <div className="post-card-top">
        <a href={post.url} target="_blank" rel="noreferrer" className="post-title">
          {post.title}
        </a>
        {top && <SentimentBadge label={top.label} score={top.score} />}
      </div>

      <div className="post-secondary-emotions">
        {post.emotions?.slice(1, 4).map(e => (
          <SentimentBadge key={e.label} label={e.label} score={e.score} />
        ))}
      </div>

      <div className="post-meta">
        <span>u/{post.author}</span>
        <span>⬆ {post.upvotes}</span>
        <span>💬 {post.numComments}</span>
      </div>

      {post.text && (
        <>
          <p className={`post-text ${expanded ? 'expanded' : ''}`}>{post.text}</p>
          {post.text.length > 200 && (
            <button className="show-more-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? '↑ less' : '↓ more'}
            </button>
          )}
        </>
      )}
    </div>
  )
}