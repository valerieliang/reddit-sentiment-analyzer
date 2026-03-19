import React from 'react'
import { EMOTION_COLORS } from '../utils/sentiment.js'

const EMOJI = {
  joy: '😄', anger: '😠', sadness: '😢',
  fear: '😨', surprise: '😲', disgust: '🤢', neutral: '😐'
}

export default function SentimentBadge({ label, score }) {
  const color = EMOTION_COLORS[label] || '#9e9e9e'
  return (
    <span style={{
      background: color + '22',
      color,
      border: `1px solid ${color}55`,
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.8rem',
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }}>
      {EMOJI[label]} {label} {score !== undefined && `${Math.round(score * 100)}%`}
    </span>
  )
}