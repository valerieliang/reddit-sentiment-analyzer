import React from 'react'
import { EMOTION_COLORS, EMOTION_EMOJI } from '../utils/sentiment.js'

export default function SentimentBadge({ label, score }) {
  const color = EMOTION_COLORS[label] || '#9e9e9e'
  const emoji = EMOTION_EMOJI[label] || '❓'
  return (
    <span style={{
      background: color + '22',
      color,
      border: `1px solid ${color}55`,
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.8rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {emoji} {label}
      {score !== undefined && (
        <span style={{ marginLeft: '4px', opacity: 0.8 }}>
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  )
}