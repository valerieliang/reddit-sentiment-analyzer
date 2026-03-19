import React from 'react'
import { EMOTION_COLORS, EMOTION_EMOJI } from '../utils/sentiment.js'

export default function SentimentBadge({ label, score, large }) {
  const color = EMOTION_COLORS[label] || '#9e9e9e'
  const emoji = EMOTION_EMOJI[label] || '·'
  return (
    <span className="emotion-badge" style={{
      background: color + '18',
      color,
      border: `1px solid ${color}33`,
      fontSize: large ? '0.85rem' : '0.72rem',
    }}>
      {emoji} {label}
      {score !== undefined && (
        <span style={{ opacity: 0.7, marginLeft: 2 }}>{Math.round(score * 100)}%</span>
      )}
    </span>
  )
}