import React from 'react'
import { EMOTION_COLORS, EMOTION_EMOJI } from '../utils/sentiment.js'
import SentimentBadge from './SentimentBadge.jsx'

export default function SummaryPanel({ stats, summary, postCount }) {
  const top   = stats.topEmotion
  const color = EMOTION_COLORS[top] || '#9e9e9e'
  const emoji = EMOTION_EMOJI[top]  || '😐'

  return (
    <div className="summary-panel" style={{ borderLeftColor: color }}>
      <div className="summary-top-emotion">
        <span className="summary-emoji">{emoji}</span>
        <span className="summary-label" style={{ color }}>{top}</span>
      </div>
      <p className="summary-meta">{postCount} posts · dominant emotion</p>

      {summary && <p className="summary-text">{summary}</p>}

      <div className="dominant-tags">
        {Object.entries(stats.dominantCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([label, count]) => (
            <SentimentBadge key={label} label={label} score={count / postCount} />
          ))}
      </div>
    </div>
  )
}